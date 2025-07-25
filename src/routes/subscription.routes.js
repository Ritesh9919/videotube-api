import express from "express";
const router = express.Router();
import { toggleSubscription } from "../controllers/subscription.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

router.post("/toggle/:channelId", verifyJwt, toggleSubscription);

export default router;
