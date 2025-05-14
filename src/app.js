import cookieParser from 'cookie-parser';
import express, { urlencoded } from 'express';
import cors from "cors"
import multer from 'multer';
import videoRouter from "./routes/video.router.js"
import tweetRouter from "./routes/tweet.router.js"
import subcriptionrouter from "./routes/subscription.router.js"
import commentrouter from "./routes/comment.router.js"
import likerouter from "./routes/like.router.js"
import dashbordrouter from "./routes/dashbord.router.js"
const app=express();
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))
app.use(express.json({limit:"16kb"}));
app.use(urlencoded({
    extended:true,
    limit:"16kb"
}));
app.use(express.static("public"));
app.use(cookieParser());

import userRouter from "./routes/user.router.js"
app.get('/', (req, res) => {
  // req = request object (input from client)
  // res = response object (output to client)

  res.send('Hello World');
});
app.use("/users",userRouter)
app.use("/video",videoRouter)
app.use("/tweet",tweetRouter)
app.use("/subscription",subcriptionrouter)
app.use("/comment",commentrouter)
app.use("/like",likerouter)
app.use("/dashbord",dashbordrouter)
export {app}