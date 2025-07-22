import express from "express";
const router = express.Router();
import { upload } from "../middlewares/multer.middleware.js";
import { register, login, logout } from "../controllers/user.controller.js";

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
router.post("/logout", logout);

export default router;
