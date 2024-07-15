import { Router, Request, Response, NextFunction } from "express";
import passport from "passport";

export default (router: Router) => {
  router.get(
    "/api/auth/google",
    passport.authenticate("google", {
      scope: [
        "email",
        "profile",
        "openid",
        "https://www.googleapis.com/auth/cloud-platform",
      ],
    })
  );

  router.get("/api/auth/callback/google", passport.authenticate("google"));

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
