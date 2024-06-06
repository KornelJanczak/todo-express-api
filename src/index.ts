import routes from "./routes";
import express, { Application } from "express";
import "dotenv";
import passport from "passport";
import session from "express-session";
import "./strategies/github-strategy";
import cookieParser from "cookie-parser";

const PORT = process.env.PORT || 3000;
const SESSION_EXPIRY_DATE = 60 * 60000;

const app: Application = express();

app.use(express.json());

app.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
});

app.use(cookieParser("hello world"));
app.use(
  session({
    secret: process.env.SESSION_SECRET || "",
    saveUninitialized: true,
    resave: false,
    cookie: {
      maxAge: SESSION_EXPIRY_DATE,
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use("/", routes());
