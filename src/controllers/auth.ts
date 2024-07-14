import { Response, Request } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "";
export const createToken = (req: Request, res: Response) => {
  const token = jwt.sign({ id: req.user?.id }, JWT_SECRET, { expiresIn: "1h" });
  console.log("Generated token", token);
  res.json({ token });
};
