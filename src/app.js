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
import playlistrouter from './routes/playlist.router.js';
const app=express();
const allowedOrigins = [
  "https://onenishant.in.net",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "http://localhost:8000",
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

import userRouter from "./routes/user.router.js"
app.get('/', (req, res) => {
  // req = request object (input from client)
  // res = response object (output to client)
  
  console.log(process.env.NODE_ENV)

  res.send('Hello World');
});
app.use("/users",userRouter)
app.use("/video",videoRouter)
app.use("/tweet",tweetRouter)
app.use("/subscription",subcriptionrouter)
app.use("/comment",commentrouter)
app.use("/like",likerouter)
app.use("/dashbord",dashbordrouter)
app.use("/playlist",playlistrouter)
export {app}