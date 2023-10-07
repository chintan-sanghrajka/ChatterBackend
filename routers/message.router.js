import { getChatMessages } from "../controllers/message.controller.js";
import express from "express";

const messageRouter = express.Router();

messageRouter.post("/get-chat-messages", getChatMessages);

export default messageRouter;
