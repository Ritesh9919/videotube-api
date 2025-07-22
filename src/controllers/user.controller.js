import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

export const register = asyncHandler(async (req, res) => {
  const { email, username, password, fullName } = req.body;

  // validating inputs
  if (
    [email, username, password.fullName].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  // checking if user already registered
  const existedUser = await User.findOne({ $or: [{ username }, { email }] });
  if (existedUser) {
    throw new ApiError(409, "User with email or username already exists");
  }
  // getting avatar and coverImage local path
  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;
  if (!avatarLocalPath) {
    throw new ApiError(400, "avatar file is required");
  }

  // uploading and avatar and coverImage to cloudinary and getting image url in response
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);
  if (!avatar) {
    throw new ApiError(400, "avatar file is required");
  }

  // creating newUser
  const newUser = await User.create({
    fullName,
    email,
    username: username.toLowerCase(),
    password,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
  });

  // getting user with userID and removing some sensitive fields from response for security
  const user = await User.findById(newUser._id).select(
    "-password -refreshToken"
  );
  if (!user) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  // return response if everything is ok
  return res
    .status(201)
    .json(new ApiResponse(200, user, "User registered successfully!"));
});

export const login = asyncHandler(async (req, res) => {
  res.send("Ok");
});

export const logout = asyncHandler(async (req, res) => {
  res.send("Ok");
});
