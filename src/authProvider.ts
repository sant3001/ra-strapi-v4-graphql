import type { AuthProvider, UserIdentity } from 'ra-core';
import { QueryClient } from 'react-query';
import { request } from 'graphql-request';
import { LOGIN_MUTATION } from './mutations';
import type {
  BuildAuthProvider,
  LoginParams,
  UsersPermissionsLogin,
  UsersPermissionsMe,
} from './types';
import { reject, resolve } from './utils';

export const buildAuthProvider: BuildAuthProvider = (options) => {
  const queryClient =
    options?.queryClient || new QueryClient(options?.queryClientConfig);
  const { url: graphQLUrl } = options;

  const authProvider: AuthProvider = {
    checkAuth: async (): Promise<void> => {
      const jwt = localStorage.getItem('jwt');
      if (jwt) return Promise.resolve(undefined);
      return reject({ message: 'Login Required', ...options.checkAuthOptions });
    },
    checkError: async <TError extends { status: number }>(
      error: TError,
    ): Promise<void> => {
      const status = error.status;
      if (status === 401 || status === 403) {
        localStorage.removeItem('jwt');
        localStorage.removeItem('user');
        return reject({
          message: 'Unauthorized user!',
          ...options.checkErrorOptions,
        });
      }
      return Promise.resolve();
    },
    getIdentity: async (): Promise<UserIdentity> => {
      try {
        const userJSON = localStorage.getItem('user');
        const user = JSON.parse(userJSON) as UsersPermissionsMe;
        if (options.getIdentityOptions?.transform) {
          return Promise.resolve(options.getIdentityOptions.transform(user));
        }
        const { id, username } = user;
        return Promise.resolve({ id, fullName: username });
      } catch (error) {
        return Promise.reject(error);
      }
    },
    getPermissions: async (): Promise<void> => {
      return Promise.resolve(undefined);
    },
    login: async (params: LoginParams): Promise<void> => {
      return await queryClient.fetchQuery(['loginQuery'], async () => {
        try {
          const { username, password } = params;
          const result = await request<UsersPermissionsLogin>(
            graphQLUrl,
            LOGIN_MUTATION,
            { input: { identifier: username, password } },
          );
          const { login } = result;
          if (login?.jwt) {
            localStorage.setItem('jwt', login.jwt);
            localStorage.setItem('user', JSON.stringify(login.user));
            return Promise.resolve(undefined);
          }
          return reject(options.loginOptions);
        } catch (e) {
          return reject({
            message: 'Invalid Credentials',
            ...options.loginOptions,
          });
        }
      });
    },
    logout: async (): Promise<void | false | string> => {
      localStorage.removeItem('jwt');
      localStorage.removeItem('user');
      return resolve(options.logoutOptions);
    },
  };

  return authProvider;
};
