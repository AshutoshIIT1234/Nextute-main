import express from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

// Debug endpoint to check authentication status
router.get("/auth-status", (req, res) => {
  const cookieToken = req.cookies.authToken;
  const headerToken = req.headers.authorization?.split(" ")[1];
  
  const response = {
    hasCookieToken: !!cookieToken,
    hasHeaderToken: !!headerToken,
    cookies: Object.keys(req.cookies),
    headers: {
      authorization: req.headers.authorization ? "Present" : "Missing",
      origin: req.headers.origin,
    },
  };

  // Try to decode token if present
  const token = cookieToken || headerToken;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.TOKEN_KEY);
      response.tokenValid = true;
      response.tokenData = {
        id: decoded.id,
        type: decoded.type,
        exp: new Date(decoded.exp * 1000).toISOString(),
      };
    } catch (error) {
      response.tokenValid = false;
      response.tokenError = error.message;
    }
  }

  res.json(response);
});

export default router;
