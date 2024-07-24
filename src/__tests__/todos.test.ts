import { describe, it, test, beforeAll, beforeEach } from "@jest/globals";
import { getTodos, getTodo } from "../controllers/todo";
import { mockNext, mockRequest, mockResponse, mockPool } from "../__mocks__";
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

  // it("should return status 500 when repository throws an error", async () => {
  //   jest.spyOn(todoRepository, "findAll").mockRejectedValue(new Error("Error"));

  //   await getTodos(mockRequest, mockResponse);

  //   expect(mockResponse.status).toHaveBeenCalledWith(500);
  // });
});

describe("get todo", () => {
  it("should get one todo and return 200", async () => {
    jest.spyOn(todoRepository, "findById").mockResolvedValue(mockTodo);

    await getTodo(mockRequest, mockResponse, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.send).toHaveBeenCalledWith({ todo: mockTodo });
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
    expect(mockResponse.send).not.toHaveBeenCalled();
  });

  // it("should throw an error when connection to the database fails", async () => {
  //   mockPool.query.mockRejectedValue(
  //     new AppError("Error fetching record", 500)
  //   );

  //   // Act & Assert
  //   await expect(todoRepository.findById("example-id")).rejects.toThrow(
  //     new AppError("Error fetching record", 500)
  //   );
  // });
});
