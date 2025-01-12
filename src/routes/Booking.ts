import express from "express";
import { verifyToken } from "../middlware/VerifyToken";
import { fetchBookings } from "../controllers/Booking";

const router = express.Router();

router.get('/', verifyToken, fetchBookings)

export default router;
