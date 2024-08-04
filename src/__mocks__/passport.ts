import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/appError";

const passport = jest.genMockFromModule("passport") as unknown as jest.Mocked<
  typeof import("passport")
>;

passport.initialize = jest.fn(
  () => (req: Request, res: Response, next: NextFunction) => next()
);
passport.session = jest.fn(
  () => (req: Request, res: Response, next: NextFunction) => next()
);
passport.authenticate = jest.fn(
  () => (req: Request, res: Response, next: NextFunction) => next()
) as any;

export const mockReq = {
  isAuthenticated: jest.fn(() => true),
};

interface AuthenticatedRequest extends Request {
  user?: any; // Dodaj właściwość user, która jest obecna w AuthenticatedRequest
}

export const authenticatedMock = jest.mock(
  "../middlewares/authMiddleware.ts",
  () => ({
    authMiddleware: (req: Request, res: Response, next: NextFunction) => {
      //@ts-ignore
      (req as AuthenticatedRequest).isAuthenticated = function (
        this: AuthenticatedRequest
        //@ts-ignore
      ): this is AuthenticatedRequest {
        return true;
      };
      (req as AuthenticatedRequest).user = {}; // Symulujemy obecność użytkownika
      next();
    },
  })
);

export const unauthenticatedMock = jest.fn(
  (req: Request, res: Response, next: NextFunction) => {
    //@ts-ignore
    (req as AuthenticatedRequest).isAuthenticated = function (
      this: AuthenticatedRequest
      //@ts-ignore
    ): this is AuthenticatedRequest {
      return false;
    };
    next(new AppError("Unauthorized!", 401));
  }
);

export default passport;
