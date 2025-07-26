import express from "express";
const router = express.Router();
import {
  toggleVideoLike,
  toggleCommentLike,
} from "../controllers/like.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

router.post("/video/:videoId", verifyJwt, toggleVideoLike);
router.post("/comment/:commentId", verifyJwt, toggleCommentLike);

export default router;
