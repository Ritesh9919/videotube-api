import mongoose, { isValidObjectId } from "mongoose";
import { Playlist } from "../models/playlist.model.js";
import { Video } from "../models/video.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createPlaylist = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  //TODO: create playlist
  if (!name || !description) {
    throw new ApiError(400, "Both fields are required");
  }

  const playlist = await Playlist.create({
    name,
    description,
    owner: req.user._id,
  });
  return res
    .status(201)
    .json(new ApiResponse(200, playlist, "Playlist created"));
});

const getUserPlaylists = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  //TODO: get user playlists
  const playlists = await Playlist.find({ owner: userId });
  return res
    .status(200)
    .json(new ApiResponse(200, playlists, "playlists fetched"));
});

const getPlaylistById = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  //TODO: get playlist by id
  const playlist = await Playlist.findById(playlistId);
  if (!playlist) {
    throw new ApiError(404, "playlist not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, playlist, "playlist fetched"));
});

const addVideoToPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;
  const video = await Video.findById(videoId);
  const playlist = await Playlist.findById(playlistId);
  if (!playlist) {
    throw new ApiError(404, "Plalist not found");
  }
  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  playlist.videos.push(videoId);
  await playlist.save();
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Video added to playlist"));
});

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;
  // TODO: remove video from playlist
  const video = await Video.findById(videoId);
  const playlist = await Playlist.findById(playlistId);
  if (!playlist) {
    throw new ApiError(404, "Plalist not found");
  }
  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  await Playlist.findOneAndUpdate(
    { _id: playlistId },
    { $pull: { videos: videoId } }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "video removed from playlist"));
});

const deletePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;

  const existedPlaylist = await Playlist.findById(playlistId);
  if (!existedPlaylist) {
    throw new ApiError(404, "Playlist not found");
  }

  if (!req.user._id.equals(existedPlaylist.owner)) {
    throw new ApiError(400, "You can't delete other's playlist");
  }

  await Playlist.findByIdAndDelete(playlistId);
  return res.status(200).json(new ApiResponse(200, {}, "playlist deleted"));
});

const updatePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  const { name, description } = req.body;
  if (!name || !description) {
    throw new ApiError(400, "Both fields are required");
  }
  const existedPlaylist = await Playlist.findById(playlistId);
  if (!existedPlaylist) {
    throw new ApiError(404, "Playlist not found");
  }

  if (!req.user._id.equals(existedPlaylist.owner)) {
    throw new ApiError(400, "You can't update other's playlist");
  }

  const playlist = await Playlist.findByIdAndUpdate(
    playlistId,
    { $set: { name, description } },
    { new: true }
  );
  return res
    .status(200)
    .json(new ApiResponse(200, playlist, "playlist updated"));
});

export {
  createPlaylist,
  getUserPlaylists,
  getPlaylistById,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  deletePlaylist,
  updatePlaylist,
};
