import express from "express";
import { createEmployee, getEmployees, getEmployee, editEmployee, deleteEmployee } from "../controllers/employeeController.js";

const router = express.Router();

router.post("/", createEmployee);
router.get("/members", getEmployees);
router.get("/member/:certificateNo", getEmployee);
router.put("/member/:certificateNo", editEmployee);
router.delete("/member/:certificateNo", deleteEmployee);

export default router;