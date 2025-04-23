import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

const users = new Map();
const activeUsers = new Set();
const chatConnections = new Map();

io.on("connection", (socket) => {
  console.log(`A user connected: ${socket.id}`);

  socket.on("join", (userId) => {
    if (!userId) return;

    currentUserId = userId;
    socket.userId = userId;

    if (!users.has(userId)) {
      users.set(userId, new Set());
    }

    users.get(userId).add(socket.id);

    console.log(`User ${userId} joined with socket Id:  ${socket.id}`);

    activeUsers.add(userId);

    broadcastUserStatus(userId,true)
  });

  socket.on("joinChat", (chatId) => {
    socket.join(chatId);
    console.log(
      `user with socket id ${socket.id} joined chat room:: ${chatId}`
    );
  });

  socket.on("setActiveStatus", ({ userId }) => {
    if (!userId) return;

    activeUsers.add(userId);
    broadcastUserStatus(userId, true);
  });

  socket.on("typing", (data) => {
    const {senderId, receiverId, chatId} = data;

    const receiverSockets = users.get(receiverId);

    if(receiverSockets) {
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
    const {senderId, receiverId, chatId} = data;

    const receiverSockets = users.get(receiverId);
    if(receiverSockets) {
      receiverSockets.forEach((socketId) => {
        io.to(socketId).emit("userTyping", {
          senderId,
          isTyping: false,
          chatId
        })
      })
    }
  })

  socket.on("disconnect", () => {
    const userId = socket.userId;

    if (userId) {
      const userSockets = users.get(userId);
      if (userSockets) {
        users.delete(userId);
        activeUsers.delete(userId);

        broadcastUserStatus(userId, false)
      }
    }

    console.log(
      `User ${userId || "unknown"} diconnected (socket: ${socket.id})`
    );
  });

  function broadcastUserStatus(userId,isActive) {
    io.emit("userActiveStatus", {
      userId,
      isActive
    });
  }

  function sendAllActiveStatusToUser(socket) {
    activeUsers.forEach(activeUserId => {
      socket.emit("userActiveStatus", {
        userId: activeUserId,
        isActive: true
      })
    })
  }

  socket.on("userLogout", (userId) => {
    if(!userId) return;

    activeUsers.delete(userId);

    io.emit("userActiveStatus", {
      userId,
      isActive: false
    });

    socket.disconnect(true);

    console.log(`user ${userId} logged out`);
  })
});

export { io, server, app ,users};
