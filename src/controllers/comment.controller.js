import mongoose from "mongoose";
import { Comment } from "../models/comment.model.js";
import { Video } from "../models/video.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getVideoComments = asyncHandler(async (req, res) => {
  //TODO: get all comments for a video
  const { videoId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(400, "Video not found");
  }

  const comments = await Comment.find({ video: videoId })
    .limit(limit)
    .skip((page - 1) * limit);
  return res
    .status(200)
    .json(new ApiResponse(200, comments, "comments fetched successfully"));
});

const addComment = asyncHandler(async (req, res) => {
  // TODO: add a comment to a video
  const { videoId } = req.params;
  const { content } = req.body;
  if (!content) {
    throw new ApiError(400, "comment is required");
  }
  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(400, "Video not found");
  }

  const comment = await Comment.create({
    content,
    video: videoId,
    owner: req.user._id,
  });
  return res.status(201).json(new ApiResponse(200, comment, "Comment added"));
});

const updateComment = asyncHandler(async (req, res) => {
  // TODO: update a comment
  const { commentId } = req.params;
  const { content } = req.body;
  if (!content) {
    throw new ApiError(400, "content is required");
  }
  const existedComment = await Comment.findById(commentId);
  if (!existedComment) {
    throw new ApiError(400, "comment not found");
  }

  if (!req.user._id.equals(existedComment.owner)) {
    throw new ApiError(400, "You can't update other's comment");
  }

  const comment = await Comment.findByIdAndUpdate(
    commentId,
    { $set: { content } },
    { new: true }
  );

  return res.status(200).json(new ApiResponse(200, comment, "comment updated"));
});

const deleteComment = asyncHandler(async (req, res) => {
  // TODO: delete a comment
  const { commentId } = req.params;

  const existedComment = await Comment.findById(commentId);
  if (!existedComment) {
    throw new ApiError(400, "comment not found");
  }

  if (!req.user._id.equals(existedComment.owner)) {
    throw new ApiError(400, "You can't delete other's comment");
  }

  await Comment.findByIdAndDelete(commentId);

  return res.status(200).json(new ApiResponse(200, {}, "comment deleted"));
});

export { getVideoComments, addComment, updateComment, deleteComment };
