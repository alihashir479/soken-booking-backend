import express, { Request, Response } from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from 'cookie-parser'
import mongoose from "mongoose";
import { v2 as cloudinary} from 'cloudinary'

//Routes
import UserRoutes from "./routes/User";
import AuthRoutes from "./routes/Auth";
import MyHotelRoutes from "./routes/MyHotel";
import HotelRoutes from "./routes/Hotel";

const app = express();
app.use(cookieParser())
app.use(express.json());
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));

mongoose
  .connect(process.env.MONGODB_CONNECTION_STRING as string)
  .then(() => console.log("Connected to DB"))
  .catch((err) => console.log("DB connection error: ", err));

app.use("/api/user", UserRoutes);
app.use('/api/auth', AuthRoutes)
app.use('/api/my-hotels', MyHotelRoutes)
app.use('/api/hotels', HotelRoutes)

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

app.get("/health", (req: Request, res: Response) => {
  res.json({ message: "Health Ok!" });
});

app.listen(7000, () => console.log("Server is up and running"));
