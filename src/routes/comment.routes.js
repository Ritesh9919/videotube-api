import express from "express";
const router = express.Router();
import {
  addComment,
  updateComment,
  deleteComment,
  getVideoComments,
} from "../controllers/comment.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

router.get("/:videoId", verifyJwt, getVideoComments);
router.post("/:videoId", verifyJwt, addComment);
router.put("/:commentId", verifyJwt, updateComment);
router.delete("/:commentId", verifyJwt, deleteComment);

export default router;
