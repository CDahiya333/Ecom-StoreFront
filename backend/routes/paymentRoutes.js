import express from "express";
const router = express.Router();

// Payment Functions
router.post("/create-checkout-session",checkout);
export default router;