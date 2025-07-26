import { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const getAllVideos = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;
  //TODO: get all videos based on query, sort, pagination
});

const publishAVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  // TODO: get video, upload to cloudinary, create video
  if (!title || !description) {
    throw new ApiError(400, "Both fields are required");
  }

  const videoFileLocalPath = req.files?.videoFile[0]?.path;
  const thumbnailLocalPath = req.files?.thumbnail[0]?.path;

  if (!videoFileLocalPath || !thumbnailLocalPath) {
    throw new ApiError(400, "video file or thumbnail file required");
  }

  const videoFile = await uploadOnCloudinary(videoFileLocalPath);
  const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);

  if (!videoFile || !videoFile) {
    throw new ApiError(
      400,
      "error uploading videoFile or thumbnail on cloudinary"
    );
  }

  const video = await Video.create({
    title,
    description,
    thumbnail: thumbnail.url,
    videoFile: videoFile.url,
    owner: req.user._id,
    duration: videoFile.duration,
  });
  return res
    .status(201)
    .json(new ApiResponse(200, video, "Video publish successfully"));
});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: get video by id
  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid videoId");
  }

  const video = await Video.findByIdAndUpdate(
    videoId,
    { $inc: { views: 1 } },
    { new: true }
  );
  const user = await User.findById(req.user._id);
  user.watchHistory.push(video._id);
  await user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, video, "Video fetched succssfully"));
});

const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: update video details like title, description, thumbnail
  const { title, description } = req.body;
  if (!title || !description) {
    throw new ApiError(400, "title or description is required");
  }
  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid videoId");
  }

  const existedVideo = await Video.findById(videoId);
  if (!existedVideo) {
    throw new ApiError(404, "Video not found");
  }
  if (!req.user._id.equals(existedVideo.owner)) {
    throw new ApiError(400, "You can only update your uploded video");
  }

  const thumbnailLocalPath = req.file?.path;
  if (!thumbnailLocalPath) {
    throw new ApiError(400, "Thumbnail file is required");
  }

  const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);
  if (!thumbnail) {
    throw new ApiError(400, "error uploading thumbnail on cloudinary");
  }

  const video = await Video.findByIdAndUpdate(
    videoId,
    { $set: { title, description, thumbnail: thumbnail.url } },
    { new: true }
  );
  return res
    .status(200)
    .json(new ApiResponse(200, video, "Video updated successfully"));
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: delete video
  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid videoId");
  }

  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "Video not found");
  }
  if (!req.user._id.equals(video.owner)) {
    throw new ApiError(400, "You can only update your uploded video");
  }

  await Video.findByIdAndDelete(videoId);
  return res.status(200).json(new ApiResponse(200, {}, "Video deleted"));
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid videoId");
  }

  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "Video not found");
  }
  if (!req.user._id.equals(video.owner)) {
    throw new ApiError(400, "Only video owner can change status");
  }

  video.isPublished = !video.isPublished;
  await video.save();
  return res.status(200).json(new ApiResponse(200, {}, "Toggled status"));
});

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
};
