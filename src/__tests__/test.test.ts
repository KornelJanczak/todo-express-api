/// <reference types="jest" />
import { Pool } from "pg";
import { CoreRepository } from "../repositories/coreRepository";
import { AppError } from "../errors/appError";

import { User } from "../models/user";

class UserRepository extends CoreRepository<User> {
  protected mapToModel(row: any): User {
    return {
      id: row.id,
      email: row.email,
      todos: row.todos,
    };
  }
}

describe("CoreRepository", () => {
  let pool: jest.Mocked<Pool>;
  let repository: UserRepository;

  beforeEach(() => {
    pool = {
      query: jest.fn(),
    } as unknown as jest.Mocked<Pool>;

    repository = new UserRepository(pool, "users");
  });

  describe("create", () => {
    it("should create a new record", async () => {
      const userData: Partial<User> = {
        email: "test@example.com",
      };
      const mockResult = {
        rows: [{ id: "1", email: "test@example.com", name: "Test User" }],
        rowCount: 1,
      };

      pool.query.mockResolvedValueOnce({
        rows: [] as never[],
        rowCount: 0,
      } as never); // No existing record
      pool.query.mockResolvedValueOnce(mockResult as never); // Inserted record

      const result = await repository.create(userData);

      expect(pool.query).toHaveBeenCalledTimes(2);
      expect(pool.query).toHaveBeenCalledWith(
        "SELECT * FROM users WHERE email = $1",
        ["test@example.com"]
      );
      expect(pool.query).toHaveBeenCalledWith(
        "INSERT INTO users (email, name) VALUES ($1, $2) RETURNING *",
        ["test@example.com", "Test User"]
      );
      expect(result).toEqual(mockResult.rows[0]);
    });

    it("should throw an error if record with unique field already exists", async () => {
      const userData: Partial<User> = {
        email: "test@example.com",
      };
      const existingRecord = {
        rows: [{ id: "1", email: "test@example.com", name: "Existing User" }],
        rowCount: 1,
      };

      pool.query.mockResolvedValueOnce(existingRecord as never);

      await expect(repository.create(userData)).rejects.toThrow(AppError);
      expect(pool.query).toHaveBeenCalledTimes(1);
      expect(pool.query).toHaveBeenCalledWith(
        "SELECT * FROM users WHERE email = $1",
        ["test@example.com"]
      );
    });
  });
});
