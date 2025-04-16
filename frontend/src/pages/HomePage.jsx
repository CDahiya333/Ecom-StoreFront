import React, { useEffect } from "react";
import { Link } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import "../index.css";
import useProductStore from "../Stores/useProductStore.js";
import FeaturedProducts from "../components/FeaturedProducts.jsx";
import Footer from "../components/Footer.jsx";
import ProductOfTheWeek from "../components/ProductOfTheWeek.jsx";

// Categories data from Cloudinary
const categories = [
  {
    href: "/category/living-room-furniture",
    name: "Living Room Furniture",
    imageUrl: "https://res.cloudinary.com/ddxhvcrtu/image/upload/v1742309862/products/o29eemecxq8p4tvye2zf.jpg",
  },
  {
    href: "/category/bedroom-furniture",
    name: "Bedroom Furniture",
    imageUrl: "https://res.cloudinary.com/ddxhvcrtu/image/upload/v1742231446/products/p2b8f0mhmuxatncspoti.webp",
  },
  {
    href: "/category/dining-office-furniture",
    name: "Dining & Office Furniture",
    imageUrl: "https://res.cloudinary.com/ddxhvcrtu/image/upload/v1742311505/products/t0qkqpvu4q487e9npnqn.jpg",
  },
  {
    href: "/category/candles",
    name: "Candles",
    imageUrl: "https://res.cloudinary.com/ddxhvcrtu/image/upload/v1742309552/products/lfifsbuzxiwjehrlewcf.webp",
  },
  {
    href: "/category/decor-accessories",
    name: "Decor & Accessories",
    imageUrl: "https://res.cloudinary.com/ddxhvcrtu/image/upload/v1742310156/products/oim5kmbjhtnljtrmdag4.jpg",
  },
  {
    href: "/category/cutlery",
    name: "Cutlery & KitchenWae",
    imageUrl: "https://res.cloudinary.com/ddxhvcrtu/image/upload/v1742227568/products/yll2j6ocaflvnwu3cs7k.webp",
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

  // Hard-coded product for Product of the Week
  const productOfTheWeek = {
    name: "Elegant Sofa",
    description: "A luxurious and comfortable sofa that adds elegance to any living room.",
    price: "999.99",
    image: "https://res.cloudinary.com/ddxhvcrtu/image/upload/v1742309862/products/o29eemecxq8p4tvye2zf.jpg",
  };

  return (
    <div className="min-h-screen bg-amber-50 text-gray-800">
      {/* Category Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-4xl sm:text-5xl script-heading-regular text-black text-center mb-12 pt-4  heading-font"
        >
          Our<span className="script-heading ">Luxurious</span> collections
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
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <motion.h3 
                      whileHover={{ scale: 1 }}
                      transition={{ duration: 0.3 }}
                      className="text-2xl font-semibold text-white drop-shadow-lg"
                    >
                      {category.name}
                    </motion.h3>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="text-center"
        >
          <h2 className="text-6xl font-bold mb-4 script-heading-regular">
            Our <span className="script-heading font-size-8xl"> Weekly</span> Selections
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

      {/* Product of the Week Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <ProductOfTheWeek product={productOfTheWeek} />
      </section>

      {/* Blog Section */}

      {/* Testimonials Section */}
      {/* Subscribe Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 hover:border-amber-200 flex flex-col lg:flex-row"
        >
          {/* Email Input Section - Left Half */}
          <div className="lg:w-1/2 p-6 sm:p-8 lg:p-12 flex flex-col justify-center">
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              Subscribe to our Newsletter
            </h3>
            <p className="text-lg text-gray-600 mb-8">
              Stay updated with the latest news and exclusive offers.
            </p>
            <form className="flex flex-col sm:flex-row gap-4">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="flex-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <button 
                type="submit" 
                className="bg-amber-400 text-white px-6 py-3 rounded-md hover:bg-amber-500 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>

          {/* Image Section - Right Half */}
          <motion.div 
            className="lg:w-1/2 h-[300px] sm:h-[400px] lg:h-[600px] bg-gray-50"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <img
              src="https://res.cloudinary.com/ddxhvcrtu/image/upload/v1744819165/products/wokvydjxx8nbnoqdrv2q.webp"
              alt="Newsletter"
              className="w-full h-full object-cover"
            />
          </motion.div>
        </motion.div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default HomePage;
