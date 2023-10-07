import mongoose from "mongoose";

const Schema = mongoose.Schema;

const UserModel = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  emailId: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  status: {
    // Status 1: Active 2: Inactive
    type: Number,
    default: 1,
  },
  contact: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

export default mongoose.model("users", UserModel);
