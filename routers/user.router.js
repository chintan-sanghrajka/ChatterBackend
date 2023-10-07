import express from "express";
import {
  checkUser,
  addUser,
  login,
  getUsers,
} from "../controllers/user.controller.js";

const userRouter = express.Router();

userRouter.post("/check-user", checkUser);

userRouter.post("/add-user", addUser);

userRouter.post("/login", login);

userRouter.post("/get-users", getUsers);

export default userRouter;
