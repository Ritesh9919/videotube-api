import express from "express";
const router = express.Router();
import { upload } from "../middlewares/multer.middleware.js";
import {
  register,
  login,
  logout,
  refreshAccessToken,
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

export default router;
