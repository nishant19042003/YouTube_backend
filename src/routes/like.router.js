import { Router } from "express";
const router=Router();
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { toggleVideoLike } from "../controllers/like.controller.js";
router.use(verifyJWT);
router.route("/v/:videoId").post(toggleVideoLike)
export default router;