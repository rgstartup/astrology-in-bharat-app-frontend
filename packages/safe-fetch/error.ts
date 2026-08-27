// Error body structure returned by the API
export interface ApiErrorBody {
  statusCode: number;
  errorCode?: string;
  message: string;
  path: string;
  timestamp: string;
}

export interface ApiErrorOptions {
  cause?: unknown;
  callSiteStack?: string;
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
      lower.includes("any-signal") ||
      lower.includes("body-parser");

    return !isInternal;
  });

  if (callerFrameIndex !== -1) {
    return [header, ...frames.slice(callerFrameIndex)].join("\n");
  }

  return [header, ...frames].join("\n");
}

// Custom error class to capture API errors with status, message, body, headers, and call-site stack trace
export class ApiError extends Error {
  public cause?: unknown;

  constructor(
    public status: number,
    message: string,
    public body?: ApiErrorBody,
    public headers?: Headers,
    options?: ApiErrorOptions,
  ) {
    super(message);
    this.name = "ApiError";

    if (options?.cause !== undefined) {
      this.cause = options.cause;
    }

    if (options?.callSiteStack) {
      const cleaned = cleanStack(options.callSiteStack, this.name, message);
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
}
