import express from "express";
import { verifyToken } from "../middlware/VerifyToken";
import { hotelRegistrationValidation } from "../middlware/validation";
import multer from "multer";
import { createHotel } from "../controllers/Hotel";

const MAX_IMAGES_ALLOWED_PER_HOTEL = 6

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

const router = express.Router();
router.post("/", upload.array('imageFiles', MAX_IMAGES_ALLOWED_PER_HOTEL), hotelRegistrationValidation, verifyToken, createHotel);

export default router;
