export class AppError extends Error {
  statusCode: number;
  status: string;
  isOperational: boolean;

  constructor(message: string, statusCode: number, stack?: string) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.stack = stack || "There is no better error stack";
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}
