import express from "express";
const router = express.Router();
import { upload } from "../middlewares/multer.middleware.js";
import {
  register,
  login,
  logout,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateUserAccountDetails,
  updateAvatarImage,
} from "../controllers/user.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

router.post(
  "/register",
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  register
);
router.post("/login", login);
router.post("/logout", verifyJwt, logout);
router.post("/refresh-token", refreshAccessToken);
router.post("/change-password", verifyJwt, changeCurrentPassword);
router.get("/current", verifyJwt, getCurrentUser);
router.put("/update-account-details", verifyJwt, updateUserAccountDetails);
router.put(
  "/update-avatar",
  verifyJwt,
  upload.single("avatar"),
  updateAvatarImage
);

export default router;
