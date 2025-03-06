import express from "express";
import { login, logout, signup, tokenRefresher, getProfile } from "../controllers/authController.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/refresh-token", tokenRefresher);
// router.get("/getProfile", getProfile);
export default router;
