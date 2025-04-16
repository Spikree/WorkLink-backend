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
  });
});

export { io, server, app };
