import express from "express";
import {
  newConnection,
  getConnections,
} from "../controllers/connection.controller.js";

const connectionRouter = express.Router();

connectionRouter.post("/new-connection", newConnection);

connectionRouter.put("/get-connections", getConnections);

export default connectionRouter;
