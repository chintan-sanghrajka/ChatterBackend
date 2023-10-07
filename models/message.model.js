import mongoose from "mongoose";
import UserModel from "./user.model.js";

const Schema = mongoose.Schema;

const MessageModel = new Schema(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: UserModel,
      required: true,
    },
    recipient: {
      type: Schema.Types.ObjectId,
      ref: UserModel,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("messages", MessageModel);
