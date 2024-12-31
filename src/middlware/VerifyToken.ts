import { NextFunction, Request, Response } from "express";
import jwt, {VerifyErrors} from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      userId: string;
    }
  }
}

export const verifyToken = (req: Request, res: Response, next: NextFunction):void => {
  const token = req.cookies["auth_token"];
  if (!token) {
    res.status(401).send({ message: "Unauthorized" });
    return
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET_KEY as string, (err: VerifyErrors | null, decoded: any) => {
      if (err) {
        throw err;
      }
      req.userId = decoded.userId;
      next()
    });
  } catch (err) {
    res.status(401).send({ message: "Unauthorized" });
  }
};
