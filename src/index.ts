import routes from "./routes";
import express, { Application } from "express";
import dotenv from "dotenv";
import passport from "passport";

dotenv.config();

const PORT = process.env.PORT || 3000;

const app: Application = express();

app.use(express.json());

app.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
});

app.use(passport.initialize());
app.use(passport.session())
app.use("/", routes());
