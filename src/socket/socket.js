import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "https://worklink-client.onrender.com/",
    methods: ["GET", "POST"],
  },
});

const users = new Map(); // userId -> Set of socketIds
const activeUsers = new Set(); // Set of active userIds
const chatConnections = new Map();

// Function to broadcast a user's status to all connected users
function broadcastUserStatus(userId, isActive) {
  io.emit("userActiveStatus", {
    userId,
    isActive
  });
}

// Function to send active status of all online users to a specific socket
function sendAllActiveStatusToUser(socket) {
  activeUsers.forEach(activeUserId => {
    socket.emit("userActiveStatus", {
      userId: activeUserId,
      isActive: true
    });
  });
}

io.on("connection", (socket) => {
  console.log(`A user connected: ${socket.id}`);
  
  socket.on("join", (userId) => {
    if (!userId) return;

    socket.userId = userId;

    // Store socket connection
    if (!users.has(userId)) {
      users.set(userId, new Set());
    }
    users.get(userId).add(socket.id);

    console.log(`User ${userId} joined with socket Id: ${socket.id}`);

    // Mark user as active
    activeUsers.add(userId);
    
    // Broadcast this user's status to everyone
    broadcastUserStatus(userId, true);
    
    // Send all active users' status to this user
    sendAllActiveStatusToUser(socket);
  });

  socket.on("joinChat", (chatId) => {
    socket.join(chatId);
    console.log(`User with socket id ${socket.id} joined chat room: ${chatId}`);
  });

  socket.on("setActiveStatus", ({ userId }) => {
    if (!userId) return;

    activeUsers.add(userId);
    broadcastUserStatus(userId, true);
  });

  socket.on("typing", (data) => {
    const { senderId, receiverId, chatId } = data;

    const receiverSockets = users.get(receiverId);
    if (receiverSockets) {
      receiverSockets.forEach((socketId) => {
        io.to(socketId).emit("userTyping", {
          senderId,
          isTyping: true,
          chatId
        });
      });
    }
  });

  socket.on("stopTyping", (data) => {
    const { senderId, receiverId, chatId } = data;

    const receiverSockets = users.get(receiverId);
    if (receiverSockets) {
      receiverSockets.forEach((socketId) => {
        io.to(socketId).emit("userTyping", {
          senderId,
          isTyping: false,
          chatId
        });
      });
    }
  });

  socket.on("disconnect", () => {
    const userId = socket.userId;

    if (userId) {
      const userSockets = users.get(userId);
      
      if (userSockets) {
        // Remove only this socket, not all user sockets
        userSockets.delete(socket.id);
        
        // If this was the user's last socket, mark them as inactive
        if (userSockets.size === 0) {
          users.delete(userId);
          activeUsers.delete(userId);
          broadcastUserStatus(userId, false);
        }
      }
    }

    console.log(`User ${userId || "unknown"} disconnected (socket: ${socket.id})`);
  });

  socket.on("userLogout", (userId) => {
    if (!userId) return;

    // Remove user from active users
    activeUsers.delete(userId);
    
    // Remove all sockets for this user
    if (users.has(userId)) {
      users.delete(userId);
    }

    // Broadcast status change
    broadcastUserStatus(userId, false);

    // Disconnect this socket
    socket.disconnect(true);

    console.log(`User ${userId} logged out`);
  });
});

export { io, server, app, users };
