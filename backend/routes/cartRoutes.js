import express from "express";
import { getCart, addToCart, deleteFromCart, updateQuantity} from "../controllers/cartController.js";
import protectRoute from "../middleware/protectRoute.js";

const router = express.Router();

router.get("/", protectRoute, getCart);
router.post("/", protectRoute, addToCart);
router.put("/:id", protectRoute, updateQuantity);
router.delete("/", protectRoute, deleteFromCart);

export default router;