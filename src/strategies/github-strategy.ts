import "dotenv/config";
import passport from "passport";
import { Strategy, type StrategyOptions } from "passport-github";
import { Request, Response } from "express";

const strategyOptions: StrategyOptions = {
  clientID: process.env.GITHUB_CLIENT_ID || "",
  clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
  callbackURL: process.env.GITHUB_REDIRECT_URL || "",
  scope: ["user:email"],
};

passport.serializeUser((user, done) => {
  console.log("serialize");

  done(null, user);
});

passport.deserializeUser((user, done) => {
  console.log("deserialize");

  done(null, "d");
});

passport.use(
  new Strategy(strategyOptions, (access) => {
    console.log("init");

    // console.log(profile);
    // return done(null, profile.id);
  })
);


export default passport;

// export function successfullAuthentication(req: Request, res: Response) {
//   console.log("Successfull auth");
// }
