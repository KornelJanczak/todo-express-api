import "dotenv/config";
import passport from "passport";
import { Strategy, type StrategyOptions } from "passport-github";

const strategyOptions: StrategyOptions = {
  clientID: process.env.GITHUB_CLIENT_ID || "",
  clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
  callbackURL: process.env.GITHUB_REDIRECT_URL || "",
//   scope: ["repo", "user", "delete_repo", "admin:org"],
};

export default passport.use(
  new Strategy(strategyOptions, (accessToken, refreshToken, profile, done) => {
    console.log(profile);
  })
);
