import { ApiErrorBody, ApiError } from "./error";

export type Result<T, TErrorBody extends ApiErrorBody = ApiErrorBody> =
  | { ok: true; data: T; error?: never }
  | { ok: false; error: ApiError<TErrorBody>; data?: never };

// type ResultState = "success" | "failure";

// /**
//  * Wraps a successful value or an API error in a discriminated result.
//  */
// export class Result<
//   T,
//   TErrorBody extends ApiErrorBody = ApiErrorBody,
//   TState extends ResultState = ResultState,
// > {
//   private constructor(
//     public readonly ok: TState extends "success" ? true : false,
//     public readonly data: TState extends "success" ? T : never,
//     public readonly error: TState extends "failure"
//       ? ApiError<TErrorBody>
//       : never,
//   ) {}

//   /** Creates a successful result. */
//   static success<T>(data: T): Result<T, never, "success"> {
//     return new Result<T, never, "success">(true, data, undefined as never);
//   }

//   /** Creates a failed result. */
//   static failure<TErrorBody extends ApiErrorBody>(
//     error: ApiError<TErrorBody>,
//   ): Result<never, TErrorBody, "failure"> {
//     return new Result<never, TErrorBody, "failure">(
//       false,
//       undefined as never,
//       error,
//     );
//   }
// }
