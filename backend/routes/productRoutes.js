import express from "express";
import protectRoute from "../middleware/protectRoute.js";
import adminRoute from "../middleware/adminRoute.js";
import { getAllProducts } from "../controllers/productController.js";

const router = express.Router();


router.get("/", protectRoute, adminRoute, getAllProducts);
export default router;