import express from "express";
import { adminLogin, adminSignup, adminLogout, fetchAllAdmins } from "../controllers/adminController.js";

const router = express.Router();

router.post("/login", adminLogin);

router.post("/signup", adminSignup);

router.post("/logout", adminLogout);

router.get("/all", fetchAllAdmins);

export default router;
