import { Router } from "express";
import passport from "passport";
// import { successfullAuthentication } from "../strategies/github-strategy";

export default (router: Router) => {
  router.get(
    "/api/auth/github",
    passport.authenticate("github", { scope: ["user:email"] })
  );
  router.get(
    "/api/auth/github/callback",
    passport.authenticate(
      "github",
      { failureRedirect: "/login" },
      (req: Request, res: Response) => {
        console.log("Successfull auth");
      }
    )
  );
  router.get(
    "/api/auth/google",
    passport.authenticate("google", { scope: ["profile"] })
  );
  router.get("/api/auth/google/callback", passport.authenticate("google"), () => {
    console.log("chuj");
  });
};
