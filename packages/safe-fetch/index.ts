export { default as safeFetch } from "./safeFetch";
export { createSafeFetchInstance } from "./safeFetch";
export { ApiError, type ApiErrorBody } from "./error";
export type {
  SafeFetchInstance,
  SafeFetchInstanceConfig,
  SafeFetchInit,
} from "./safeFetch";

import safeFetch from "./safeFetch";
export default safeFetch;
