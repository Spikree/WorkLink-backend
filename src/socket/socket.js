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
  });

  socket.on("disconnect", () => {
    const userId = socket.userId;

    if (userId) {
      const userSockets = users.get(userId);
      if (userSockets) {
        users.delete(userId);
        activeUsers.delete(userId);
      }
    }

    console.log(
      `User ${userId || "unknown"} diconnected (socket: ${socket.id})`
    );
  });
});

export { io, server, app ,users};
