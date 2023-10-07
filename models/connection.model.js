import mongoose from "mongoose";
import UserModel from "./user.model.js";

const Schema = mongoose.Schema;

const ConnectionModel = new Schema(
  {
    userOneId: {
      type: Schema.Types.ObjectId,
      ref: UserModel,
      required: true,
    },
    userTwoId: {
      type: Schema.Types.ObjectId,
      ref: UserModel,
      required: true,
    },
    userOneName: {
      type: String,
      req: true,
    },
    userTwoName: {
      type: String,
      req: true,
    },
    status: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("connections", ConnectionModel);
