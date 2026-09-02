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
import path from "path"
import job from "./lib/utils/cron.js"
dotenv.config();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
const __dirname=path.resolve()
const app = express();
app.use(cors());
app.use(cookieParser());
app.use(express.json({limit:"20mb"}));
app.use(express.urlencoded({ extended: true }));
const PORT = process.env.PORT || 5000;
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/post", postRoutes);
app.use("/api/notifications", NotificationRoutes);
app.get("/health",(req,res)=>{
  try {
    res.status(200).send("ok")
  } catch (error) {
    console.log("error in checking health",error);
    res.status(500).json("internal server error")
  }
})
if(process.env.NODE_ENV==="production"){
  app.use(express.static(path.join(__dirname,"frontend","dist")));
  app.get("/{*any}",(req,res)=>{
    res.sendFile(path.join(__dirname,"frontend","dist","index.html"))
  })
}
app.listen(PORT, () => {
  console.log(`app is running on port ${PORT}`);
  connectDB();
  if(process.env.NODE_ENV==="production"){
    job.start()
  }
});
