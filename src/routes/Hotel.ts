import express from "express";
import {
  createBooking,
  createPaymentIntent,
  fetchHotel,
  searchHotels,
} from "../controllers/Hotel";
import { param } from "express-validator";
import { verifyToken } from "../middlware/VerifyToken";

const router = express.Router();

router.get("/search", searchHotels);
router.get(
  "/:id",
  param("id").trim().notEmpty().withMessage("Hotel id is required in params"),
  fetchHotel
);
router.post(
  "/:hotelId/booking/payment-intent",
  verifyToken,
  createPaymentIntent
);
router.post("/:hotelId/booking", verifyToken, createBooking);

export default router;
