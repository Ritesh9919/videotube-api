import express from "express";
const router = express.Router();
import {
  getChannelVideos,
  getChannelStats,
} from "../controllers/dashboard.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";
router.get("/videos", verifyJwt, getChannelVideos);
router.get("/channel-stats", verifyJwt, getChannelStats);
export default router;
