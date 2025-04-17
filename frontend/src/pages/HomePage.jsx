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
    imageUrl:
      "https://res.cloudinary.com/ddxhvcrtu/image/upload/v1742309862/products/wokvydjxx8nbnoqdrv2q.webp",
  },
  {
    href: "/category/bedroom-furniture",
    name: "Bedroom Furniture",
    imageUrl:
      "https://res.cloudinary.com/ddxhvcrtu/image/upload/v1742231446/products/cr6dlosp7rpjaqizkrgd.jpg",
  },
  {
    href: "/category/dining-office-furniture",
    name: "Dining & Office Furniture",
    imageUrl:
      "https://res.cloudinary.com/ddxhvcrtu/image/upload/v1742311505/products/t0qkqpvu4q487e9npnqn.jpg",
  },
  {
    href: "/category/candles",
    name: "Candles",
    imageUrl:
      "https://res.cloudinary.com/ddxhvcrtu/image/upload/v1742309552/products/lfifsbuzxiwjehrlewcf.webp",
  },
  {
    href: "/category/decor-accessories",
    name: "Decor & Accessories",
    imageUrl:
      "https://res.cloudinary.com/ddxhvcrtu/image/upload/v1742310156/products/oim5kmbjhtnljtrmdag4.jpg",
  },
  {
    href: "/category/cutlery",
    name: "Cutlery & KitchenWae",
    imageUrl:
      "https://res.cloudinary.com/ddxhvcrtu/image/upload/v1742227568/products/boaz8fonyefw6ykp760d.jpg",
  },
];

// Hard-coded  Blog posts data will ad native blog support later
const blogPosts = [
  {
    id: 1,
    title: "The Art of Interior Styling",
    excerpt:
      "Discover how to transform your space with our expert interior styling tips and tricks.",
    image:
      "https://res.cloudinary.com/ddxhvcrtu/image/upload/v1742309862/products/o29eemecxq8p4tvye2zf.jpg",
    category: "Interior Design",
    date: "April 15, 2024",
  },
  {
    id: 2,
    title: "Sustainable Living: Eco-Friendly Furniture",
    excerpt:
      "Learn about sustainable materials and environmentally conscious furniture choices for your home.",
    image:
      "https://res.cloudinary.com/ddxhvcrtu/image/upload/v1742231446/products/p2b8f0mhmuxatncspoti.webp",
    category: "Sustainability",
    date: "April 12, 2024",
  },
  {
    id: 3,
    title: "Candlelight Magic: Setting the Mood",
    excerpt:
      "Create the perfect ambiance with our guide to using candles throughout your home.",
    image:
      "https://res.cloudinary.com/ddxhvcrtu/image/upload/v1742309552/products/lfifsbuzxiwjehrlewcf.webp",
    category: "Lifestyle",
    date: "April 10, 2024",
  },
];

