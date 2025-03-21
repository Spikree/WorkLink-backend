import express from "express"
import verifyToken from "../middleware/verifytoken.middleware.js";
import checkFreelancerRole from "../middleware/checkFreelancerRole.middleware.js";
import { applyJob } from "../controllers/application.controller.js";

const router = express.Router();

router.post("/applyJob/:id",verifyToken,checkFreelancerRole,applyJob);

export default router;
