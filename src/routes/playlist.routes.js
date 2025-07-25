import express from "express";
const router = express.Router();
import {
  createPlaylist,
  addVideoToPlaylist,
  getPlaylistById,
  getUserPlaylists,
  removeVideoFromPlaylist,
  updatePlaylist,
  deletePlaylist,
} from "../controllers/playlist.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

router.post("/", verifyJwt, createPlaylist);
router.post("/:playlistId/:videoId", verifyJwt, addVideoToPlaylist);
router.get("/:playlistId", verifyJwt, getPlaylistById);
router.get("/byUser/:userId", verifyJwt, getUserPlaylists);
router.delete(
  "/remove-video/:playlistId/:videoId",
  verifyJwt,
  removeVideoFromPlaylist
);
router.put("/:playlistId", verifyJwt, updatePlaylist);
router.delete("/:playlistId", verifyJwt, deletePlaylist);

export default router;
