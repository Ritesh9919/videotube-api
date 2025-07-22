import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const register = asyncHandler(async (req, res) => {
  res.send("Ok");
});

export const login = asyncHandler(async (req, res) => {
  res.send("Ok");
});

export const logout = asyncHandler(async (req, res) => {
  res.send("Ok");
});
