import express from "express";
import verifyToken from "../middleware/verifytoken.middleware.js";
import { editUser, getUser,getUserProfile } from "../controllers/profile.controller.js";

const router = express.Router();

router.get("/getUser",verifyToken,getUser);
router.put("/edit",verifyToken,editUser);
router.get("/getUserProfile/:userId",verifyToken,getUserProfile);

export default router;

