import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from 'cookie-parser';

import authRouter from "./routes/auth.route.js";
import profileRouter from "./routes/profile.route.js"
import jobRouter from "./routes/job.route.js"
import applicationRouter from "./routes/application.route.js"
import reviewRouter from "./routes/review.route.js";

import connectDb from "./lib/connectToDb.js";

import { app,server } from "./socket/socket.js";

dotenv.config();
app.use(express.json());
app.use(cookieParser());
const PORT = process.env.PORT || 5000;
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
connectDb();

app.use("/auth",authRouter);
app.use("/profile",profileRouter);
app.use("/job",jobRouter);
app.use("/application",applicationRouter);
app.use("/review",reviewRouter);

app.get("/",(req,res) => {
    res.send("Backend working");
});

server.listen(PORT,() => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
