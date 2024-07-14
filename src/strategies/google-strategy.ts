import passport from "passport";
import { Strategy, type StrategyOptions } from "passport-google-oauth20";
import { User } from "../models/user";
import { userRepository } from "../repositories";
import jwt from "jsonwebtoken";
import { isUser } from "../utils/helpers";

const JWT_SECRET = process.env.JWT_SECRET || "";

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

    console.log(accessToken, "ACCESS TOKEN");

    console.log(account, "ACCOUNT");

    try {
      // const existingUser = await userRepository.findByEmail(account.email);

      // console.log(existingUser, "Current user");

      // if (!existingUser) {
      //   await userRepository.create({
      //     id: account.sub,
      //     email: account.email,
      //   });

      //   const newUser = await userRepository.findById(account.sub);

      //   if (!newUser) throw new Error("User with the id doesn't exist");

      //   user = newUser;
      // } else {
      //   user = existingUser;
      // }
      // done(null, user);

      const account = profile._json;
      console.log(account, "ACCOUNT");

      user = await userRepository.findByEmail(account.email);

      if (!user) {
        await userRepository.create({
          id: account.sub,
          email: account.email,
        });

        user = await userRepository.findById(account.sub);

        if (!user) throw new Error("User with the id doesn't exist");
      }

      if (!isUser(user)) throw new Error("Invalid user object");

      const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET);

      return done(null, { user, token });
    } catch (err) {
      throw new Error(`${err}`);
    }
  })
);
