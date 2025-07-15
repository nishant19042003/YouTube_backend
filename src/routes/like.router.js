import { Router } from "express";
const router=Router();
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { toggleVideoLike } from "../controllers/like.controller.js";
import { videolikeinfo } from "../controllers/like.controller.js";
router.use(verifyJWT);
router.route("/v/:videoId").post(toggleVideoLike).get(videolikeinfo)

export default router;