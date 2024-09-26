import { Server } from "socket.io";
import http from "http";
import express from "express";
import User from "../models/user.model.js";

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"],
  },
});

const userSocketMap = {}; // { userId: socketId }

// Function to get the socketId of a specific receiver by their userId
export const getReceiverSocketId = (receiverId) => {
  return userSocketMap[receiverId];
};

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  const userId = socket.handshake.query.userId;

  if (userId != "undefined") {
    // Map userId to their socketId
    userSocketMap[userId] = socket.id;
  }

  // Emit the list of online users to all clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // Listen for disconnection
  socket.on("disconnect", async () => {
    console.log("User disconnected:", socket.id);

    // Save the user's last seen time in the database when they disconnect
    if (userId !== "undefined") {
      delete userSocketMap[userId]; // Remove user from the online users map
      io.emit("getOnlineUsers", Object.keys(userSocketMap)); // Update the online users list

      // Update lastSeen in the database
      try {
        await User.findByIdAndUpdate(userId, { lastSeen: new Date() });
      } catch (err) {
        console.error("Error updating lastSeen:", err);
      }
    }
  });
});

export { app, io, server };
