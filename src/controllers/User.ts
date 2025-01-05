import { Request, Response } from "express";
import User from "../models/User";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const register = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email } = req.body;
    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = new User(req.body);
    await user.save();

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET_KEY as string,
      {
        expiresIn: "1d",
      }
    );

    res
      .status(200)
      .send({ auth_token: token, message: "User registration successful" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error registering user!" });
  }
};

const login = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET_KEY as string,
      {
        expiresIn: "1d",
      }
    );

    res.status(200).json({ userId: user._id, auth_token: token });
  } catch (err) {
    res.status(500).json({ message: "Cannot login! Please try again" });
  }
};

export { register, login };
