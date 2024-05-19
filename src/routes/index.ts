import { Router } from "express";
import todo from "./todo";

const router = Router();

export default (): Router => {
  todo(router);
  return router;
};
