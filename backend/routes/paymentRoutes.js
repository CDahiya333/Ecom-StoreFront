import express from "express";
import protectRoute from "../middleware/protectRoute.js";
import { createCheckoutSession, checkoutSuccess } from "../controllers/paymentController.js";
const router = express.Router();

// Payment Functions
router.post("/create-checkout-session",protectRoute, createCheckoutSession);
router.post("/checkout-success",protectRoute, checkoutSuccess);
export default router;