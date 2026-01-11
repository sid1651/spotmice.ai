import mongoose from 'mongoose';
import dotenv from "dotenv";
dotenv.config();
const connectDB= async ()=>{

mongoose.connection.on('connected',()=>{
    console.log('MongoDB connected successfully');
})
mongoose.connection.on('error',(err)=>{
    console.log('MongoDB connection error:',err);
})
console.log("database url:",process.env.MONGO_URI);
mongoose.connect(process.env.MONGO_URI,{
    dbname:'spotmice'
})

}

export default connectDB;