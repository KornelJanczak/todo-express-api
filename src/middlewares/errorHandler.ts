import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/appError";

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  let statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  let message;

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err instanceof Error) {
    message = err.message;
  }

  const responseBody = {
    statusCode,
    message,
    stack: process.env.NODE_ENV === "production" ? "🥞" : err.stack,
  };

  console.error("Error:", responseBody);
  return res.status(statusCode).json(responseBody);
}
