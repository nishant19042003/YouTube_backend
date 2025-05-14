import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";
const connectdb=async()=>{
    try {
       const  connectioninstance= await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
       console.log(connectioninstance.connection.host+" ho gaya connect");
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}
export default connectdb;