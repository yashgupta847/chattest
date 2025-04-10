const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
app.use(cors());

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const onlineUsers = new Map(); // key: userId, value: socket.id

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("join_room", (room) => {
    socket.join(room);
    console.log(`User ${socket.id} joined room: ${room}`);
  });

  // ✅ User came online
  socket.on("user_connected", (userId) => {
    onlineUsers.set(userId, socket.id);
    console.log(`${userId} is online`);
    socket.broadcast.emit("user_online", userId); // tell others
  });

  // ✅ Check status of a friend
  socket.on("check_online_status", (friendId) => {
    if (onlineUsers.has(friendId)) {
      socket.emit("user_online", friendId);
    } else {
      socket.emit("user_offline", friendId);
    }
  });

  // ✅ User disconnected manually (like closing tab or going back)
  socket.on("user_disconnected", (userId) => {
    onlineUsers.delete(userId);
    console.log(`${userId} manually disconnected`);
    socket.broadcast.emit("user_offline", userId);
  });

  // ✅ Disconnected forcefully (refresh/tab closed)
  socket.on("disconnect", () => {
    const userId = [...onlineUsers.entries()].find(([, id]) => id === socket.id)?.[0];
    if (userId) {
      onlineUsers.delete(userId);
      socket.broadcast.emit("user_offline", userId);
      console.log(`${userId} disconnected (socket event)`);
    }
  });

  socket.on("send_message", (data) => {
    io.to(data.room).emit("receive_message", data);
    console.log("send data", data);
  });
});

server.listen(5000, () => {
  console.log("Server is running on http://localhost:5000");
});
