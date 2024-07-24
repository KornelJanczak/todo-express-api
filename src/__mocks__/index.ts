import { Request, Response, NextFunction } from "express";
import uuid4 from "uuid4";

export const mockRequest = {
  params: { id: uuid4() },
} as unknown as Request;

export const mockResponse = {
  send: jest.fn().mockReturnThis(),
  status: jest.fn().mockReturnThis(),
  json: jest.fn().mockReturnThis(),
} as unknown as Response;

export const mockNext = jest.fn() as unknown as NextFunction;

export const mockPool = {
  query: jest.fn(),
};
