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

// Function to notify the sender when the request is accepted
export function notifySenderRequestAccepted(senderId, recipientId) {
  const senderSocketId = getReceiverSocketId(senderId); // Fetch the socket ID of the sender (User 2)

  if (senderSocketId) {
    // Emit a 'requestAccepted' event to the sender
    io.to(senderSocketId).emit("requestAccepted", {
      recipientId,
      senderId, // Pass recipient's ID so the sender can update their UI
    });
  } else {
    console.log("Sender is not connected or socket ID not found");
  }
}

export { app, io, server };
