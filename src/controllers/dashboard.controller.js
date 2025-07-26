import mongoose from "mongoose";
import { Video } from "../models/video.model.js";
import { Subscription } from "../models/subscription.model.js";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";

const getChannelStats = asyncHandler(async (req, res) => {
  // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.

  // total videos views count
  const channelStats = await Video.aggregate([
    {
      $match: {
        owner: new mongoose.Types.ObjectId(req.user._id),
      },
    },
    {
      $lookup: {
        from: "likes",
        localField: "_id",
        foreignField: "video",
        as: "likes",
      },
    },
    {
      $group: {
        _id: null,
        totalViews: {
          $sum: "$views",
        },
        totalVideos: {
          $sum: 1,
        },
        totalLikes: {
          $sum: "$likes",
        },
      },
    },
    {
      $addFields: {
        owner: new mongoose.Types.ObjectId(req.user._id),
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "owner",
        foreignField: "channel",
        as: "totalSubscribers",
      },
    },
    {
      $addFields: {
        totalSubscribers: {
          $size: "$totalSubscribers",
        },
      },
    },
    {
      $project: {
        owner: 0,
        _id: 0,
      },
    },
  ]);

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        channelStats[0],
        "Channel stats fetched successfully"
      )
    );
});

const getChannelVideos = asyncHandler(async (req, res) => {
  // TODO: Get all the videos uploaded by the channel
  const videos = await Video.find({ owner: req.user._id });
  return res
    .status(200)
    .json(new ApiResponse(200, videos, "Videos fetched successfully"));
});

export { getChannelStats, getChannelVideos };
