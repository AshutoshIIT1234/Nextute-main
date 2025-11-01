import express from "express";
import studentAuth from "../middlewares/studentAuthMiddleware.js";
import {
  signup,
  verifyCode,
  login,
  getStudentProfile,
  logout,
  resendVerificationCode,
  deleteStudent,
  fetchAllStudents,
  fetchStudentById,
  editStudentById,
  uploadStudentProfileImage,
} from "../controllers/studentAuthController.js";
import { validateEmailDomain } from "../middlewares/emailValidationMiddleware.js";
import { uploadImage } from "../config/multer.js";

const router = express.Router();


router.get("/all", fetchAllStudents);
router.get("/profile", studentAuth, getStudentProfile);
router.get("/:id", fetchStudentById);
router.put("/:id", editStudentById);

router.patch("/:id/profile-image", studentAuth, uploadImage.single("image"), uploadStudentProfileImage);

router.post("/signup", validateEmailDomain, signup);
router.post("/verify", validateEmailDomain, verifyCode);
router.post("/resend-verification", resendVerificationCode);
router.post("/auth/login", login);
router.post("/logout", studentAuth, logout);

router.delete("/auth/delete", deleteStudent);

export default router;
