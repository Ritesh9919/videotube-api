import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
  {
    subscriber: {
      type: mongoose.Types.ObjectId, // one who is subscribe
      ref: "User",
    },
    channel: {
      type: mongoose.Types.ObjectId, // one to whom subscribing
      ref: "User",
    },
  },
  { timestamps: true }
);

export const Subscription = mongoose.model("Subscription", subscriptionSchema);
