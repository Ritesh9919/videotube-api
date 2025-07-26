import express from "express";
const router = express.Router();
import { getChannelVideos } from "../controllers/dashboard.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";
router.get("/videos", verifyJwt, getChannelVideos);
export default router;
