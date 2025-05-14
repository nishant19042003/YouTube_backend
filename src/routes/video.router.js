import { Router } from 'express';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/multer.middleware.js';
import { 
    uploadvideo,
    getallvideos,
    getvideobyid,
    deletevideobyid,
    updatevideo

 } from '../controllers/video.controller.js';
const router = Router();
router.use(verifyJWT);
router.route("/")
.get(getallvideos)
.post(
    upload.fields([
        {
            name: "videofile",
            maxCount: 1,
        },
        {
            name: "thumbnail",
            maxCount: 1,
        },
        
    ]),
    uploadvideo
);

router
    .route("/:videoId")
    .get(getvideobyid)
    .delete(deletevideobyid)
    .patch(upload.single("thumbnail"), updatevideo);

export default router;