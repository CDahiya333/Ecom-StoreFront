import express from "express";
import { login, logout, signup, tokenRefresher,sendOtp, verifyOtp} from "../controllers/authController.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/refresh-token", tokenRefresher);
router.post("/sendotp", sendOtp);
router.post("/verifyotp", verifyOtp);
// router.get("/getProfile", getProfile);
export default router;
