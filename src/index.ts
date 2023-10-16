import { buildAuthProvider } from './authProvider';
import { buildDataProvider } from './dataProvider';
import { BuildProvider } from './types';

export * from './authProvider';
export * from './dataProvider';
export * from './types';

export const buildProviders: BuildProvider = (options) => {
  const { authProviderOptions, dataProviderOptions, ...baseOptions } = options;
  const authProvider = buildAuthProvider({
    ...baseOptions,
    ...authProviderOptions,
  });
  const dataProvider = buildDataProvider({
    ...baseOptions,
    ...dataProviderOptions,
  });
  return { authProvider, dataProvider };
};
