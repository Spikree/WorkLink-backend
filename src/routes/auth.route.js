import express from "express";
import { checkAuth, login, register, resetpassword } from "../controllers/auth.controller.js";
import verifyToken from "../middleware/verifytoken.middleware.js";
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.put("/resetpassword", verifyToken,resetpassword);
router.get("/check",verifyToken,checkAuth);

export default router;