import passport from "passport";
import { Strategy, type StrategyOptions } from "passport-google-oauth20";
import {
  createUserQuery,
  getCurrentUserQuery,
  getUserByIdQuerty,
} from "../db/auth";

const strategyOptions: StrategyOptions = {
  clientID: process.env.GOOGLE_CLIENT_ID || "",
  clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
  callbackURL: "/api/auth/callback/google",
  passReqToCallback: false,
  scope: [
    "profile",
    "email",
    "openid",
    // "https://www.googleapis.com/auth/userinfo.profile",
    // "https://www.googleapis.com/auth/userinfo.email",
  ],
};

passport.serializeUser((user, done) => {
  console.log(user, "seriazlize user");

  done(null, user);
});
passport.deserializeUser((id, done) => {
  console.log(id, "deserialize user id");

  done("Logged", null);
});

export default passport.use(
  new Strategy(
    strategyOptions,
    async (accessToken, refreshToken, profile, done) => {
      const account = profile._json;
      let user = {};

      // console.log(accessToken, "TOKEN");
      // console.log(refreshToken, "REFRESH TOKEN");
      // console.log(profile, "PROFILE");
      console.log(account, "ACCOUNT");

      try {
        const currentUser = await getCurrentUserQuery();

        console.log(currentUser, "Current user");
      } catch (err) {
        done(null, user);
      }

      // return done(null, user);

      // try {
      //   console.log("google auth");

      //   const currentUser = await getCurrentUserQuery();

      //   console.log('abc');

      //   if (currentUser?.rows.length === 0) {
      //     await createUserQuery();

      //     const id = await getUserByIdQuerty();

      //     if (!id) throw new Error("User with the id doesn't exist");

      //     user = {
      //       id: id.rows[0].id,
      //       email: account.email,
      //     };
      //   } else {
      //     user = {
      //       id: currentUser?.rows[0].id,
      //       email: currentUser?.rows[0].email,
      //     };
      //   }
      // } catch (err) {
      //   done(null, user);
      // }
    }
  )
);
