import express from "express";
import verifyToken from "../middleware/verifytoken.middleware.js";
import checkEmployerRole from "../middleware/checkEmployerRole.middleware.js";
import { acceptApplication, cancelAcceptedApplication, createJob, getJobApplications, getJobs, jobFinished, saveJob } from "../controllers/job.controller.js";
import checkFreelancerRole from "../middleware/checkFreelancerRole.middleware.js";

const router = express.Router();

router.post("/createJob", verifyToken,checkEmployerRole,createJob);
router.get("/getJobs",verifyToken,checkFreelancerRole,getJobs);
router.get("/getApplications/:id",verifyToken,checkEmployerRole,getJobApplications);
router.post("/saveJob/:jobId",verifyToken,checkFreelancerRole,saveJob);
router.post("/acceptApplication/:jobId/:applicationId",verifyToken,checkEmployerRole,acceptApplication);
router.post("/cancelAcceptedApplication/:jobId/:applicationId",verifyToken,checkEmployerRole,cancelAcceptedApplication);
router.post("/jobFinished/:jobId",verifyToken,checkEmployerRole,jobFinished);

export default router;