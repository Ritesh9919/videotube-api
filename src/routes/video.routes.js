import express from "express";
const router = express.Router();
import {
  getAllVideos,
  getVideoById,
  updateVideo,
  deleteVideo,
  publishAVideo,
  togglePublishStatus,
} from "../controllers/video.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

router.post(
  "/",
  upload.fields([
    {
      name: "videoFile",
      maxCount: 1,
    },
    {
      name: "thumbnail",
      maxCount: 1,
    },
  ]),
  verifyJwt,
  publishAVideo
);
router.get("/:videoId", verifyJwt, getVideoById);
router.get("/", getAllVideos);
router.put("/:videoId", verifyJwt, upload.single("thumbnail"), updateVideo);
router.delete("/:videoId", verifyJwt, deleteVideo);
router.post("/toggle/publish/:videoId", verifyJwt, togglePublishStatus);

export default router;
