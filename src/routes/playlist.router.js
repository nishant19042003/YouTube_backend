import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createPlaylist } from "../controllers/playlist.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { getUserPlaylists } from "../controllers/playlist.controller.js";
import { getPlaylistById } from "../controllers/playlist.controller.js";
import { addVideoToPlaylist } from "../controllers/playlist.controller.js";
import { getallplaylists } from "../controllers/playlist.controller.js";
const playlistrouter=new Router();
playlistrouter.use(verifyJWT)
playlistrouter.route("/create").post(upload.single("thumbnail"),createPlaylist);
playlistrouter.route("/getuserPlaylists/:userId").get(getUserPlaylists);
playlistrouter.route("/getplaylist/:playlistId").get(getPlaylistById);
playlistrouter.route("/addvideotoplaylist/:playlistId/:videoId").post(addVideoToPlaylist);
playlistrouter.route("/playlists").get(getallplaylists);
export default playlistrouter;