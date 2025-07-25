import express from "express";
const router = express.Router();
import {
  toggleSubscription,
  getUserChannelSubscribers,
  getSubscribedChannels,
} from "../controllers/subscription.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

router.post("/toggle/:channelId", verifyJwt, toggleSubscription);
router.get(
  "/channel-subscribers/:channelId",
  verifyJwt,
  getUserChannelSubscribers
);
router.get(
  "/subscribed-channels/:subscriberId",
  verifyJwt,
  getSubscribedChannels
);

export default router;
