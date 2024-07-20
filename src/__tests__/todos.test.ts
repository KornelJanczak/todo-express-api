import { describe, it, test, beforeAll, beforeEach } from "@jest/globals";
import { getTodos } from "../controllers/todo";
import { mockRequest, mockResponse } from "../__mocks__";

describe("get todos", () => {
  it("should get all todos", () => {
    mockResponse.send = jest.fn();
    getTodos(mockRequest, mockResponse);
    expect(mockResponse.send()).toHaveBeenCalledWith(200);
  });
});
