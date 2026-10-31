import { ApiError, type FieldErrors } from "@repo/safe-fetch";

export class ValidationError extends ApiError {
  constructor(
    fieldErrors: FieldErrors = {},
    message = "Please correct the highlighted fields.",
  ) {
    super({
      status: 400,
      errorCode: "VALIDATION_ERROR",
      message,
      fieldErrors,
    });
    this.name = "ValidationError";
    Object.setPrototypeOf(this, ValidationError.prototype);
  }

  /**
   * Factory method to create a ValidationError from a ZodError
   */
  static fromZod(
    error:
      | { flatten: () => { fieldErrors: FieldErrors } }
      | { issues?: Array<{ path: (string | number)[]; message: string }> },
    message = "Please correct the highlighted fields.",
  ): ValidationError {
    let fieldErrors: FieldErrors = {};

    if (error && "flatten" in error && typeof error.flatten === "function") {
      fieldErrors = error.flatten().fieldErrors;
    } else if (error && "issues" in error && Array.isArray(error.issues)) {
      for (const issue of error.issues) {
        const key = issue.path.join(".");
        if (!fieldErrors[key]) fieldErrors[key] = [];
        fieldErrors[key].push(issue.message);
      }
    }

    return new ValidationError(fieldErrors, message);
  }
}
