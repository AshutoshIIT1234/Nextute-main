import jwt from "jsonwebtoken";
import prisma from "../db/index.js";
import { promisify } from "util";
import dotenv from "dotenv";

dotenv.config();

const studentAuth = async (req, res, next) => {
  try {
    const token =
      req.cookies.authToken || req.headers.authorization?.split(" ")[1];

    console.log("🔐 Student Auth - Token present:", !!token);

    if (!token) {
      console.log("❌ No token found in cookies or headers");
      return res.status(401).json({
        status: false,
        message: "Student authentication required",
        error: "UNAUTHORIZED",
      });
    }

    const decoded = await promisify(jwt.verify)(token, process.env.TOKEN_KEY);
    console.log("🔓 Token decoded:", { id: decoded.id, type: decoded.type });

    if (decoded.type !== "student") {
      console.log("❌ Invalid token type:", decoded.type, "Expected: student");
      return res.status(403).json({
        status: false,
        message: "Invalid token type for student route",
        error: "FORBIDDEN",
        tokenType: decoded.type,
      });
    }

    const student = await prisma.student.findUnique({
      where: { id: decoded.id },
    });

    if (!student) {
      console.log("❌ Student not found with ID:", decoded.id);
      return res.status(404).json({
        status: false,
        message: "Student not found",
        error: "NOT_FOUND",
      });
    }

    console.log("✅ Student authenticated:", student.email, "Verified:", student.is_verified);
    req.student = student;
    next();
  } catch (error) {
    console.error("❌ Auth Middleware Error:", {
      message: error.message,
      name: error.name,
      stack: error.stack,
    });
    return res.status(401).json({
      status: false,
      message: "Authentication failed",
      error:
        process.env.NODE_ENV === "development" ? error.message : "UNAUTHORIZED",
    });
  }
};

export default studentAuth;
