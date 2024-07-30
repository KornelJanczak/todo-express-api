import { CoreRepository } from "../repositories/coreRepository";
import { db } from "../db";
import { todoRepository } from "../repositories";
import { describe, it, beforeEach } from "@jest/globals";

import { Pool, QueryResult } from "pg";
import { mockPool } from "../__mocks__";
class TestRepository extends CoreRepository<any> {
  constructor() {
    super(mockPool, "test");
  }

  public async publicFindByUniqueField(
    field: string,
    value: any
  ): Promise<any> {
    return this["findByUniqueField"](field, value);
  }

  public async publicBuildInsertQuery(
    data: any
  ): Promise<{ query: string; values: any[] }> {
    return Promise.resolve(this["buildInsertQuery"](data));
  }

  public async publicExecuteQuery(query: string, values?: any[]): Promise<any> {
    return this["executeQuery"](query, values);
  }

  public async publicProcessResult(result: QueryResult<any>): Promise<any> {
    return Promise.resolve(this["processResult"](result));
  }

  protected mapToModel(row: any): any {
    return row;
  }
}

describe("CoreRepository", () => {
  let repository: TestRepository;

  beforeEach(() => {
    repository = new TestRepository();
  });

  //   it("should create a new record", async () => {
  //     jest.spyOn(repository, "publicExecuteQuery").mockResolvedValue({
  //       rows: [{ id: 1, email: "test@example.com" }],
  //       rowCount: 1,
  //     });

  //     const result = await repository.create({ email: "test@example.com" });
  //     expect(result).toEqual({ id: 1, email: "test@example.com" });
  //   });

  it("should create a new record when unique field is not present", async () => {
    const mockData = { email: "test@example.com" };
    const mockResult = { id: "1", email: "test@example.com" };

    jest.spyOn(repository, "publicFindByUniqueField").mockResolvedValue(null);
    jest
      .spyOn(repository, "publicBuildInsertQuery")
      .mockReturnValue(
        Promise.resolve({ query: "INSERT INTO ...", values: [] })
      );
    jest
      .spyOn(repository, "publicExecuteQuery")
      .mockResolvedValue({ rows: [mockResult], rowCount: 1 });

    jest
      .spyOn(repository, "publicProcessResult")
      .mockReturnValue(Promise.resolve(mockResult));
    const result = await repository.create(mockData);

    expect(result).toEqual(mockResult);
  });

  // Dodaj więcej testów dla innych metod
});
