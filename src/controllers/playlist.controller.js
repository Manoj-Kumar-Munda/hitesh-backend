import mongoose, { isValidObjectId } from "mongoose";
import { Playlist } from "../models/playlist.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Video } from "../models/video.model.js";

const createPlaylist = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  if (!name) {
    throw new ApiError(400, "Playlist name is required");
  }

  if (!description) {
    throw new ApiError(400, "Description is required");
  }

  const createdPlaylist = await Playlist.create({
    name,
    description,
    owner: req.user._id,
  });

  if (!createPlaylist) {
    throw new ApiError(500, "Failed to create playlist");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, createdPlaylist, "Playlist created!!"));
});

const getUserPlaylists = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (!isValidObjectId(userId)) {
    throw new ApiError(400, "Invalid userId");
  }

  const userPlaylist = await Playlist.find({
    owner: new mongoose.Types.ObjectId(userId),
  });

  if (!userPlaylist) {
    throw new ApiError(500);
  }
});

const getPlaylistById = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  //TODO: get playlist by id
});

const addVideoToPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;

  if (!isValidObjectId(playlistId)) {
    throw new ApiError(400, "Invalid playlistId");
  }
  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid videoId");
  }

  const video = await Video.findById(videoId);
  const playlist = await Playlist.findById(playlistId);

  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  if (!playlist) {
    throw new ApiError(404, "Playlist not found");
  }

  if (
    !(playlist.owner.equals(req.user?._id) && video.owner.equals(req.user._id))
  ) {
    throw new ApiError(400, "Only owner can make changes to othe playlist");
  }

  const updatedPlaylist = await Playlist.findByIdAndUpdate(
    playlistId,
    {
      $addToSet: {
        videos: videoId,
      },
    },
    { new: true }
  );
  if (!updatedPlaylist) {
    throw new ApiError(500, "Error while adding the video to the playlist");
  }

  return res.status(200).json(new ApiResponse(200, updatedPlaylist, "Video added to the playlist"))
});

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;
  // TODO: remove video from playlist
});

const deletePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  // TODO: delete playlist
});

const updatePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  const { name, description } = req.body;
  //TODO: update playlist
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
