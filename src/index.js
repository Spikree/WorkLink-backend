import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from 'cookie-parser';
import rateLimit from "express-rate-limit"

import authRouter from "./routes/auth.route.js";
import profileRouter from "./routes/profile.route.js"
import jobRouter from "./routes/job.route.js"
import applicationRouter from "./routes/application.route.js"
import reviewRouter from "./routes/review.route.js";
import messageRouter from "./routes/chat.route.js"
import userDetailsRouter from "./routes/userDetails.route.js"

import connectDb from "./lib/connectToDb.js";

import { app,server } from "./socket/socket.js";

const apiLimit = rateLimit({
    windowMs: 60_000,
    max:500,
})

dotenv.config();
app.use(express.json());
app.use(cookieParser());
const PORT = process.env.PORT || 5000;
app.use(cors({ origin: "https://worklink-client.onrender.com", credentials: true }));
app.use(apiLimit)
connectDb();

app.use("/auth",authRouter);
app.use("/profile",profileRouter);
app.use("/job",jobRouter);
app.use("/application",applicationRouter);
app.use("/review",reviewRouter);
app.use("/message",messageRouter);
app.use("/user", userDetailsRouter);

app.get("/",(req,res) => {
    res.send("Backend working");
});

server.listen(PORT,() => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
