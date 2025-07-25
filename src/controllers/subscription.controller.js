import mongoose, { isValidObjectId } from "mongoose";
import { User } from "../models/user.model.js";
import { Subscription } from "../models/subscription.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleSubscription = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  // TODO: toggle subscription
  const existedSubscription = await Subscription.findOne({
    channel: channelId,
    subscriber: req.user._id,
  });
  if (existedSubscription) {
    await Subscription.findOneAndDelete({
      channel: channelId,
      subscriber: req.user._id,
    });
    return res.status(200).json(new ApiResponse(200, {}, "Unsubscribed"));
  }

  const subscription = await Subscription.create({
    channel: channelId,
    subscriber: req.user._id,
  });
  return res.status(200).json(new ApiResponse(200, subscription, "Subscribed"));
});

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  const channelSubscribers = await Subscription.find({
    channel: channelId,
  }).populate({
    path: "subscriber",
    select: "fullName username avatar",
  });
  return res
    .status(200)
    .json(
      new ApiResponse(200, channelSubscribers, "channel subscribers fetched")
    );
});

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
  const { subscriberId } = req.params;
  const subscribedChannels = await Subscription.find({
    subscriber: subscriberId,
  }).populate({
    path: "channel",
    select: "fullName username avatar",
  });
  return res
    .status(200)
    .json(
      new ApiResponse(200, subscribedChannels, "channel subscribers fetched")
    );
});

export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels };
