export const createError = (code: string, message: string, status: number) => ({
  code,
  message,
  status,
});

export const Errors = {
  FORBIDDEN: createError("FORBIDDEN", "Insufficient permissions", 403),
  RESOURCE_NOT_FOUND: createError(
    "RESOURCE_NOT_FOUND",
    "The requested resource could not be found",
    404,
  ),
  BAD_REQUEST: createError("BAD_REQUEST", "Required params are missing", 400),
  UNEXPECTED_ERROR: createError(
    "UNEXPECTED_ERROR",
    "Something went wrong.",
    400,
  ),
  METHOD_NOT_SUPPORTED: createError(
    "METHOD_NOT_SUPPORTED",
    "This method is not supported",
    405,
  ),
};
