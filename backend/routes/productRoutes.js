import express from "express";
import protectRoute from "../middleware/protectRoute.js";
import adminRoute from "../middleware/adminRoute.js";
import { getAllProducts , getFeaturedProducts, createProduct, deleteProduct, getRecommendedProducts, getProductsbyCategory, toggleFeaturedProducts} from "../controllers/productController.js";

const router = express.Router();


router.get("/", protectRoute, adminRoute, getAllProducts);
router.get("/featured", getFeaturedProducts);
router.get("/category/:category", getProductsbyCategory);
router.get("/recommended", getRecommendedProducts);
router.post("/",protectRoute,adminRoute, createProduct);
router.patch("/:id",protectRoute,adminRoute, toggleFeaturedProducts);
router.post("/:id",protectRoute,adminRoute, deleteProduct);

export default router;