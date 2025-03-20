import express from "express";
import verifyToken from "../middleware/verifytoken.middleware.js";
import checkEmployerRole from "../middleware/checkEmployerRole.middleware.js";
import { createJob } from "../controllers/job.controller.js";

const router = express.Router();

router.post("/createJob", verifyToken,checkEmployerRole,createJob);

export default router;