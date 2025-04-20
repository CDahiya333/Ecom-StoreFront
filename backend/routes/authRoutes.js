import express from "express";
import {
  login,
  logout,
  signup,
  tokenRefresher,
  sendOtp,
  verifyOtp,
  resendOtp,
  getProfile,
} from "../controllers/authController.js";
import protectRoute from "../middleware/protectRoute.js";
// import { authRateLimiter, otpRateLimiter } from "../lib/rateLimiter.js";

const router = express.Router();
// Production Routes with Rate Limiters
// router.post("/signup",authRateLimiter, signup);
// router.post("/login",authRateLimiter, login);
// router.post("/sendotp", otpRateLimiter, sendOtp);
// router.post("/verifyotp", otpRateLimiter, verifyOtp);
// router.post("/resend-otp",  otpRateLimiter, resendOtp);

// Development Routes
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/refresh-token", tokenRefresher);
router.post("/sendotp", sendOtp);
router.post("/verifyotp", verifyOtp);
router.post("/resend-otp", resendOtp);
router.get("/getProfile", protectRoute, getProfile);

export default router;
