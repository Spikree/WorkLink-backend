import express from "express";
import verifyToken from "../middleware/verifytoken.middleware.js";
import checkEmployerRole from "../middleware/checkEmployerRole.middleware.js";
import { createJob, getJobApplications, getJobs } from "../controllers/job.controller.js";
import checkFreelancerRole from "../middleware/checkFreelancerRole.middleware.js";

const router = express.Router();

router.post("/createJob", verifyToken,checkEmployerRole,createJob);
router.get("/getJobs",verifyToken,checkFreelancerRole,getJobs);
router.get("/getApplications/:id",verifyToken,checkEmployerRole,getJobApplications);

export default router;