// Hard-coded testimonials data
const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Interior Designer",
    image:
      "https://res.cloudinary.com/ddxhvcrtu/image/upload/v1744819165/products/wokvydjxx8nbnoqdrv2q.webp",
    quote:
      "The quality of furniture and decor pieces is exceptional. Each item tells a story of craftsmanship and attention to detail.",
    rating: 5,
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Home Stylist",
    image:
      "https://res.cloudinary.com/ddxhvcrtu/image/upload/v1742309552/products/lfifsbuzxiwjehrlewcf.webp",
    quote:
      "I've been consistently impressed by the unique selection and the outstanding customer service. A true gem for interior enthusiasts.",
    rating: 5,
  },
  {
    id: 3,
    name: "Emma Davis",
    role: "Architect",
    image:
      "https://res.cloudinary.com/ddxhvcrtu/image/upload/v1742311505/products/t0qkqpvu4q487e9npnqn.jpg",
    quote:
      "Their curated collection has transformed how I approach residential projects. The quality speaks for itself.",
    rating: 5,
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
    name: "Luxue Scented Candles Gift Set",
    description: "",
    price: "219.89",
    image:
      "https://res.cloudinary.com/ddxhvcrtu/image/upload/v1744817756/products/ma0wicasxw5tgjdz4hyy.png",
  };

  return (
    <div className="min-h-screen bg-amber-50 text-gray-800">
      {/* Category Section */}
      <section
        className="py-16 px-4 sm:px-6 lg:px-8 w-4/5 justify-center mx-auto"
        id="home"
      >
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-6xl mt-10 sm:text-4xl md:text-6xl md:mt-16 script-heading-regular text-black text-center mb-12 pt-4  heading-font"
        >
          <span className="script-heading ">Luxurious</span> Offerings
          <motion.h3
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xl sm:text-2xl lg:text-4xl font-bold body-font mt-1 text-amber-900 mb-4"
          >
            Categories
          </motion.h3>
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
                <div className="relative h-64 overflow-hidden">
                  <motion.img
                    src={category.imageUrl}
                    alt={category.name}
                    className="w-full h-full object-cover"
                    initial={{ scale: 1 }}
                    whileHover={{ scale: 1.08 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
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
      <section className="py-2 px-4 sm:px-6 lg:px-8 " id="featured">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="text-center"
        >
          <h2 className="text-5xl sm:text-6xl  font-bold mb-4 script-heading-regular">
            <span className="script-heading font-size-8xl"> Trending</span>{" "}
            Selections
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
      <section className="py-16 px-4 sm:px-6 lg:px-8 -mt-26">
        <ProductOfTheWeek product={productOfTheWeek} />
      </section>

      {/* Blog Section */}
      <section className="-mt-12 px-4 sm:px-6 lg:px-8" id="blog">
        {/* Blog Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl sm:text-5xl script-heading-regular mb-4">
            Latest from our <span className="script-heading">Blog</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover inspiration, tips, and stories about modern living and
            interior design
          </p>
        </motion.div>

        <motion.div
          initial="initial"
          animate="animate"
          transition={{ staggerChildren: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {/* eslint-disable-next-line */}
          {blogPosts.map((post, index) => (
            <motion.article
              key={post.id}
              variants={cardVariants}
              whileHover={{ y: 0 }}
              className="bg-white rounded-xl shadow-xl overflow-hidden border border-transparent hover:border-amber-200 transition-all flex flex-col h-full"
            >
              <div className="h-48 overflow-hidden">
                <motion.img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-500"
                  initial={{ scale: 1 }}
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.1, ease: "easeInOut" }}
                />
              </div>

              {/* Blog Post Cards */}
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center mb-4">
                  <span className="text-sm text-amber-600 font-semibold">
                    {post.category}
                  </span>
                  <span className="mx-2 text-gray-300">•</span>
                  <span className="text-sm text-gray-500">{post.date}</span>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {post.title}
                </h3>

                <p className="text-gray-600 mb-4 line-clamp-2 flex-grow">
                  {post.excerpt}
                </p>
                {/* Read More Button Animation */}
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  className="text-amber-600 font-semibold hover:text-amber-700 transition-colors flex items-center mt-auto group"
                >
                  Read More
                  <svg
                    className="w-4 h-4 ml-2 transform transition-transform duration-300 ease-in-out group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </motion.button>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-amber-50 to-amber-100/30">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl sm:text-5xl script-heading-regular mb-4">
            What Our <span className="script-heading">Clients</span> Say
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover why our customers love our curated collection and service
          </p>
        </motion.div>

        <motion.div
          initial="initial"
          animate="animate"
          transition={{ staggerChildren: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto"
        >
          {/* eslint-disable-next-line */}
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              variants={cardVariants}
              whileHover={{ y: -10 }}
              className="bg-white rounded-xl shadow-xl p-6 border border-transparent hover:border-amber-200 transition-all relative"
            >
              {/* Quote Icon */}
              <div className="absolute -top-4 right-6">
                <motion.div
                  initial={{ rotate: -15, scale: 0 }}
                  animate={{ rotate: 0, scale: 1 }}
                  transition={{ delay: 0.5 }}
                  className="bg-amber-100 text-amber-800 p-3 rounded-full"
                >
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                </motion.div>
              </div>

              {/* Profile Image */}
              <div className="flex justify-center mb-4">
                <motion.div
                  className="w-20 h-20 rounded-full overflow-hidden border-2 border-amber-200"
                  whileHover={{ scale: 1.05 }}
                >
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              </div>

              {/* Content */}
              <div className="text-center">
                <p className="text-gray-600 mb-4 italic">
                  "{testimonial.quote}"
                </p>
                <h3 className="font-bold text-gray-900">{testimonial.name}</h3>
                <p className="text-amber-600 text-sm">{testimonial.role}</p>

                {/* Rating Stars */}
                <div className="flex justify-center items-center mt-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 * i }}
                      className="text-amber-400"
                    >
                      ⭐
                    </motion.span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Subscribe Section */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 bg-amber-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 hover:border-amber-200 flex flex-col lg:flex-row md:h-[500px]"
        >
          {/* Email Input Section - Left Half */}
          <div className="lg:w-1/2 p-6 sm:p-8 lg:p-12 flex flex-col justify-center ">
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              Subscribe to our Newsletter
            </h3>
            <p className="text-lg text-gray-600 mb-8 -mt-4">
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
          <div className="hidden md:block lg:w-1/2 h-[300px] sm:h-[400px] lg:h-[600px] bg-gray-50 relative overflow-hidden">
            <motion.img
              src="https://res.cloudinary.com/ddxhvcrtu/image/upload/v1744819165/products/wokvydjxx8nbnoqdrv2q.webp"
              alt="Newsletter"
              className="w-full h-full object-cover"
              initial={{ scale: 1 }}
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.1, ease: "easeInOut" }}
            />
          </div>
        </motion.div>
      </section>
      {/* Footer*/}
      <section className="mt-5">
        <Footer />
      </section>
    </div>
  );
};

export default HomePage;
