import { Request, Response } from "express";

export const mockRequest = {} as Request;
export const mockResponse = {
  send: jest.fn().mockReturnThis(),
  status: jest.fn().mockReturnThis(),
  json: jest.fn().mockReturnThis(),
} as unknown as Response;
