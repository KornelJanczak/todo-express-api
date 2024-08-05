import routes from "./routes";
import express, { Application } from "express";
import "dotenv";
import passport from "passport";
import session from "express-session";
import "./strategies/google-strategy";
import cookieParser from "cookie-parser";
import cookieSession from "cookie-session";
import { errorHandler } from "./middlewares/errorHandler";

const SESSION_EXPIRY_DATE = 60 * 60000;

export default function createApp(): Application {
  const app: Application = express();

  app.use(express.json());
  app.use(
    cookieSession({
      name: "session",
      keys: ["mokhtarah"],
      maxAge: 24 * 60 * 60 * 100,
    })
  );
  app.use(cookieParser("hello world"));
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "",
      saveUninitialized: true,
      resave: false,
      cookie: {
        maxAge: SESSION_EXPIRY_DATE,
        secure: true,
      },
    })
  );

  app.use(passport.initialize());
  app.use(passport.session());
  app.use("/", routes());

  app.get("/api/debug-session", (req, res) => {
    console.log(req.user);
    console.log(req.session);

    res.json({
      session: req.session,
      user: req.user,
    });
  });

  app.use(errorHandler);
  return app;
}
