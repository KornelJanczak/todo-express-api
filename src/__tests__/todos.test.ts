import { describe, it, test, beforeAll, beforeEach } from "@jest/globals";
import { getTodos } from "../controllers/todo";
import { mockRequest, mockResponse } from "../__mocks__";
import uuid4 from "uuid4";
import { todoRepository } from "../repositories";
import { Todo } from "../models/todo";

describe("get todos", () => {
  it("should get all todos and return 200", async () => {
    const todos = [{ id: uuid4(), title: "Test Todo" }];

    jest.spyOn(todoRepository, "findAll").mockResolvedValue(todos);

    await getTodos(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.send).toHaveBeenCalledWith({ todos });
  });

  it("should return status 200 and an empty list when repository has no todos", async () => {
    const todos: Todo[] = [];

    jest.spyOn(todoRepository, "findAll").mockResolvedValue(todos);

    await getTodos(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.send).toHaveBeenCalledWith({ todos });
  });
});

describe("get todo", () => {
  // it("should get one todo and return 200", async () => {
  //   const todo = { id: uuid4(), title: "Test Todo" };

  //   jest.spyOn(todoRepository, "findById").mockResolvedValue(todo);

  //   await getTodos(mockRequest, mockResponse);

  //   expect(mockResponse.status).toHaveBeenCalledWith(200);
  //   expect(mockResponse.send).toHaveBeenCalledWith({ todo });
  // });

  it("should return status 404 when todo is not found", async () => {
    jest.spyOn(todoRepository, "findById").mockResolvedValue(null);

    await getTodos(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.send).toHaveBeenCalledWith({
      error: "Todo not found !",
    });
  });
});
