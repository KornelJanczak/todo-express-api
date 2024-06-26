import routes from "./routes";
import express, { Application, Request, Response } from "express";
import "dotenv";
import passport from "passport";
import session from "express-session";
// import "./strategies/github-strategy";
import "./strategies/google-strategy";
import cookieParser from "cookie-parser";
import cookieSession from "cookie-session";

const PORT = process.env.PORT || 3000;
const SESSION_EXPIRY_DATE = 60 * 60000;

const app: Application = express();

app.listen(PORT, () => {
  
  
  console.log("Server is running on port " + PORT);
});

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

const GOOGLE_OAUTH_URL = process.env.GOOGLE_OAUTH_URL;

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

const GOOGLE_CALLBACK_URL = "http%3A//localhost:3000/api/auth/callback/google";

const GOOGLE_OAUTH_SCOPES = [
  "https%3A//www.googleapis.com/auth/userinfo.email",

  "https%3A//www.googleapis.com/auth/userinfo.profile",
];

// app.get("/", async (req: Request, res: Response) => {
//   const state = "some_state";
//   const scopes = GOOGLE_OAUTH_SCOPES.join(" ");
//   const GOOGLE_OAUTH_CONSENT_SCREEN_URL = `${GOOGLE_OAUTH_URL}?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${GOOGLE_CALLBACK_URL}&access_type=offline&response_type=code&state=${state}&scope=${scopes}`;
//   res.redirect(GOOGLE_OAUTH_CONSENT_SCREEN_URL);
// });
