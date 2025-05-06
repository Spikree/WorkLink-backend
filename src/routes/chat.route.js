import express from "express";
import verifyToken from "../middleware/verifytoken.middleware.js";
import { getMessages, sendMessage } from "../controllers/chat.controller.js";

const router = express.Router();

router.get("/getMessages/:id",verifyToken,getMessages);
router.post("/sendMessage/:id",verifyToken,sendMessage);

export default router;