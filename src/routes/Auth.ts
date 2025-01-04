import express, { Request, Response } from "express";
import { verifyToken } from "../middlware/VerifyToken";

const router = express.Router();

router.get("/authenticate", verifyToken, (req: Request, res: Response) => {
  res.status(200).send({ userId: req.userId });
});

router.post("/logout", (req: Request, res: Response) => {
  res.clearCookie("auth_token").json({ message: "Logout Succesfully!" });
});

export default router;
