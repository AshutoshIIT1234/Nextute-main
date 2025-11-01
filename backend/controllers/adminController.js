import { sendAdminAlertEmail } from "../utils/emailSender.js";
import { getAdminByEmail, createAdmin, getAllAdmins } from "../models/adminModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

// Admin signup
const adminSignup = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existingAdmin = await getAdminByEmail(email);
    if (existingAdmin) {
      return res.status(409).json({ message: "Admin already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = await createAdmin({ name, email, password: hashedPassword });
  await sendAdminAlertEmail("account creation", newAdmin.email);
  res.status(201).json({ message: "Admin registered successfully", admin: { id: newAdmin.id, name: newAdmin.name, email: newAdmin.email } });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await getAdminByEmail(email);

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const valid = await bcrypt.compare(password, admin.password);
    if (!valid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ adminId: admin.id, email: admin.email }, JWT_SECRET, { expiresIn: "1d" });

  await sendAdminAlertEmail("login", admin.email);
  res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Admin logout
const adminLogout = (req, res) => {
  res.clearCookie("authToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Strict",
  });
  res.status(200).json({ message: "Logout successful" });
};

// Fetch all admins
const fetchAllAdmins = async (req, res) => {
  try {
    const admins = await getAllAdmins();
    res.status(200).json({ admins });
  } catch (error) {
    console.error("Fetch admins error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export { adminLogin, adminSignup, adminLogout, fetchAllAdmins };