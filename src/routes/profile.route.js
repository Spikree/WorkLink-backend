import express from "express";
import verifyToken from "../middleware/verifytoken.middleware.js";
import {editUser, getEmployer, getUser, getUserProfile,getUserById} from "../controllers/profile.controller.js";

const router = express.Router();

router.get("/getUser",verifyToken,getUser);
router.put("/edit",verifyToken,editUser);
router.get("/getUserProfile/:userId",verifyToken,getUserProfile);
router.get("/getEmployer/:id",verifyToken,getEmployer);
router.get("/getUserById/:id",verifyToken,getUserById);

export default router;

