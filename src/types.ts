import type { QueryClient, QueryClientConfig } from 'react-query';
import type { AuthProvider, DataProvider } from 'ra-core';
import { Variables } from 'graphql-request';

export interface BuildProvider {
  (options: BuildProviderOptions): BuildProviderResult;
}

export interface BuildProviderResult {
  authProvider: AuthProvider;
  dataProvider: DataProvider;
}

export interface BuildAuthProvider {
  (options: BuildProviderOptionsBase & BuildAuthProviderOptions): AuthProvider;
}

export interface BuildDataProvider {
  (options: BuildProviderOptionsBase & BuildDataProviderOptions): DataProvider;
}

export interface BuildProviderOptionsBase {
  queryClient?: QueryClient;
  queryClientConfig?: QueryClientConfig;
  url: string;
}

export interface BuildProviderOptions extends BuildProviderOptionsBase {
  authProviderOptions?: BuildAuthProviderOptions;
  dataProviderOptions?: BuildDataProviderOptions;
}

export interface BuildAuthProviderOptions {
  checkAuth?: RejectOptions;
  checkError?: RejectOptions;
  login?: RejectOptions;
  logout?: ResolveOptions;
  getIdentity?: GetIdentityOptions;
}

export interface BuildDataProviderOptions {
  defaultFields?: JSONFields;
}

export type JSONFields = { [key: string]: true | JSONFields };

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

export interface EntityResponseCollection<R extends Record<string, unknown>, T = Entity<R>> {
  data: T[];
  meta: ResponseCollectionMeta;
}

export interface EntityResponse<R extends Record<string, unknown>> {
  data: Entity<R>;
}

export interface Entity<T extends Record<string, unknown>> {
  id: string;
  attributes: T;
}

export interface ResponseCollectionMeta {
  pagination: Pagination;
}

export interface Pagination {
  total: number;
  page: number;
  pageSize: number;
  pageCount: number;
}

export interface BuildGraphQLQueryOpts {
  graphQLUrl: string;
  resource: string;
  isCollection?: boolean;
  variables: Variables;
  fields: JSONFields;
  operation?: Operation;
}

export enum Operation {
  Create = 'create',
  Update = 'update',
  Delete = 'delete',
}
