import request from "supertest";
import express from "express";
import createApp from "../app";
import jwt from "jsonwebtoken";
import { generateTestToken } from "../utils/helpers";
import { mockPassport } from "../__mocks__";

jest.mock("passport");

jest.mock("passport-google-oauth20");

describe("GET", () => {
  let app: express.Application;
  let token: string;

  beforeAll(() => {
    app = createApp();
    token = generateTestToken({ userId: "123", email: "test@example.com" });
  });

  it("should get todos and return status 200", async () => {
    const response = await request(app)
      .get("/api/todo")
      .set("Authorization", `Bearer ${token}`)
      .send();
    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        todos: expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(String),
            content: expect.any(String),
            priority: expect.any(String),
            user_id: expect.any(String),
          }),
        ]),
      })
    );
  });
});
