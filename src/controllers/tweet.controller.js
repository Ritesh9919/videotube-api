import { isValidObjectId } from "mongoose";
import { Tweet } from "../models/tweet.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createTweet = asyncHandler(async (req, res) => {
  //TODO: create tweet
  const { content } = req.body;
  if (!content) {
    throw new ApiError(400, "Content is required");
  }

  const tweet = await Tweet.create({ content, owner: req.user._id });
  return res.status(201).json(new ApiResponse(200, tweet, "tweet created"));
});

const getUserTweets = asyncHandler(async (req, res) => {
  // TODO: get user tweets
  const tweets = await Tweet.find({ owner: req.user._id });
  return res
    .status(200)
    .json(new ApiResponse(200, tweets, "User tweets fetched"));
});

const updateTweet = asyncHandler(async (req, res) => {
  //TODO: update tweet
  const { tweetId } = req.params;
  const { content } = req.body;
  if (!content) {
    throw new ApiError(400, "Content is required");
  }

  if (!isValidObjectId(tweetId)) {
    throw new ApiError(400, "Invalid tweetId");
  }

  const existedTweet = await Tweet.findById(tweetId);
  if (!existedTweet) {
    throw new ApiError(404, "Tweet not found");
  }

  if (!req.user._id.equals(existedTweet.owner)) {
    throw new ApiError(400, "You can not update others tweet");
  }

  const tweet = await Tweet.findByIdAndUpdate(
    tweetId,
    { $set: { content } },
    {
      new: true,
    }
  );

  return res.status(200).json(new ApiResponse(200, tweet, "Tweet updated"));
});

const deleteTweet = asyncHandler(async (req, res) => {
  //TODO: delete tweet
  const { tweetId } = req.params;

  if (!isValidObjectId(tweetId)) {
    throw new ApiError(400, "Invalid tweetId");
  }

  const existedTweet = await Tweet.findById(tweetId);
  if (!existedTweet) {
    throw new ApiError(404, "Tweet not found");
  }

  if (!req.user._id.equals(existedTweet.owner)) {
    throw new ApiError(400, "You can not delete others tweet");
  }

  await Tweet.findByIdAndDelete(tweetId);

  return res.status(200).json(new ApiResponse(200, {}, "Tweet deleted"));
});

export { createTweet, getUserTweets, updateTweet, deleteTweet };
