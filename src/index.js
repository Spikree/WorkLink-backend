import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import authRouter from "./routes/auth.route.js";
import profileRouter from "./routes/profile.route.js"
import jobRouter from "./routes/job.route.js"
import connectDb from "./lib/connectToDb.js";

dotenv.config();
const app = express();
app.use(express.json());
const PORT = process.env.PORT || 5000;
app.use(cors({
    origin: "http://localhost:5173",
}));
connectDb();

app.use("/auth",authRouter);
app.use("/profile",profileRouter);
app.use("/job",jobRouter);

app.get("/",(req,res) => {
    res.send("Backend working");
});

app.listen(PORT,() => {
    console.log(`Server is running on http://localhost:${PORT}`);
});