import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
// eslint-disable-next-line
import { motion } from "framer-motion";
import useProductStore from "../Stores/useProductStore.js";
import ProductCard from "../components/ProductCard.jsx";

const CategoryPage = () => {
  const { fetchProductByCategory, products, loading } = useProductStore();
  const { category } = useParams();

  useEffect(() => {
    fetchProductByCategory(category);
  }, [fetchProductByCategory, category]);

  // Capitalize first letter and replace dashes with spaces:
  const formattedCategory =
    category.charAt(0).toUpperCase() + category.slice(1).replace(/-/g, " ");

  return (
    <div className="min-h-screen bg-amber-50 text-gray-800 pt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-4xl sm:text-5xl font-bold text-center mb-8 heading-font text-amber-900"
        >
          {formattedCategory}
        </motion.h1>

        {loading ? (
          <p className="text-center text-gray-700">Loading products...</p>
        ) : products.length === 0 ? (
          <p className="text-center text-gray-700">
            No products found in this category.
          </p>
        ) : (
          <motion.div
            initial="initial"
            animate="animate"
            transition={{ staggerChildren: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
