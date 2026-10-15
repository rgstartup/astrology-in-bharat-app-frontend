/**
 * Storybook replacement for the client `@/actions` module.
 *
 * The real module builds network clients at import time and posts reviews
 * over the network on submit. Stories need neither, so the webpack alias in
 * `.storybook/main.ts` points `@/actions` at this deterministic stub.
 */

type PostSuccess<T> = { ok: true; data: T | null };

type PostArgs = {
  url: string;
  body?: unknown;
};

function resolvePost<T>({ url, body }: PostArgs): Promise<PostSuccess<T>> {
  void url;
  void body;
  return Promise.resolve({ ok: true, data: null });
}

export const apiV2 = {
  post: <T,>(url: string, body?: unknown): Promise<PostSuccess<T>> =>
    resolvePost<T>({ url, body }),
};

export const api = {
  post: <T,>(url: string, body?: unknown): Promise<readonly [T | null, null]> => {
    void url;
    void body;
    return Promise.resolve([null, null] as const);
  },
};
