import { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";

const validateRequest = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }
  return next();
};

export const userRegisterValidation = [
  body("email").isString().notEmpty().withMessage("Email is Required"),
  body("password")
    .isString()
    .isLength({ min: 8, max: 12 })
    .withMessage("Passwork length must be between 8 and 12"),
  body("firstName").isString().notEmpty().withMessage("First name is required"),
  body("lastName").isString().notEmpty().withMessage("Last name is required"),
  validateRequest,
];

export const userLoginValidation = [
  body("email").isString().notEmpty().withMessage("Email is required"),
  body("password")
    .isString()
    .isLength({ min: 8, max: 12 })
    .withMessage("Email is required"),
  validateRequest,
];

export const hotelRegistrationValidation = [
  body("name").isString().notEmpty().withMessage("Hotel name is required"),
  body("city").isString().notEmpty().withMessage("City name is required"),
  body("country").isString().notEmpty().withMessage("Country name is required"),
  body("description")
    .isString()
    .notEmpty()
    .withMessage("Hotel description is required"),
  body("type").isString().notEmpty().withMessage("Hotel type is required"),
  body("adultCount")
    .isInt({ min: 1 })
    .notEmpty()
    .withMessage("Adult count is required with minimum 1 value"),
  body("childCount")
    .isInt({ min: 0 })
    .notEmpty()
    .withMessage("Adult count is required with minimum 0 value"),
  body("pricePerNight")
    .isNumeric()
    .notEmpty()
    .withMessage("Price per night is required"),
  body("facilities")
    .isArray()
    .withMessage("Facitilities must be sent as an array")
    .not()
    .isEmpty()
    .withMessage("Minimum one facility is needed"),
  validateRequest,
];
