import express from "express"
import verifyToken from "../middleware/verifytoken.middleware.js"
import { deleteReview, editReview, getReview, postReview } from "../controllers/review.controller.js";

const router = express.Router();

router.post("/post/:userId",verifyToken,postReview);
router.get("/getReviews/:userId",verifyToken,getReview);
router.delete("/deleteReview/:reviewId",verifyToken,deleteReview);
router.put("/edit/:reviewId",verifyToken,editReview);

export default router;