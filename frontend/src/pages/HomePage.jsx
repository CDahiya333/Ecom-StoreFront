import React, { useEffect } from "react";
import { Link } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import "../index.css";
import useProductStore from "../Stores/useProductStore.js";
import FeaturedProducts from "../components/FeaturedProducts.jsx";

const categories = [
  {
    href: "/category/living-room-furniture",
    name: "Living Room Furniture",
    imageUrl: "/living.jpg",
  },
  {
    href: "/category/bedroom-furniture",
    name: "Bedroom Furniture",
    imageUrl: "/bedroom.jpg",
  },
  {
    href: "/category/dining-office-furniture",
    name: "Dining & Office Furniture",
    imageUrl: "/dining.jpg",
  },
  {
    href: "/category/candles",
    name: "Candles",
    imageUrl: "/candles.webp",
  },
  {
    href: "/category/decor-accessories",
    name: "Decor & Accessories",
    imageUrl: "/home-decor.webp",
  },
  {
    href: "/category/cutlery",
    name: "Cutlery & KitchenWae",
    imageUrl: "/Cutlery.png",
  },
];

const cardVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  hover: { scale: 1.04, transition: { duration: 0.3 } },
};

const HomePage = () => {
  const { fetchFeaturedProducts, products, loading } = useProductStore();

  useEffect(() => {
    fetchFeaturedProducts();
  }, [fetchFeaturedProducts]);

  // Add this to debug
  useEffect(() => {
    console.log("Products in HomePage:", products);
    console.log("Loading state:", loading);
  }, [products, loading]);

  return (
    <div className="min-h-screen bg-amber-50 text-gray-800">
      {/* Category Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-4xl sm:text-5xl font-bold text-center mb-12 pt-4 text-amber-900  heading-font"
        >
          Discover our <span className="script-heading">Exclusive</span>{" "}
          collections
        </motion.h2>
        <motion.div
          initial="initial"
          animate="animate"
          transition={{ staggerChildren: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12"
        >
          {categories.map((category, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover="hover"
              className="bg-white rounded-xl shadow-xl overflow-hidden border border-transparent hover:border-amber-200 body-font"
            >
              <Link to={category.href} className="block">
                <div className="relative h-64">
                  <img
                    src={category.imageUrl}
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-amber-900 via-transparent to-transparent opacity-40"></div>
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="absolute bottom-0 left-0 right-0 p-4"
                  >
                    <h3 className="text-2xl font-semibold text-white drop-shadow-lg">
                      {category.name}
                    </h3>
                  </motion.div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Placeholder for Additional Sections */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold mb-4 heading-font">
            Our <span className="script-heading font-size-[50px]">Luxurious</span> Selections
          </h2>
          {!loading && products && products.length > 0 ? (
            <FeaturedProducts featuredProducts={products} />
          ) : (
            <p className="text-lg text-gray-700 body-font">
              {loading
                ? "Loading products..."
                : "Stay tuned for more exclusive designs and curated collections."}
            </p>
          )}
        </motion.div>
      </section>
    </div>
  );
};

export default HomePage;
