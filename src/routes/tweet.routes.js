import express from "express";
const router = express.Router();
import {
  createTweet,
  getUserTweets,
  updateTweet,
  deleteTweet,
} from "../controllers/tweet.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

router.post("/", verifyJwt, createTweet);
router.get("/", verifyJwt, getUserTweets);
router.put("/:tweet", verifyJwt, updateTweet);
router.delete("/:tweetId", verifyJwt, deleteTweet);

export default router;
