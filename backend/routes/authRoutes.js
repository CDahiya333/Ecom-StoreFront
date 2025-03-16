import express from "express";
import { login, logout, signup, tokenRefresher,sendOtp, verifyOtp, resendOtp, getProfile} from "../controllers/authController.js";
import { authRateLimiter, otpRateLimiter } from "../lib/rateLimiter.js";
import protectRoute from "../middleware/protectRoute.js";

const router = express.Router();

// router.post("/signup",authRateLimiter, signup);
// router.post("/login",authRateLimiter, login);
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/refresh-token", tokenRefresher);
// router.post("/sendotp", otpRateLimiter, sendOtp);
// router.post("/verifyotp", otpRateLimiter, verifyOtp);
// router.post("/resend-otp",  otpRateLimiter, resendOtp);
router.post("/sendotp", sendOtp);
router.post("/verifyotp", verifyOtp);
router.post("/resend-otp", resendOtp);
router.get("/getProfile",protectRoute, getProfile);

export default router;
