import express from "express";
const router = express.Router();
import {
  toggleVideoLike,
  toggleCommentLike,
  toggleTweetLike,
  getLikedVideos,
} from "../controllers/like.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

router.post("/video/:videoId", verifyJwt, toggleVideoLike);
router.post("/comment/:commentId", verifyJwt, toggleCommentLike);
router.post("/tweet/:tweetId", verifyJwt, toggleTweetLike);
router.get("/videos", verifyJwt, getLikedVideos);

export default router;
