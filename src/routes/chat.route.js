import express from "express";
import verifyToken from "../middleware/verifytoken.middleware.js";
import upload from "../middleware/multer.middleware.js";
import { getMessages, sendMessage } from "../controllers/chat.controller.js";

const router = express.Router();

router.get("/getMessages/:id",verifyToken,getMessages);
router.post("/sendMessage/:id",verifyToken,upload.single("image"),sendMessage);

export default router;