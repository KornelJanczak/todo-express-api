import { Request, Response, NextFunction } from "express";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("-------------------------");
  console.log("Auth middleware executed");
  console.log("-------------------------");

  console.log("Authorized = ", req.isAuthenticated());

  if (req.isAuthenticated()) return next();

  return res.status(401).send({ error: "Unauthorized!" });
};
