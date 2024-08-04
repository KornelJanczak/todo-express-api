/// <reference types="jest" />
import { describe, it, beforeEach } from "@jest/globals";
import {
  getTodos,
  getTodo,
  createTodo,
  updateTodo,
  deleteTodo,
} from "../controllers/todo";
import { mockNext, mockRequest, mockResponse } from "../__mocks__";
import uuid4 from "uuid4";
import { todoRepository } from "../repositories";
import { Priority, Todo } from "../models/todo";
import { AppError } from "../errors/appError";

const mockTodo = {
  id: uuid4(),
  content: "Test Todo",
  priority: "high" as Priority,
  user_id: uuid4(),
};

describe("get todos", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("should get all todos and return 200", async () => {
    const todos = [mockTodo];

    jest.spyOn(todoRepository, "findAll").mockResolvedValue(todos);

    await getTodos(mockRequest, mockResponse, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.send).toHaveBeenCalledWith({ todos });
  });

  it("should return status 200 and an empty list when repository has no todos", async () => {
    const todos: Todo[] = [];

    jest.spyOn(todoRepository, "findAll").mockResolvedValue(todos);

    await getTodos(mockRequest, mockResponse, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.send).toHaveBeenCalledWith({ todos });
  });

  it("should return status 404 when any todo hasn't been found", async () => {
    jest.spyOn(todoRepository, "findAll").mockResolvedValue(null);

    await getTodos(mockRequest, mockResponse, mockNext);

    expect(mockNext).toHaveBeenCalledWith(expect.any(AppError));
    expect(mockNext).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "No todos found!",
        statusCode: 404,
      })
    );
    expect(mockResponse.send).toHaveBeenCalledTimes(0);
  });
});

describe("get todo", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("should get one todo and return 200", async () => {
    jest.spyOn(todoRepository, "findById").mockResolvedValue(mockTodo);

    await getTodo(mockRequest, mockResponse, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.send).toHaveBeenCalledWith({ todo: mockTodo });
    expect(mockNext).not.toHaveBeenCalledWith(expect.any(AppError));
    // debugger;

    expect(mockResponse.send).toHaveBeenCalledTimes(1);
  });

  it("should call next with AppError when todo is not found", async () => {
    jest.spyOn(todoRepository, "findById").mockResolvedValue(null);

    await getTodo(mockRequest, mockResponse, mockNext);

    expect(mockNext).toHaveBeenCalledWith(expect.any(AppError));
    expect(mockNext).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Todo not found!",
        statusCode: 404,
      })
    );
  });
});

describe("create todo", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create a todo and return 200", async () => {
    const newTodo: Todo = {
      id: uuid4(),
      content: "Test Todo",
      priority: "high",
      user_id: uuid4(),
    };

    jest.spyOn(todoRepository, "create").mockResolvedValueOnce(newTodo);

    await createTodo(mockRequest, mockResponse, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.send).toHaveBeenCalledWith({ result: newTodo });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it("should call next with AppError when user is not found", async () => {
    jest.spyOn(todoRepository, "create").mockResolvedValue(null);

    await createTodo(mockRequest, mockResponse, mockNext);

    expect(mockNext).toHaveBeenCalledWith(expect.any(AppError));
    expect(mockNext).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Todo not created",
        statusCode: 400,
      })
    );
  });
});

describe("update todo", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should update a todo and return 200", async () => {
    const updatedTodo: Todo = {
      id: uuid4(),
      user_id: uuid4(),
      content: "Updated Test Todo",
      priority: "low",
    };

    jest.spyOn(todoRepository, "update").mockResolvedValue(updatedTodo);

    await updateTodo(mockRequest, mockResponse, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.send).toHaveBeenCalledWith({ result: updatedTodo });
    expect(mockNext).not.toHaveBeenCalled();
    expect(mockResponse.send).toHaveBeenCalledTimes(1);
  });

  it("should call next with AppError when todo is not found", async () => {
    jest.spyOn(todoRepository, "update").mockResolvedValue(null);

    await updateTodo(mockRequest, mockResponse, mockNext);

    expect(mockNext).toHaveBeenCalledWith(expect.any(AppError));
    expect(mockNext).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Todo not found!",
        statusCode: 404,
      })
    );
    expect(mockResponse.send).toHaveBeenCalledTimes(0);
  });
});

describe("delete todo", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should delete a todo and return 200", async () => {
    jest.spyOn(todoRepository, "delete").mockResolvedValue(true);

    await deleteTodo(mockRequest, mockResponse, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.send).toHaveBeenCalledWith({ deleted: true });
    expect(mockNext).not.toHaveBeenCalled();
    expect(mockResponse.send).toHaveBeenCalledTimes(1);
  });

  it("should call next with AppError when todo is not found", async () => {
    jest.spyOn(todoRepository, "delete").mockResolvedValue(false);

    await deleteTodo(mockRequest, mockResponse, mockNext);

    expect(mockNext).toHaveBeenCalledWith(expect.any(AppError));
    expect(mockNext).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Todo not found!",
        statusCode: 404,
      })
    );
    expect(mockResponse.send).toHaveBeenCalledTimes(0);
  });
});
