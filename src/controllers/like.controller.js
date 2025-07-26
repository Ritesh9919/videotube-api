import mongoose, { isValidObjectId } from "mongoose";
import { Like } from "../models/like.model.js";
import { Video } from "../models/video.model.js";
import { Comment } from "../models/comment.model.js";
import { Tweet } from "../models/tweet.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: toggle like on video
  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid videoId");
  }

  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "Video not found");
  }
  let isLiked;
  const isLikeExist = await Like.findOne({
    video: videoId,
    likedBy: req.user._id,
  });
  if (isLikeExist) {
    await Like.findOneAndDelete({ video: videoId, likedBy: req.user._id });
    isLiked = false;
  } else {
    await Like.create({ video: videoId, likedBy: req.user._id });
    isLiked = true;
  }

  const likesCount = await Like.countDocuments({ video: videoId });
  return res
    .status(201)
    .json(
      new ApiResponse(
        200,
        { isLiked, likes: likesCount },
        isLiked ? "Liked" : "UnLiked"
      )
    );
});

const toggleCommentLike = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  //TODO: toggle like on comment
  if (!isValidObjectId(commentId)) {
    throw new ApiError(400, "Invalid commentId");
  }

  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }
  let isLiked;
  const isLikeExist = await Like.findOne({
    comment: commentId,
    likedBy: req.user._id,
  });
  if (isLikeExist) {
    await Like.findOneAndDelete({ comment: commentId, likedBy: req.user._id });
    isLiked = false;
  } else {
    await Like.create({ comment: commentId, likedBy: req.user._id });
    isLiked = true;
  }

  const likesCount = await Like.countDocuments({ comment: commentId });
  return res
    .status(201)
    .json(
      new ApiResponse(
        200,
        { isLiked, likes: likesCount },
        isLiked ? "Liked" : "UnLiked"
      )
    );
});

const toggleTweetLike = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  //TODO: toggle like on tweet
  if (!isValidObjectId(tweetId)) {
    throw new ApiError(400, "Invalid tweetId");
  }

  const tweet = await Tweet.findById(tweetId);
  if (!tweet) {
    throw new ApiError(404, "Tweet not found");
  }
  let isLiked;
  const isLikeExist = await Like.findOne({
    tweet: tweetId,
    likedBy: req.user._id,
  });
  if (isLikeExist) {
    await Like.findOneAndDelete({ tweet: tweetId, likedBy: req.user._id });
    isLiked = false;
  } else {
    await Like.create({ tweet: tweetId, likedBy: req.user._id });
    isLiked = true;
  }

  const likesCount = await Like.countDocuments({ tweet: tweetId });
  return res
    .status(201)
    .json(
      new ApiResponse(
        200,
        { isLiked, likes: likesCount },
        isLiked ? "Liked" : "UnLiked"
      )
    );
});

const getLikedVideos = asyncHandler(async (req, res) => {
  //TODO: get all liked videos
});

export { toggleCommentLike, toggleTweetLike, toggleVideoLike, getLikedVideos };
