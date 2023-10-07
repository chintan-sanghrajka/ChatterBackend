import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
dotenv.config();
import userRouter from "./routers/user.router.js";
// import ws from "ws";
import * as ws from "ws";
import jwt from "jsonwebtoken";
import connectionRouter from "./routers/connection.router.js";
import MessageModel from "./models/message.model.js";
import messageRouter from "./routers/message.router.js";
import path from "path";

const PORT = process.env.PORT || 8001;
const DBLink = process.env.DBLink;

const app = express();

app.use(express.json());

app.use(cors());

const server = app.listen(PORT, () => {
  console.log("Listening on port: ", PORT);
});

app.get('/', (req, res) => {
  res.send('Hey this is my API running')
})

console.log(server);

mongoose
  .connect(DBLink)
  .then(() => {
    console.log("Database connected successfully.");
  })
  .catch((error) => {
    console.log(error);
  });

app.use(userRouter);
app.use(messageRouter);
app.use(connectionRouter);

const webSocketServer = new ws.WebSocketServer({ server });

// const webSocketServer = new ws.Server({ server });

webSocketServer.on("connection", (connection, req) => {
  const cookies = req.headers.cookie;
  if (cookies) {
    const tokenCookieString = cookies
      .split(";")
      .find((str) => str.startsWith(" ChatterToken="));
    if (tokenCookieString) {
      const token = tokenCookieString.split("=")[1];
      if (token) {
        jwt.verify(token, process.env.SECRET_KEY, {}, (err, userData) => {
          if (err) {
            throw err;
          }
          const { userId, userName } = userData;
          connection.userId = userId;
          connection.userName = userName;
        });
      }
    }
  }

  connection.on("message", async (messageData) => {
    const { message } = JSON.parse(messageData.toString());
    const { recipient, text } = message;
    if (recipient && text) {
      const messageTime = new Date();
      let messageHour = messageTime.getHours();
      let messageMinutes = messageTime.getMinutes();
      const ampm = messageHour >= 12 ? "PM" : "AM";
      messageHour = messageHour % 12 || 12;

      const savedMessage = await MessageModel.create({
        sender: connection.userId,
        recipient: recipient,
        text: text,
        time: `${messageHour}:${messageMinutes} ${ampm}`,
      });

      [...webSocketServer.clients]
        .filter((client) => client.userId === recipient)
        .forEach((client) =>
          client.send(
            JSON.stringify({
              text,
              sender: connection.userId,
              messageId: savedMessage._id,
              recipient: savedMessage.recipient,
            })
          )
        );
    }
  });

  [...webSocketServer.clients].forEach((client) => {
    client.send(
      JSON.stringify({
        online: [...webSocketServer.clients].map((client) => ({
          userId: client.userId,
          userName: client.userName,
        })),
      })
    );
  });
});
