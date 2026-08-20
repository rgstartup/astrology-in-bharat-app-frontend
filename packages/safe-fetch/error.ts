// Error body structure returned by the API
export interface ApiErrorBody {
  statusCode: number;
  errorCode?: string;
  message: string;
  path: string;
  timestamp: string;
}

// Custom error class to capture API errors with status, message, body, and headers
export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public body?: ApiErrorBody,
    public headers?: Headers,
  ) {
    super(message);
    this.name = "ApiError";
  }
}
