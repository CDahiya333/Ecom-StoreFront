import React from "react";
// eslint-disable-next-line
import { motion, AnimatePresence } from "framer-motion";
import { Trash, Star } from "lucide-react";
import useProductStore from "../Stores/useProductStore";

const tableVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { when: "beforeChildren", staggerChildren: 0.1 },
  },
};

const rowVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: { opacity: 1, y: 0 },
};

const ProductList = () => {
  const { deleteProduct, toggleFeaturedProduct, products } = useProductStore();

  const handleToggleFeatured = (productId) => {
    toggleFeaturedProduct(productId);
  };

  const handleDelete = (productId) => {
    deleteProduct(productId);
  };

  const truncate = (text, maxLength = 60) => {
    if (!text) return "";
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  return (
    <motion.div
      variants={tableVariants}
      initial="hidden"
      animate="visible"
      className="overflow-x-auto"
    >
      {products && products.length > 0 ? (
        <motion.table className="min-w-full text-left border-collapse">
          <thead>
            <tr className="bg-amber-800 text-white">
              <th className="py-3 px-4 font-semibold">Image</th>
              <th className="py-3 px-4 font-semibold">Name</th>
              <th className="py-3 px-4 font-semibold">Description</th>
              <th className="py-3 px-4 font-semibold">Price</th>
              <th className="py-3 px-4 font-semibold">Category</th>
              <th className="py-3 px-4 font-semibold text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {products.map((product) => (
                <motion.tr
                  key={product._id}
                  variants={rowVariants}
                  exit={{ opacity: 0, y: 10 }}
                  className="border-b border-amber-100 last:border-none"
                >
                  <td className="py-3 px-4">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded-md"
                      />
                    ) : (
                      "N/A"
                    )}
                  </td>
                  <td className="py-3 px-4">{product.name}</td>
                  <td className="py-3 px-4">{truncate(product.description)}</td>
                  <td className="py-3 px-4 text-xl">
                    {product.price ? `$${product.price}` : "N/A"}
                  </td>
                  <td className="py-3 px-4">
                    {product.category || "Uncategorized"}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="inline-flex space-x-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`px-3 py-2 rounded-md border transition-colors duration-200 ${
                          product.isFeatured
                            ? "border-amber-700 bg-amber-100 text-amber-800"
                            : "border-gray-400 text-gray-600 hover:bg-gray-100"
                        }`}
                        onClick={() => handleToggleFeatured(product._id)}
                        aria-label={
                          product.isFeatured
                            ? "Remove from Featured"
                            : "Add to Featured"
                        }
                        title={product.isFeatured ? "Featured" : "Not Featured"}
                      >
                        <Star
                          size={16}
                          fill={product.isFeatured ? "currentColor" : "none"}
                        />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-3 py-2 rounded-md border border-red-300 text-red-700 hover:bg-red-50 transition-colors duration-200"
                        onClick={() => handleDelete(product._id)}
                        aria-label="Delete Product"
                      >
                        <Trash size={16} />
                      </motion.button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </motion.table>
      ) : (
        <div className="text-center text-gray-600 py-8">
          No products found. Please create a product to get started.
        </div>
      )}
    </motion.div>
  );
};

export default ProductList;
