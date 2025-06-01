import express from "express";
import verifyToken from "../middleware/verifytoken.middleware.js";
import upload from "../middleware/multer.middleware.js";
import {
  editUser,
  getEmployer,
  getUser,
  getUserProfile,
  getUserById,
  uploadProfilePicture,
} from "../controllers/profile.controller.js";

const router = express.Router();

router.get("/getUser", verifyToken, getUser);
router.put("/edit", verifyToken, editUser);
router.get("/getUserProfile/:userId", verifyToken, getUserProfile);
router.get("/getEmployer/:id", verifyToken, getEmployer);
router.get("/getUserById/:id", verifyToken, getUserById);
router.post(
  "/uploadProfilePicture",
  verifyToken,
  upload.single("image"),
  uploadProfilePicture
);

export default router;
