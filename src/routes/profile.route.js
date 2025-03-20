import express from "express";
import verifyToken from "../middleware/verifytoken.middleware.js";
import { editUser, getUser } from "../controllers/profile.controller.js";

const router = express.Router();

router.get("/getUser",verifyToken,getUser);
router.put("/edit",verifyToken,editUser);

export default router;

