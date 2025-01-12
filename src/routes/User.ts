import express from "express";
import { getLoggedInUser, login, register } from "../controllers/User";
import {
  userLoginValidation,
  userRegisterValidation,
} from "../middlware/validation";
import { verifyToken } from "../middlware/VerifyToken";

const router = express.Router();
router.post("/register", userRegisterValidation, register);
router.post("/login", userLoginValidation, login);
router.get("/me", verifyToken, getLoggedInUser);

export default router;
