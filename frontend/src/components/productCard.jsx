import React, { useState } from "react";
// import { Link } from "react-router-dom"; If I want to add indivual page for each product later
import { motion } from "framer-motion";
import { ShoppingCart, Heart, Bookmark } from "lucide-react";
import toast from "react-hot-toast";
import useCartStore from "../Stores/useCartStore.js";
import useUserStore from "../Stores/useUserStore.js";
import ActionButton from "./ActionButton";

const ProductCard = ({ product }) => {
  const { user } = useUserStore();
  const { addToCart } = useCartStore();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const handleAddToCart = () => {
    if (!user) {
      toast.error("Please login to add products to Cart", { id: "login" });
      return;
    }
    addToCart(product);
  };

  return (
// Product Card Container
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:border-amber-200 transition-all w-full sm:w-[280px] h-[500px] relative"
    >
      {/* <Link to={`/product/${product._id}`}> */}
        <motion.div 
          className="h-[280px] w-full bg-gray-50"
          whileHover={{ scale: 1.03 }}
          transition={{ duration: 0.3 }}
          whileTap={{ scale: 0.95 }}
          ease="easeInOut"

        >
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </motion.div>
      {/* </Link> */}
{/* Product Name */}
      <div className="p-4 sm:p-6 flex flex-col items-center h-[220px] relative">
        {/* <Link to={`/product/${product._id}`}> */}
          <h4 className="text-xl sm:text-xl font-semibold text-gray-900 mb-2 text-center line-clamp-3">
            {product.name}
          </h4>

          <motion.div 
            className="w-4/5 h-0.5 bg-amber-300 mb-3"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.5 }}
          />
{/* Description */}
          <p className="text-sm text-gray-600 text-center line-clamp-2 mb-4">
            {product.description}
          </p>
        {/* </Link> */}

{/* Price and Actions Section */}
        <div className="absolute bottom-0.5 left-0 right-0 flex items-center justify-between px-0 w-full">
          <p className="text-gray-900 font-bold text-2xl relative bottom-2 left-2">
            ${product.price}
          </p>
{/* Action Buttons */}
          <div className="flex gap-2 absolute -bottom-2 -right-2">
            <ActionButton
              Icon={Bookmark}
              onClick={() => setIsWishlisted(!isWishlisted)}
              isActive={isWishlisted}
              activeColor="blue"
              position="bookmark"
              animationType="bounce"
              hideOnMobile
            />

            <ActionButton
              Icon={Heart}
              onClick={() => setIsFavorite(!isFavorite)}
              isActive={isFavorite}
              activeColor="red"
              position="heart"
              animationType="scale"
            />

            <ActionButton
              Icon={ShoppingCart}
              onClick={handleAddToCart}
              size="large"
              position="cart"
              animationType="slide"
              className="bg-amber-400 text-white hover:bg-amber-400 text-amber-400"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
