import express from "express";
import { login, logout, signup, tokenRefresher,sendOtp, verifyOtp, resendOtp} from "../controllers/authController.js";
import { authRateLimiter, otpRateLimiter } from "../lib/rateLimiter.js";

const router = express.Router();

router.post("/signup",authRateLimiter, signup);
router.post("/login",authRateLimiter, login);
router.post("/logout", logout);
router.post("/refresh-token", tokenRefresher);
router.post("/sendotp", otpRateLimiter, sendOtp);
router.post("/verifyotp", otpRateLimiter, verifyOtp);
router.post("/resend-otp",  otpRateLimiter, resendOtp);
// router.get("/getProfile", getProfile);
export default router;
