import { Router, Request, Response, NextFunction } from "express";
import passport from "passport";
import { createToken } from "../controllers/auth";
// import { successfullAuthentication } from "../strategies/github-strategy";

export default (router: Router) => {
  // router.get(
  //   "/api/auth/github",
  //   passport.authenticate("github", { scope: ["user:email"] })
  // );
  // router.get(
  //   "/api/auth/github/callback",
  //   passport.authenticate(
  //     "github",
  //     { failureRedirect: "/login" },
  //     (req: Request, res: Response) => {
  //       console.log("Successfull auth");
  //     }
  //   )
  // );
  router.get(
    "/api/auth/google",
    (req, res, next) => {
      console.log("Google auth route hit");
      next();
    },
    passport.authenticate("google", {
      scope: [
        "email",
        "profile",
        "openid",
        "https://www.googleapis.com/auth/cloud-platform",
      ],
    })
  );

  router.get(
    "/api/auth/callback/google",
    passport.authenticate("google"),
    createToken
  );

  router.get("/api/auth/status", (req: Request, res: Response) => {
    console.log(req.user, "STATUS USER");

    return req.user ? res.send(req.user) : res.sendStatus(401);
  });

  router.get(
    "/api/auth/logout",
    (req: Request, res: Response, next: NextFunction) => {
      req.logout((err) => {
        console.log("chuj");

        if (err) return next(err);

        res.send(200);
      });
    }
  );
};
