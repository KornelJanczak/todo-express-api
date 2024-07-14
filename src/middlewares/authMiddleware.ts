import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/user";

const JWT_SECRET = process.env.JWT_SECRET || "";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(req.user, "user");
  console.log("Auth middleware executed");
  console.log(req.isAuthenticated(), "authenticated");
  const authHeader = req.headers.authorization;

  console.log("auth header", authHeader);

  if (authHeader) {
    const token = authHeader.split(" ")[1];

    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }

      console.log("user jwt", user);

      next();
    });
  } else {
    res.sendStatus(401);
  }

  // const authHeader = req.headers["authorization"];
  // const token = authHeader && authHeader.split(" ")[1];

  // if (token == null) {
  //   console.log("No token provided");
  //   return res.sendStatus(401);
  // }

  // jwt.verify(token, JWT_SECRET, (err, user) => {
  //   if (err) {
  //     console.log("Token verification failed:", err.message);
  //     return res.sendStatus(403);
  //   }

  //   console.log("Token verified successfully");
  //   req.user = user as User;
  //   next();
  // });
};
