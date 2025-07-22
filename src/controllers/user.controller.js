import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save();
    return { refreshToken, accessToken };
  } catch (error) {
    console.error(error);
    throw new ApiError(500, "error while generating access and refresh token");
  }
};

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
  const { username, email, password } = req.body;

  // validating input
  if (!email || !username) {
    throw new ApiError(400, "username or email is required");
  }

  // checking if user is already register or not
  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  // if user not exist then throw error
  if (!existedUser) {
    throw new ApiError(400, "User not registered");
  }

  // if user is registered then comapare the password
  const isMatch = await existedUser.comparePassword(password);
  // if not match throw error
  if (!isMatch) {
    throw new ApiError(401, "Invalid credential");
  }

  // now user is registered and password is currect then generate access and refresh token
  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    existedUser._id
  );

  // find the user and exclude some sensitive information
  const user = await User.findById(existedUser._id).select(
    "-password -refreshToken"
  );

  // cookie option
  const option = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, option)
    .cookie("refreshToken", refreshToken, option)
    .json(
      new ApiResponse(
        200,
        { user, refreshToken, accessToken },
        "User logged in successfully"
      )
    );
});

export const logout = asyncHandler(async (req, res) => {
  res.send("Ok");
});
