const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

require("dotenv").config();

app.use(cors());

const server = http.createServer(app);

const allowOrigin = process.env.ALLOWED_ORIGIN || "";

const io = new Server(server, {
  cors: {
    origin: allowOrigin,
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("Socket Id: ", socket.id);
  socket.on("join_room", (data) => {
    socket.join(data);
    console.log("User with ID: ", socket.id, "Joined room: ", data);
  });
  socket.on("send_message", (data) => {
    socket.to(data.room).emit("recieve_message", data);
    console.log("Data: ", data);
  });
  socket.on("disconnect", () => {
    console.log("Socket disconnected", socket.id);
  });
});

server.listen(4000, () => {
  console.log("Server is running.");
});
