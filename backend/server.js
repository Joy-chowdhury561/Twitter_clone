import express from "express";
import authRoutes from "./routes/auth_route.js";
import dotenv from "dotenv";
import connectDB from "./config/connectDB.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { v2 as cloudinary } from "cloudinary";
import userRoutes from "./routes/user_route.js";
import NotificationRoutes from "./routes/notification_route.js";
import postRoutes from "./routes/post_route.js";
dotenv.config();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
const app = express();
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const PORT = process.env.PORT || 5000;
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/post", postRoutes);
app.use("/api/notifications", NotificationRoutes);
app.listen(PORT, () => {
  console.log(`app is running on port ${PORT}`);
  connectDB();
});
