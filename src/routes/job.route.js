import express from "express";
import verifyToken from "../middleware/verifytoken.middleware.js";
import checkEmployerRole from "../middleware/checkEmployerRole.middleware.js";
import {
    acceptApplication,
    cancelAcceptedApplication,
    createJob,
    getJobApplications,
    getJobs,
    jobFinished,
    saveJob,
    getOnGoingJob,
    getCreatedJob,
    deletJob,
    getJob,
    getAppliedJobs,
    getFinishedJobs,
    getSavedJobs,
    getCurrentJobs,
    editJobStatus,
    searchJob,
} from "../controllers/job.controller.js";
import checkFreelancerRole from "../middleware/checkFreelancerRole.middleware.js";

const router = express.Router();

router.post("/createJob", verifyToken,checkEmployerRole,createJob);
router.get("/getJob/:id",verifyToken,getJob);
router.get("/getJobs",verifyToken,checkFreelancerRole,getJobs);
router.get("/getApplications/:id",verifyToken,checkEmployerRole,getJobApplications);
router.post("/saveJob/:jobId",verifyToken,checkFreelancerRole,saveJob);
router.post("/acceptApplication/:jobId/:applicationId",verifyToken,checkEmployerRole,acceptApplication);
router.post("/cancelAcceptedApplication/:jobId/:applicationId",verifyToken,checkEmployerRole,cancelAcceptedApplication);
router.post("/jobFinished/:jobId",verifyToken,checkEmployerRole,jobFinished);
router.get("/getOnGoingJobs",verifyToken,checkEmployerRole,getOnGoingJob);
router.get("/getCreatedJobs", verifyToken,checkEmployerRole,getCreatedJob);
router.delete("/deleteJob/:jobId",verifyToken,checkEmployerRole,deletJob);
router.get("/getAppliedJobs", verifyToken,checkFreelancerRole,getAppliedJobs);
router.get("/getFinishedJobs", verifyToken,checkFreelancerRole ,getFinishedJobs);
router.get("/getSavedJobs", verifyToken, checkFreelancerRole, getSavedJobs);
router.get("/getCurrentJobs", verifyToken, checkFreelancerRole,getCurrentJobs);
router.put("/editStatus/:jobId", verifyToken, checkEmployerRole, editJobStatus);
router.post("/searchJob", verifyToken, checkFreelancerRole, searchJob);

export default router;