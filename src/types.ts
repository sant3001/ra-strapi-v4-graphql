import type { QueryClient, QueryClientConfig } from 'react-query';
import type { AuthProvider } from 'ra-core';

export interface BuildAuthProvider {
  (options: BuildAuthProviderOptions): AuthProvider;
}

export interface BuildAuthProviderOptions {
  queryClient?: QueryClient;
  queryClientConfig?: QueryClientConfig;
  url: string;
  checkAuthOptions?: RejectOptions;
  checkErrorOptions?: RejectOptions;
  loginOptions?: RejectOptions;
  logoutOptions?: ResolveOptions;
  getIdentityOptions?: GetIdentityOptions;
}

export interface RejectOptions {
  redirectTo?: string | false;
  message?: string | false;
}

export interface ResolveOptions {
  redirectTo?: string | false;
}

export interface GetIdentityOptions {
  transform: (user: UsersPermissionsMe) => GetIdentityResult;
}

export interface GetIdentityResult {
  id: string;
  fullName: string;
  avatar?: string;
}

export interface LoginParams {
  username: string;
  password: string;
}

export interface UsersPermissionsLogin {
  login?: UsersPermissionsLoginPayload;
}

export interface UsersPermissionsLoginPayload {
  jwt?: string;
  user: UsersPermissionsMe;
}

export interface UsersPermissionsMe {
  id: string;
  username: string;
  email?: string;
  confirmed?: boolean;
  blocked?: boolean;
  role?: UsersPermissionsMeRole;
}

export interface UsersPermissionsMeRole {
  id: string;
  name: string;
  description?: string;
  type: string;
}
