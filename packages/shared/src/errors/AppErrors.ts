//* Custom error class for application-specific errors
//*AppErrors.ts defines AppError, a custom error class for application-specific failures.
//*It carries a statusCode and an isOperational flag, so your app can respond with structured HTTP errors instead of plain thrown exceptions.
export class AppError extends Error {
  readonly statusCode: number;
  readonly isOperational: boolean;
  constructor(statusCode: number, message: string, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
  }
}
