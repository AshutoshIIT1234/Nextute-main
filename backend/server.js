import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import winston from "winston";
import { handleError } from "./utils/errorHandler.js";

import studentAuthRoutes from "./routes/studentAuthRoutes.js";
import instituteAuthRoutes from "./routes/instituteAuthRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import emailSubscriptionRoutes from "./routes/emailSubscriptionRoutes.js";
import reviewRoutes from "./routes/reviewRoute.js";
import adminRoutes from "./routes/adminRoutes.js";
import employeeRoutes from "./routes/employeeRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import paymentRoutes from './routes/paymentRoutes.js';
import mentorshipRoutes from './routes/mentorshipRoutes.js';
import chatbotRoutes from './routes/chatbotRoutes.js';

dotenv.config();

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "combined.log" }),
  ],
});

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  );
}

const app = express();

// Security middleware
app.use(helmet());
// CORS: allow production FRONTEND_URL and common local dev origins (Vite defaults)
const devLocalOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:3000",
];

// Build a set of allowed origin strings (full origin) and a set of allowed hostnames.
// This allows requests from either the exact origin (e.g. https://www.nextute.com)
// or from any origin whose hostname matches an allowed hostname (covers trailing
// differences like presence/absence of www).
const allowedOrigins = new Set([
  process.env.FRONTEND_URL,
  "https://nextute.com",
  "https://www.nextute.com",
  ...devLocalOrigins,
].filter(Boolean));

const allowedHostnames = new Set();
for (const o of allowedOrigins) {
  try {
    const hn = new URL(o).hostname;
    if (hn) allowedHostnames.add(hn);
  } catch (e) {
    // not a full URL (e.g., someone added a hostname directly) - add as-is
    if (typeof o === "string") allowedHostnames.add(o);
  }
}

// Always add canonical hostnames for production domain variants
allowedHostnames.add("nextute.com");
allowedHostnames.add("www.nextute.com");

app.use(
  cors({
    origin: (origin, callback) => {
      // allow requests with no origin (e.g., curl, server-to-server)
      if (!origin) return callback(null, true);

      // Normalize origin and check hostname first (covers www vs non-www)
      try {
        const hostname = new URL(origin).hostname;
        if (allowedHostnames.has(hostname)) return callback(null, true);
      } catch (e) {
        // fall back to checking the raw origin string
      }

      if (allowedOrigins.has(origin)) return callback(null, true);
      return callback(new Error("CORS policy: Origin not allowed"), false);
    },
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());

// Request logging
app.use((req, res, next) => {
  logger.info({
    method: req.method,
    url: req.url,
    ip: req.ip,
    timestamp: new Date().toISOString(),
  });
  next();
});

// Routes
app.get("/test", (req, res) => {
  res.status(200).json({ status: true, message: "Server is running!" });
});

app.use("/api/students", studentAuthRoutes);
app.use("/api/institutes", instituteAuthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/subscribe", emailSubscriptionRoutes);
app.use("/api/feedback", reviewRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/jobs/", jobRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/mentorship', mentorshipRoutes);
app.use('/api/chat', chatbotRoutes);

// Debug routes (only in development)
if (process.env.NODE_ENV !== 'production') {
  const debugRoutes = await import('./routes/debugRoutes.js');
  app.use('/api/debug', debugRoutes.default);
}

// 404 handler
app.use((req, res) => {
  return handleError(res, 404, "Endpoint not found", "NOT_FOUND");
});

// Error handler
app.use((err, req, res, next) => {
  logger.error("Server error:", {
    message: err.message,
    stack: err.stack,
    method: req.method,
    url: req.url,
  });
  return handleError(res, 500, "Internal Server Error", "SERVER_ERROR");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
