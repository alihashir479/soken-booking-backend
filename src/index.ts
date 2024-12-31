import express, { Request, Response } from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from 'cookie-parser'
import mongoose from "mongoose";

//Routes
import UserRoutes from "./routes/User";
import AuthRoutes from "./routes/Auth";

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

app.get("/health", (req: Request, res: Response) => {
  res.json({ message: "Health Ok!" });
});
//9qc5PGeJzpMpjUN1
app.listen(7000, () => console.log("Server is up and running"));
