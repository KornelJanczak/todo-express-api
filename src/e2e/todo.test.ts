import request from "supertest";
import express from "express";
import createApp from "../app";
import jwt from "jsonwebtoken";



describe("GET", () => {
  let app: express.Application;
  let token: string;

  beforeAll(() => {
    app = createApp();

    token = jwt.sign(
      { user_id: "testuser", email: "testuser@example.com" }, // Payload
      process.env.JWT_SECRET!, // Sekret do podpisania tokenu
      { expiresIn: "1h" } // Opcje tokenu)
    );
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
