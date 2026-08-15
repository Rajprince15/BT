/**
 * Typed error surface. Anything thrown that inherits from AppError is turned
 * into the Section-5 error envelope by the central error-handler middleware.
 */

export class AppError extends Error {
  public readonly status: number;
  public readonly code: string;
  public readonly fields?: Record<string, string>;

  constructor(status: number, code: string, message: string, fields?: Record<string, string>) {
    super(message);
    this.status = status;
    this.code = code;
    if (fields) this.fields = fields;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class BadRequestError extends AppError {
  constructor(message = 'Bad request', fields?: Record<string, string>, code = 'BAD_REQUEST') {
    super(400, code, message, fields);
  }
}

export class ValidationError extends AppError {
  constructor(fields: Record<string, string>, message = 'Please correct the highlighted fields.') {
    super(400, 'VALIDATION_ERROR', message, fields);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Please sign in.', code = 'UNAUTHORIZED') {
    super(401, code, message);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'You do not have permission to perform this action.', code = 'FORBIDDEN') {
    super(403, code, message);
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Resource not found.', code = 'NOT_FOUND') {
    super(404, code, message);
  }
}

export class ConflictError extends AppError {
  constructor(message = 'Conflict', code = 'CONFLICT') {
    super(409, code, message);
  }
}

export class TooManyRequestsError extends AppError {
  constructor(message = 'Too many attempts. Please try again shortly.', code = 'RATE_LIMITED') {
    super(429, code, message);
  }
}

export class ServerError extends AppError {
  constructor(message = 'Something went wrong on our side.', code = 'SERVER_ERROR') {
    super(500, code, message);
  }
}
