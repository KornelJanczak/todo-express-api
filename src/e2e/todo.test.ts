// import request from "supertest";
// import express, { Request, NextFunction } from "express";
// import createApp from "../app";
// import { authenticatedMock, unauthenticatedMock } from "../__mocks__/passport";
// import passport from "../__mocks__/passport";

// jest.mock("passport");
// jest.mock("passport-google-oauth20");

// // interface AuthenticatedRequest extends Request {
// //   user?: any; // Dodaj właściwość user, która jest obecna w AuthenticatedRequest
// // }

// // jest.mock("../middlewares/authMiddleware.ts", () => ({
// //   authMiddleware: (req: Request, res: Response, next: NextFunction) => {
// //     //@ts-ignore
// //     (req as AuthenticatedRequest).isAuthenticated = function (
// //       this: AuthenticatedRequest
// //       //@ts-ignore
// //     ): this is AuthenticatedRequest {
// //       return true;
// //     };
// //     (req as AuthenticatedRequest).user = {}; // Symulujemy obecność użytkownika
// //     next();
// //   },
// // }));

// describe("GET", () => {
//   let app: express.Application;

//   beforeAll(() => {
//     app = createApp();

//     app.use(passport.initialize());
//     app.use(passport.session());
//   });

//   beforeEach(() => {
//     jest.mock("../middlewares/authMiddleware.ts", () => ({
//       authMiddleware: authenticatedMock,
//     }));
//   });

//   it("should get todos and return status 200", async () => {
//     const response = await request(app)
//       .get("/api/todo")
//       .set("Cookie", `${process.env.OAUTH2_TOKEN}`)
//       .send();
//     expect(response.status).toBe(200);
//     expect(response.body).toEqual(
//       expect.objectContaining({
//         todos: expect.arrayContaining([
//           expect.objectContaining({
//             id: expect.any(String),
//             content: expect.any(String),
//             priority: expect.any(String),
//             user_id: expect.any(String),
//           }),
//         ]),
//       })
//     );
//   });
// });
