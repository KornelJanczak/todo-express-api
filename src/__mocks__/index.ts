import { Request, Response, NextFunction, query } from "express";
import uuid4 from "uuid4";
import { Pool, QueryResult } from "pg";
import { User } from "../models/user";

export const mockRequest = {
  params: { id: uuid4() },
  user: {
    id: uuid4(),
  },
  todo: {
    id: uuid4(),
    user_id: uuid4(),
    content: "Test todo",
    priority: "high",
  },
} as unknown as Request;

export const mockResponse = {
  send: jest.fn().mockReturnThis(),
  status: jest.fn().mockReturnThis(),
  json: jest.fn().mockReturnThis(),
} as unknown as Response;

export const mockNext = jest.fn() as unknown as NextFunction;

export const mockPool = {
  query: jest.fn(),
} as unknown as Pool;

export const mockUser: Partial<User> = {
  id: uuid4(),
  email: "test@gmail.com",
  todos: [],
};
