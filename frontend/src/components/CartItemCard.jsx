import React from "react";
// eslint-disable-next-line
import { motion } from "framer-motion";
import { Trash, Plus, Minus } from "lucide-react";
import useCartStore from "../Stores/useCartStore";

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

const CartItemCard = ({ item }) => {
  const { removeFromCart, updateQuantity } = useCartStore();

  const handleQuantityChange = async (productId, newQuantity) => {
    console.log(`Changing quantity for ${productId} to ${newQuantity}`);
    if (newQuantity <= 0) {
      await removeFromCart(productId);
    } else {
      await updateQuantity(productId, newQuantity);
    }
  };

  return (
    <motion.div
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      exit={{ opacity: 0, y: 10 }}
      className="bg-white rounded-xl shadow p-4 flex items-center"
    >
      <img
        src={item.image}
        alt={item.name}
        className="w-30 h-30 object-cover rounded-md mr-4"
      />
      <div className="flex-1">
        <h3 className="text-xl font-semibold">{item.name}</h3>
        <p className="text-gray-600">
          ${(item.price * item.quantity).toFixed(2)}
        </p>
        <div className="mt-2 flex items-center space-x-2">
          <motion.button
            onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-1 bg-gray-200 rounded"
          >
            <Minus size={16} />
          </motion.button>
          <span>{item.quantity}</span>
          <motion.button
            onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-1 bg-gray-200 rounded"
          >
            <Plus size={16} />
          </motion.button>
        </div>
      </div>
      <motion.button
        onClick={() => removeFromCart(item._id)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="ml-4 p-2 bg-red-100 text-red-700 rounded-full hover:bg-red-200 transition-colors"
      >
        <Trash size={18} />
      </motion.button>
    </motion.div>
  );
};

export default CartItemCard;
