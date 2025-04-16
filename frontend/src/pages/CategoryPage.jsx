import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
// eslint-disable-next-line
import { motion } from "framer-motion";
import useProductStore from "../Stores/useProductStore.js";
import ProductCard from "../components/productCard.jsx";
import { Delete, Utensils } from "lucide-react";

const materialsList = ["Cotton", "Leather", "Wood", "Silk", "Metal"];

const containerVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { staggerChildren: 0.1, duration: 0.4 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: "easeInOut", stiffness: 100 },
  },
};

const CategoryPage = () => {
  const { fetchProductByCategory, products, loading } = useProductStore();
  const { category } = useParams();

  const [priceFilter, setPriceFilter] = useState("");
  const [selectedMaterials, setSelectedMaterials] = useState([]);

  useEffect(() => {
    fetchProductByCategory(category);
  }, [fetchProductByCategory, category]);

  const formattedCategory =
    category.charAt(0).toUpperCase() + category.slice(1).replace(/-/g, " ");

  const toggleMaterial = (material) => {
    setSelectedMaterials((prev) =>
      prev.includes(material)
        ? prev.filter((m) => m !== material)
        : [...prev, material]
    );
  };

  const resetFilters = () => {
    setPriceFilter("");
    setSelectedMaterials([]);
  };

  const filteredProducts = products
    .filter((product) =>
      selectedMaterials.length > 0
        ? selectedMaterials.includes(product.material)
        : true
    )
    .sort((a, b) => {
      if (priceFilter === "low-to-high") return a.price - b.price;
      if (priceFilter === "high-to-low") return b.price - a.price;
      return 0;
    });

  return (
    <div className="min-h-screen bg-amber-50 text-gray-800 pt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Category Heading */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl mt-10 sm:text-5xl flex justify-center items-center sm:mt-18 md:mt-18 lg:mt-4 font-bold text-center mb-8 script-heading-regular text-amber-900"
        >
          <div>{formattedCategory}</div>
          <div>
            {/* <Utensils className="w-12 h-12 text-amber-900 ml-2" /> */}
          </div>
        </motion.h1>

        {/* Animated Filter Section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-white w-full rounded-sm md:rounded-full shadow-lg p-6 mb-10 flex flex-col items-center md:flex-row md:justify-center md:items-center gap-4"
        >
          {/* Price Filter + Clear */}
          <motion.div
            variants={itemVariants}
            className="flex items-center gap-2"
          >
            <select
              value={priceFilter}
              onChange={(e) => setPriceFilter(e.target.value)}
              className="border border-gray-300 rounded-md px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-400"
            >
              <option value="low-to-high">Low to High</option>
              <option value="high-to-low">High to Low</option>
            </select>
            {priceFilter && (
              <button
                onClick={() => setPriceFilter("")}
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
                aria-label="Clear price filter"
              >
                {/* &times; */}
              </button>
            )}
          </motion.div>

          {/* Material Filter Pills with Clear Cross */}
          <motion.div variants={itemVariants} className="flex flex-wrap gap-3">
            {materialsList.map((material) => {
              const isSelected = selectedMaterials.includes(material);
              return (
                <motion.button
                  key={material}
                  onClick={() => toggleMaterial(material)}
                  variants={itemVariants}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex items-center px-4 py-1 rounded-full border transition-colors duration-200 focus:outline-none ${
                    isSelected
                      ? "bg-amber-600 text-white border-amber-600"
                      : "bg-transparent text-gray-700 border-gray-300 hover:bg-amber-100"
                  }`}
                >
                  <span>{material}</span>
                  {isSelected && (
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleMaterial(material);
                      }}
                      className="ml-2 text-white hover:text-gray-200 cursor-pointer text-2xl"
                      aria-label={`Remove ${material} filter`}
                    >
                      <Delete />
                    </span>
                  )}
                </motion.button>
              );
            })}
          </motion.div>

          {/* Reset All Filters */}
          <motion.button
            variants={itemVariants}
            onClick={resetFilters}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="ml-auto bg-amber-600 hover:bg-amber-700 text-white px-5 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-300"
          >
            Reset
          </motion.button>
        </motion.div>

        {/* Product Grid */}
        {loading ? (
          <p className="text-center text-gray-700">Loading products...</p>
        ) : filteredProducts.length === 0 ? (
          <p className="text-center text-gray-700">
            No products found. Try adjusting filters!
          </p>
        ) : (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            transition={{ staggerChildren: 0.15 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-10 gap-x-6"
          >
            {filteredProducts.map((product) => (
              <motion.div key={product._id} variants={itemVariants}>
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
