// Error body structure returned by the API
export type FieldErrors = Record<string, string[]>;

export interface ApiErrorBody {
  status?: number;
  statusCode?: number;
  errorCode?: string;
  message?: string | string[];
  fieldErrors?: FieldErrors;
  path?: string;
  timestamp?: string;
  [key: string]: unknown;
}

export interface ApiErrorOptions {
  cause?: unknown;
  callSiteStack?: string;
  errorCode?: string;
  fieldErrors?: FieldErrors;
}

export interface ApiErrorPayload {
  status: number;
  errorCode?: string;
  message: string;
  fieldErrors?: FieldErrors;
  body?: ApiErrorBody;
  headers?: Headers;
  cause?: unknown;
  callSiteStack?: string;
  options?: ApiErrorOptions;
}

function cleanStack(
  callSiteStack: string | undefined,
  errorName: string,
  errorMessage: string,
): string | undefined {
  if (!callSiteStack) return undefined;

  const lines = callSiteStack.split("\n");
  if (lines.length === 0) return undefined;

  const header = errorMessage ? `${errorName}: ${errorMessage}` : errorName;

  // Filter out the initial "Error" header line if present
  const frames = lines[0]?.startsWith("Error") ? lines.slice(1) : lines;

  // Find the first frame that is outside of the safe-fetch package internals
  const callerFrameIndex = frames.findIndex((line) => {
    const trimmed = line.trim();
    if (!trimmed) return false;
    const lower = line.toLowerCase();
    const isInternal =
      lower.includes("safefetch") ||
      lower.includes("safe-fetch") ||
      lower.includes("executefetch") ||
      lower.includes("createsafefetchinstance") ||
      lower.includes("createsafefetchresultinstance") ||
      lower.includes("any-signal") ||
      lower.includes("body-parser");

    return !isInternal;
  });

  if (callerFrameIndex !== -1) {
    return [header, ...frames.slice(callerFrameIndex)].join("\n");
  }

  return [header, ...frames].join("\n");
}

// Custom error class to capture API errors with status, message, errorCode, fieldErrors, body, headers, and call-site stack trace
export class ApiError extends Error {
  public status: number;
  public errorCode?: string;
  public fieldErrors?: FieldErrors;
  public body?: ApiErrorBody;
  public headers?: Headers;
  public cause?: unknown;

  constructor(payload: ApiErrorPayload);
  constructor(
    status: number,
    message: string,
    body?: ApiErrorBody,
    headers?: Headers,
    options?: ApiErrorOptions,
  );
  constructor(
    statusOrPayload: number | ApiErrorPayload,
    message?: string,
    body?: ApiErrorBody,
    headers?: Headers,
    options?: ApiErrorOptions,
  ) {
    let finalStatus: number;
    let finalMessage: string;
    let finalBody: ApiErrorBody | undefined;
    let finalHeaders: Headers | undefined;
    let finalErrorCode: string | undefined;
    let finalFieldErrors: FieldErrors | undefined;
    let finalOptions: ApiErrorOptions | undefined;

    if (typeof statusOrPayload === "object" && statusOrPayload !== null) {
      finalStatus = statusOrPayload.status;
      finalMessage = statusOrPayload.message;
      finalErrorCode = statusOrPayload.errorCode ?? statusOrPayload.body?.errorCode;
      finalFieldErrors = statusOrPayload.fieldErrors ?? statusOrPayload.body?.fieldErrors;
      finalBody = statusOrPayload.body;
      finalHeaders = statusOrPayload.headers;
      finalOptions = {
        cause: statusOrPayload.cause ?? statusOrPayload.options?.cause,
        callSiteStack: statusOrPayload.callSiteStack ?? statusOrPayload.options?.callSiteStack,
        errorCode: finalErrorCode,
        fieldErrors: finalFieldErrors,
      };
    } else {
      finalStatus = statusOrPayload;
      finalMessage = message || "Unknown API Error";
      finalBody = body;
      finalHeaders = headers;
      finalErrorCode = options?.errorCode ?? body?.errorCode;
      finalFieldErrors = options?.fieldErrors ?? body?.fieldErrors;
      finalOptions = options;
    }

    super(finalMessage);
    this.name = "ApiError";
    this.status = finalBody?.status ?? finalBody?.statusCode ?? finalStatus;
    this.errorCode = finalErrorCode;
    this.fieldErrors = finalFieldErrors;
    this.body = finalBody;
    this.headers = finalHeaders;

    if (finalOptions?.cause !== undefined) {
      this.cause = finalOptions.cause;
    }

    if (finalOptions?.callSiteStack) {
      const cleaned = cleanStack(finalOptions.callSiteStack, this.name, finalMessage);
      if (cleaned) {
        this.stack = cleaned;
        try {
          Object.defineProperty(this, "stack", {
            value: cleaned,
            writable: true,
            configurable: true,
          });
        } catch {
          // Ignore
        }
      }
    } else {
      const v8Error = Error as unknown as {
        captureStackTrace?: (target: object, constructorOpt?: unknown) => void;
      };
      v8Error.captureStackTrace?.(this, ApiError);
    }
  }

  isValidationError(): boolean {
    return (
      this.errorCode === "VALIDATION_ERROR" ||
      Boolean(this.fieldErrors && Object.keys(this.fieldErrors).length > 0)
    );
  }

  getFieldError(field: string): string | undefined {
    return this.fieldErrors?.[field]?.[0];
  }

  getFieldErrors(field: string): string[] {
    return this.fieldErrors?.[field] ?? [];
  }
}
