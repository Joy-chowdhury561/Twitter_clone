import express from "express"
import authRoutes from "./routes/auth_route.js"
import dotenv from "dotenv"
import connectDB from "./config/connectDB.js";
dotenv.config();
const app=express()
const PORT=process.env.PORT||5000
app.use("/api/auth",authRoutes)
app.listen(PORT,()=>{
    console.log(`app is running on port ${PORT}`);
    connectDB(); 
})       
