import { Router } from "express";
import { loginUser, 
    logoutUser, 
    registerUser ,
    refreshaccesstoken, 
    changepassword,
    updateavatar,
    updatecoverimage,
    getUserChannelProfile,
    getWatchhistory,
    getUserProfile,
    getcurrentuser
} 
    from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router=Router();
router.route("/register").post(
    upload.fields([{
        name:"avatar",
        maxCount:1
    }
    ,{
        name:"coverimage",
        maxCount:1
     }])
    ,registerUser
)

router.route("/login").post(loginUser)
router.route("/logout").post(verifyJWT,logoutUser)
router.route("/refresh-accesstoken").post(refreshaccesstoken)
router.route("/change-password").post(verifyJWT,changepassword)
router.route("/updateavatar").post(verifyJWT,upload.single("avatar"),updateavatar)
router.route("/updatecoverimage").post(verifyJWT,upload.single("coverimage"),updatecoverimage)
router.route("/c/:username").get(verifyJWT, getUserChannelProfile)
router.route("/history").get(verifyJWT, getWatchhistory)
router.route("/profile/:userid").get(verifyJWT, getUserProfile)
router.route("/data").get(verifyJWT, getcurrentuser)

export default router;