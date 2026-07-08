import mongoose from "mongoose";

 const connectDB= async ()=>{
    try {
       const conn=await mongoose.connect(process.env.MONGO_URI)
       console.log(`the database was connected succesfully`);
    } catch (error) {
        console.log(`there was a error while connecting to mongodb. the error is : ${error.message}`);
        process.exit(1)
    }
}

export default connectDB;