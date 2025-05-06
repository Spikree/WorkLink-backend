import express from "express"
import verifyToken from "../middleware/verifytoken.middleware.js";
import { getUserDetails } from "../controllers/userDetails.controller.js";

const router = express.Router();

router.get("/getUserDetails/:id", verifyToken,getUserDetails);

export default router;