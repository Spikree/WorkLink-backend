import express from "express";
import verifyToken from "../middleware/verifytoken.middleware";

const router = express.Router();

router.get("/getMessages/:id",verifyToken,)