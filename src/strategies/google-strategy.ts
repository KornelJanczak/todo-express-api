import passport from "passport";
import { Strategy, type StrategyOptions } from "passport-google-oauth20";
import { User } from "../models/user";
import { userRepository } from "../repositories";
import { AppError } from "../errors/appError";

const strategyOptions: StrategyOptions = {
  clientID: process.env.GOOGLE_CLIENT_ID || "",
  clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
  callbackURL: "/api/auth/callback/google",
  passReqToCallback: false,
  scope: [
    "profile",
    "email",
    "openid",
    "https://www.googleapis.com/auth/cloud-platform",
  ],
};

passport.serializeUser((user, done) => {
  console.log(user, "seriazlize user");
  done(null, user);
});

passport.deserializeUser(async (user: User, done) => {
  console.log(user.id, "deserialize user id");

  try {
    const findUser = await userRepository.findById(user.id);

    console.log(findUser, "Find user");

    if (!findUser) done(null, false);

    done(null, findUser);
  } catch (err) {
    done(err, null);
  }
});

export default passport.use(
  new Strategy(strategyOptions, async (accessToken, __, profile, done) => {
    const account = profile._json;
    let user;

    try {
      const existingUser = await userRepository.findByEmail(account.email);

      console.log(existingUser, "Current user");

      if (!existingUser) {
        await userRepository.create({
          id: account.sub,
          email: account.email,
        });

        console.log(account, "account");

        const newUser = await userRepository.findById(account.sub);

        console.log(newUser, "New user");

        if (!newUser) throw new AppError("User not found!", 404);

        user = newUser;
      } else {
        user = existingUser;
      }
      console.log("User", user);

      done(null, user);
    } catch (err) {
      done(err);
    }
  })
);
