import express from "express";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
const app = express();
app.use(express.json());
const PORT = process.env.PORT || 5000;
app.use(cors({
    origin: "http://localhost:5173",
}));

app.get("/",(req,res) => {
    res.send("Backend working");
})

app.listen(PORT,() => {
    console.log(`Server is running on http://localhost:${PORT}`);
})