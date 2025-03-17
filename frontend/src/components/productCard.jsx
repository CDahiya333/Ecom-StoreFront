import React from "react";
import { Link } from "react-router-dom";
// eslint-disable-next-line
import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import toast from "react-hot-toast";
import useCartStore from "../Stores/useCartStore.js";
import useUserStore from "../Stores/useUserStore.js";

const cardVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  hover: { scale: 1.04, transition: { duration: 0.3 } },
};

const ProductCard = ({ product }) => {
  const { user } = useUserStore();
  const { addToCart } = useCartStore();
  const handleAddToCart = () => {
    if (!user) {
      toast.error("Please login to add products to Cart", { id: "login" });
      return;
    } else {
      addToCart(product);
    }
  };

  return (
    <motion.div
      key={product._id}
      variants={cardVariants}
      whileHover="hover"
      className="bg-white rounded-xl shadow-xl overflow-hidden border border-transparent hover:border-amber-200 body-font flex flex-col"
    >
      <Link to={`/product/${product._id}`} className="block flex-1">
        <div className="relative h-64">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-amber-900 via-transparent to-transparent opacity-40"></div>
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="text-2xl font-semibold text-white drop-shadow-lg">
              {product.name}
            </h3>
            <p className="text-white font-medium">${product.price}</p>
          </div>
        </div>
      </Link>
      {/* Add to Cart Button */}
      <div className="p-4 border-t flex justify-center border-amber-200">
        <motion.button
          onClick={handleAddToCart}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-1/2 flex justify-center items-center py-2 px-4 rounded-md bg-amber-800 text-white hover:bg-amber-700 transition-colors duration-300"
        >
          <ShoppingCart size={18} className="mr-2" />
          Add to Cart
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ProductCard;
