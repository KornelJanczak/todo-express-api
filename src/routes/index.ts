import { Router } from "express";
import todo from "./todo";
import auth from "./auth";

const router = Router();

export default (): Router => {
  auth(router);
  todo(router);
  return router;
};
