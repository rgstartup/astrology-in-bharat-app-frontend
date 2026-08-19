export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;

  if (typeof error !== 'object' || error === null) return String(error);
  
  // Handle common API error structures
  const anyError = error as any;
  if (anyError.message) return String(anyError.message);
  if (anyError.body?.message) return String(anyError.body.message);
  if (anyError.error?.message) return String(anyError.error.message);

  try {
    return JSON.stringify(error);
  } catch {
    return String(error);
  }
}
