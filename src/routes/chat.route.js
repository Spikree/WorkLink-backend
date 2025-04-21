import express from "express";
import verifyToken from "../middleware/verifytoken.middleware";
import { getMessages, sendMessage } from "../controllers/chat.controller";

const router = express.Router();

router.get("/getMessages/:id",verifyToken,getMessages);
router.post("/sendMessage/:id",verifyToken,sendMessage);