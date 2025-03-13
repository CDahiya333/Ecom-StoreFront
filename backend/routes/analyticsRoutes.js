import express from "express";
import protectRoute from "../middleware/protectRoute.js";
import adminRoute from "../middleware/adminRoute.js";
import { getAnalytics } from "../controllers/analyticsController.js";

const router = express.Router();

router.get("/", protectRoute, adminRoute, getAnalytics)

export default router;