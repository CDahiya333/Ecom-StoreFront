import React, { useState } from "react";
import { motion } from "framer-motion";
import { ShoppingCart, Heart, Bookmark } from "lucide-react";
import useCartStore from "../Stores/useCartStore.js";
import ActionButton from "./ActionButton";
import toast from "react-hot-toast";
import useUserStore from "../Stores/useUserStore.js";

const ProductOfTheWeek = ({ product }) => {
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

  if (!product) return null;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.h2 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl sm:text-4xl font-bold text-center mb-12 script-heading-regular text-amber-900"
      >
        Product of the Week
      </motion.h2>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 hover:border-amber-200"
      >
        <div className="flex flex-col lg:flex-row">
          {/* Image Section - Left Half */}
          <motion.div 
            className="lg:w-1/2 h-[300px] sm:h-[400px] lg:h-[600px] bg-gray-50"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </motion.div>

          {/* Content Section - Right Half */}
          <div className="lg:w-1/2 p-6 sm:p-8 lg:p-12 flex flex-col justify-between relative">
            <div>
              <motion.h3 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4"
              >
                {product.name}
              </motion.h3>

              <motion.div 
                className="w-1/3 h-1 bg-amber-300 mb-6"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.5 }}
              />

              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                {product.description}
              </p>

              <div className="flex items-center mb-8">
                <span className="text-3xl sm:text-4xl font-bold text-gray-900">
                  ${product.price}
                </span>
                <span className="ml-4 text-lg text-green-600 font-semibold">
                  Special Offer
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsWishlisted(!isWishlisted)}
                className={`p-4 rounded-full shadow-md transition-transform transform hover:scale-105 ${
                  isWishlisted ? "bg-blue-500 text-white" : "bg-white text-blue-500"
                }`}
                aria-label="Add to Wishlist"
              >
                <Bookmark size={24} />
              </button>

              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className={`p-4 rounded-full shadow-md transition-transform transform hover:scale-105 ${
                  isFavorite ? "bg-red-500 text-white" : "bg-white text-red-500"
                }`}
                aria-label="Add to Favorites"
              >
                <Heart size={24} />
              </button>

              <button
                onClick={handleAddToCart}
                className="p-4 bg-amber-400 text-white rounded-full shadow-md transition-transform transform hover:scale-105"
                aria-label="Add to Cart"
              >
                <ShoppingCart size={24} />
              </button>
            </div>

            {/* Featured Badge */}
            <div className="absolute top-6 right-6">
              <motion.div
                initial={{ rotate: -15, scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                className="bg-amber-100 text-amber-800 px-4 py-2 rounded-full font-semibold text-sm"
              >
                Featured Product
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProductOfTheWeek; 