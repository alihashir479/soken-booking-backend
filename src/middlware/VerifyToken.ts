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
  const token = req.headers["authorization"] as string;
  if (!token || !token.startsWith('Bearer')) {
    res.status(401).send({ message: "Unauthorized" });
    return
  }

  try {
    const [bearerText, authToken] = token.split(' ')
    jwt.verify(authToken, process.env.JWT_SECRET_KEY as string, (err: VerifyErrors | null, decoded: any) => {
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
