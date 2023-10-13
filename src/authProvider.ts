import type { AuthProvider, UserIdentity } from 'ra-core';

export const authProvider: AuthProvider = {
  checkAuth: async <TParams>(params: TParams): Promise<void> => {
    console.log('checkAuth', { params });
    return Promise.resolve(undefined);
  },
  checkError: async <TError extends Error>(error: TError): Promise<void> => {
    console.log('checkError', { error });
    return Promise.resolve(undefined);
  },
  getIdentity: async (): Promise<UserIdentity> => {
    console.log('getIdentity');
    return Promise.resolve(undefined);
  },
  getPermissions: async <TParams>(params: TParams): Promise<any> => {
    console.log('getPermissions', { params });
    return Promise.resolve(undefined);
  },
  handleCallback: async (): Promise<any> => {
    console.log('handleCallback');
    return Promise.resolve(undefined);
  },
  login: async (params: any): Promise<any> => {
    console.log('login', { params });
    return Promise.resolve(undefined);
  },
  logout: async (params: any): Promise<void | false | string> => {
    console.log('logout', { params });
    return Promise.resolve(undefined);
  },
};
