import { Router } from "express";
import {createTweet,getUserTweets,updateTweet,deleteTweet} from "../controllers/tweet.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
const router=Router();
router.use(verifyJWT)
router.route("/").post(upload.none(),createTweet);
router.route("/alltweet/").get(getUserTweets);
router.route("/:tweetid").patch(upload.none(),updateTweet).delete(deleteTweet);
export default router;