/**
 * Custom error class for API interactions.
 * Handles different error types and status codes in a centralized way.
 */
export class ApiError extends Error {
  public statusCode: number;
  public data: any;

  constructor(message: string, statusCode: number = 500, data: any = null) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.data = data;

    // Maintain consistent stack trace for debugging
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError);
    }
  }

  static fromResponse(response: any): ApiError {
    const message = response?.message || response?.error || "An unexpected error occurred.";
    const status = response?.status || 500;
    return new ApiError(message, status, response);
  }
}
