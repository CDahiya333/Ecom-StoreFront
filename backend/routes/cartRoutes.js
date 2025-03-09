import express from "express";
import { getCart, addToCart, deleteFromCart, updateQuantity} from "../controllers/cartController.js";
import protectRoute from "../middleware/protectRoute.js";

const router = express.Router();

router.get("/", protectRoute, getCart);
router.post("/", protectRoute, addToCart);
router.delete("/", protectRoute, deleteFromCart);
router.put("/:id", protectRoute, updateQuantity);

export default router;