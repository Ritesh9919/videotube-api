import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    owner: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    video: {
      type: mongoose.Types.ObjectId,
      ref: "Video",
    },
  },
  { timestamps: true }
);

export const Comment = mongoose.model("Comment", commentSchema);
