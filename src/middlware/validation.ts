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
  next();
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
