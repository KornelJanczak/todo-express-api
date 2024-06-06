import "dotenv/config";
import passport, { use } from "passport";
import { Strategy, type StrategyOptions } from "passport-github";
import { Request, Response } from "express";

const strategyOptions: StrategyOptions = {
  clientID: process.env.GITHUB_CLIENT_ID || "",
  clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
  callbackURL: process.env.GITHUB_REDIRECT_URL || "",

  scope: ["identify"],
};

passport.serializeUser((user, done) => {
  console.log("serialize");

  done(null, user);
});

passport.deserializeUser((user, done) => {
  console.log("deserialize");

  done(null, "d");
});

export default passport.use(
  new Strategy(strategyOptions, (accessToken, refreshToken, profile, done) => {
    console.log("init");

    console.log(profile);
  })
);

export function successfullAuthentication(req: Request, res: Response) {
  console.log("Successfull auth");
}
