import express from "express";
const router = express.Router();
import { toggleVideoLike } from "../controllers/like.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

router.post("/video/:videoId", verifyJwt, toggleVideoLike);

export default router;
