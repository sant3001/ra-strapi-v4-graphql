import type { RejectOptions, ResolveOptions } from './types';

export const reject = (rejectOpts?: RejectOptions) => {
  if (!rejectOpts) return Promise.reject();
  const { redirectTo, message } = rejectOpts;
  return Promise.reject({
    ...(redirectTo != null ? { redirectTo } : {}),
    ...(redirectTo != null ? { message } : {}),
  });
};

export const resolve = (resolveOpts?: ResolveOptions) => {
  if (!resolveOpts) return Promise.resolve();
  const { redirectTo } = resolveOpts;
  return Promise.resolve(redirectTo);
};
