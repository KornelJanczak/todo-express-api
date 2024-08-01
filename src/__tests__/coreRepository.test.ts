import { Pool } from "pg";
import { CoreRepository } from "../repositories/coreRepository";
import { AppError } from "../errors/appError";

import { User } from "../models/user";
import { mockUser } from "../__mocks__";

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

    describe("update", () => {
      it("should update an existing record", async () => {
        const userId = "1";
        const mockResult = {
          rows: [{ id: "1", email: "test@example.com", name: "Updated Name" }],
          rowCount: 1,
        };

        pool.query.mockResolvedValueOnce(mockResult as never);

        const result = await repository.update(userId, mockUser);

        expect(pool.query).toHaveBeenCalledTimes(1);
        expect(pool.query).toHaveBeenCalledWith(
          'UPDATE users SET "name" = COALESCE($1, "name") WHERE id = $2 RETURNING *',
          ["Updated Name", "1"]
        );
        expect(result).toEqual(mockResult.rows[0]);
      });

      it("should return null when updating a non-existent record", async () => {
        const userId = "999";

        const mockResult = {
          rows: [],
          rowCount: 0,
        };

        pool.query.mockResolvedValueOnce(mockResult as never);
        const result = await repository.update(userId, mockUser);

        expect(pool.query).toHaveBeenCalledTimes(1);
        expect(pool.query).toHaveBeenCalledWith(
          'UPDATE users SET "name" = COALESCE($1, "name") WHERE id = $2 RETURNING *',
          ["Updated Name", "999"]
        );
        expect(result).toBeNull();
      });

      it("should handle multiple field updates", async () => {
        const userId = "1";
        const mockResult = {
          rows: [{ id: "1", email: "new@example.com", name: "Updated Name" }],
          rowCount: 1,
        };

        pool.query.mockResolvedValueOnce(mockResult as never);

        const result = await repository.update(userId, mockUser);

        expect(pool.query).toHaveBeenCalledTimes(1);
        expect(pool.query).toHaveBeenCalledWith(
          'UPDATE users SET "name" = COALESCE($1, "name"), "email" = COALESCE($2, "email") WHERE id = $3 RETURNING *',
          ["Updated Name", "new@example.com", "1"]
        );
        expect(result).toEqual(mockResult.rows[0]);
      });

      it("should throw an error when database query fails", async () => {
        const userId = "1";

        pool.query.mockRejectedValueOnce(new Error("Database error") as never);

        await expect(repository.update(userId, mockUser)).rejects.toThrow(
          AppError
        );
        expect(pool.query).toHaveBeenCalledTimes(1);
      });
    });
  });
});
