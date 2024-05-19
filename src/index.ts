import routes from "./routes";
import express, { Application, Request, Response } from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 3000;

const app: Application = express();

app.use(express.json());

app.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
});

app.use("/", routes());
