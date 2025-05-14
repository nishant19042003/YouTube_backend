
import mongoose from "mongoose";
import { DB_NAME } from "./constants.js";
import express from 'express';
import connectdb from "./db/index.js";
import dotenv from "dotenv"
import { app } from "./app.js";
dotenv.config({
    path:'./env'
})
connectdb()
.then(()=>{
    app.on("error",(error)=>{
        console.log("error",error)
        throw error;
    })
    app.listen(process.env.PORT||8000,()=>{
        console.log("server is running on "+process.env.PORT)
    })
})
.catch((err)=>{
    console.log("mongodb connection failed",err)
})




/*const app=express();
(async()=>{
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}`/`${DB_NAME}`)
        app.on("error",(error)=>{
            console.log("error",error)
            throw error;
        })
        app.listen(process.env.PORT,()=>{
            console.log("process is running on this")
        })
    } catch (error) {
        console.log(error);
    }
})()*/