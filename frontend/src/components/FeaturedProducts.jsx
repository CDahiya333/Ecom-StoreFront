import { useEffect, useState } from "react";
import {
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
  Heart,
  Bookmark,
} from "lucide-react";
import useCartStore from "../Stores/useCartStore.js";
// eslint-disable-next-line
import { motion, AnimatePresence } from "framer-motion";

const FeaturedProducts = ({ featuredProducts }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(4);
  const { addToCart } = useCartStore();
  const [favorites, setFavorites] = useState({});
  const [wishlisted, setWishlisted] = useState({});

  // Track which product is being animated for each animation type
  const [animatingHeartId, setAnimatingHeartId] = useState(null);
  const [animatingBookmarkId, setAnimatingBookmarkId] = useState(null);
  const [animatingCartId, setAnimatingCartId] = useState(null);

  // Animation variants
  const heartVariants = {
    initial: { scale: 1 },
    animate: {
      scale: [1, 1.4, 1],
      transition: {
        duration: 0.4,
        times: [0, 0.5, 1],
        ease: "easeInOut",
      },
    },
  };

  const bookmarkVariants = {
    initial: { scale: 1, y: 0 },
    animate: {
      y: [0, -10, 0],
      scale: [1, 1.2, 1],
      transition: {
        duration: 0.5,
        times: [0, 0.5, 1],
        ease: "easeInOut",
      },
    },
  };

  const cartVariants = {
    initial: { x: 0 },
    animate: {
      x: [0, 40, 0],
      transition: {
        duration: 1,
        times: [0, 0.5, 1],
        ease: "easeInOut",
      },
    },
  };

  // Reset animation states after animation completes
  useEffect(() => {
    if (animatingHeartId) {
      const timer = setTimeout(() => {
        setAnimatingHeartId(null);
      }, 400); // Match the duration of the heart animation
      return () => clearTimeout(timer);
    }
  }, [animatingHeartId]);

  useEffect(() => {
    if (animatingBookmarkId) {
      const timer = setTimeout(() => {
        setAnimatingBookmarkId(null);
      }, 500); // Match the duration of the bookmark animation
      return () => clearTimeout(timer);
    }
  }, [animatingBookmarkId]);

  useEffect(() => {
    if (animatingCartId) {
      const timer = setTimeout(() => {
        setAnimatingCartId(null);
      }, 1000); // Match the duration of the cart animation
      return () => clearTimeout(timer);
    }
  }, [animatingCartId]);

  const toggleFavorite = (productId) => {
    setFavorites((prev) => ({
      ...prev,
      [productId]: !prev[productId],
    }));

    // Set which product's heart should animate
    setAnimatingHeartId(productId);
  };

  const toggleWishlist = (productId) => {
    setWishlisted((prev) => ({
      ...prev,
      [productId]: !prev[productId],
    }));

    // Set which product's bookmark should animate
    setAnimatingBookmarkId(productId);
  };

  const handleAddToCart = (product) => {
    addToCart(product);

    // Set which product's cart should animate
    setAnimatingCartId(product._id);
  };

  // Update items per page on window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setItemsPerPage(1);
      } else if (window.innerWidth < 1024) {
        setItemsPerPage(2);
      } else if (window.innerWidth < 1280) {
        setItemsPerPage(3);
      } else {
        setItemsPerPage(4);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Carousel navigation functions
  const nextSlide = () => {
    setCurrentIndex((prevIndex) => prevIndex + itemsPerPage);
  };
  const prevSlide = () => {
    setCurrentIndex((prevIndex) => prevIndex - itemsPerPage);
  };

  // Determine if there are previous or next pages available
  const isPrevAvailable = currentIndex > 0;
  const isNextAvailable = currentIndex < featuredProducts.length - itemsPerPage;

  // Slice the array to show only the current "page" of products
  const visibleProducts = featuredProducts.slice(
    currentIndex,
    currentIndex + itemsPerPage
  );

  // Navigation buttons component (can be used both above and below)
  const NavigationButtons = () => (
    <div className="flex justify-center items-center mt-4">
      {isPrevAvailable && (
        <motion.button
          onClick={prevSlide}
          className="p-2 mx-2 rounded-full bg-amber-300 hover:bg-amber-400 transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <ChevronLeft className="w-6 h-6" />
        </motion.button>
      )}
      {isNextAvailable && (
        <motion.button
          onClick={nextSlide}
          className="p-2 mx-2 rounded-full bg-amber-300 hover:bg-amber-400 transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <ChevronRight className="w-6 h-6" />
        </motion.button>
      )}
    </div>
  );

  return (
    <div className="relative px-4 sm:px-6 lg:px-8">
      {/* Title + Top Navigation Buttons */}
      <div className="flex flex-col items-center mb-6">
        <motion.h3
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xl sm:text-2xl lg:text-3xl font-bold heading-font -mt-2 text-amber-900 mb-4"
        >
          Best Sellers
        </motion.h3>
        {(isPrevAvailable || isNextAvailable) && <NavigationButtons />}
      </div>

      {/* Products Wrapper using Flex */}
      <AnimatePresence mode="wait">
        <motion.div
          className="flex flex-wrap justify-center w-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          key={currentIndex}
        >
          {visibleProducts.map((product, index) => (
            <motion.div
              key={product._id}
              className="w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 p-3 md:p-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: 1,
                y: 0,
                transition: { delay: index * 0.1 },
              }}
            >
              <motion.div
                className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:border-amber-200 transition-all h-[400px] relative w-full"
                whileHover={{
                  y: -5,
                  transition: { duration: 0.2 },
                }}
              >
                {/* Image Section */}
                <div className="product-image-section h-[280px] w-full bg-gray-50 overflow-hidden">
                  <motion.img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    initial={{ scale: 1 }}
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.1, ease: "easeInOut" }}
                  />
                </div>

                {/* Content Section */}
                <div className="p-4 sm:p-6 flex flex-col items-center h-[180px] relative">
                  {/* Title Section */}
                  <h4 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 text-center line-clamp-2">
                    {product.name}
                  </h4>

                  {/* Divider Section */}
                  <motion.div
                    className="w-4/5 h-0.5 bg-amber-300 mb-3"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.5 }}
                  />

                  {/* Description Section
                  <p className="text-sm text-gray-600 text-center line-clamp-2 mb-4">
                    {product.description}
                  </p> */}

                  {/* Price and Cart Section */}
                  <div className="relative bottom-0 left-0 right-0 flex items-center justify-between px-0 w-full">
                    <p className="text-gray-900 font-bold text-2xl relative bottom-2 left-2">
                      ${product.price}
                    </p>
                    <div className="flex gap-2 absolute -bottom-2 -right-2">
                      {/* Bookmark Button */}
                      <motion.button
                        onClick={() => toggleWishlist(product._id)}
                        className="relative -bottom-6 -right-8 sm:flex items-center justify-center bg-white hover:bg-gray-50 text-gray-600 p-2 rounded-full shadow-md size-14 sm:size-12 z-2"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <motion.div
                          variants={bookmarkVariants}
                          initial="initial"
                          animate={
                            animatingBookmarkId === product._id
                              ? "animate"
                              : "initial"
                          }
                        >
                          <Bookmark
                            className={`w-7 h-7 sm:w-6 sm:h-6 ml-1 ${
                              wishlisted[product._id]
                                ? "fill-blue-500 text-blue-500"
                                : "fill-none text-blue-400"
                            }`}
                          />
                        </motion.div>
                      </motion.button>

                      {/* Heart Button */}
                      <motion.button
                        onClick={() => toggleFavorite(product._id)}
                        className="relative -bottom-5 -right-7 flex items-center justify-center bg-white hover:bg-gray-50 text-gray-600 p-2 rounded-full shadow-md size-14 sm:size-12 z-1"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <motion.div
                          variants={heartVariants}
                          initial="initial"
                          animate={
                            animatingHeartId === product._id
                              ? "animate"
                              : "initial"
                          }
                        >
                          <Heart
                            className={`w-7 h-7 sm:w-6 sm:h-6 ${
                              favorites[product._id]
                                ? "fill-red-500 text-red-500"
                                : "fill-none text-red-400"
                            }`}
                          />
                        </motion.div>
                      </motion.button>

                      {/* Cart Button */}
                      <motion.button
                        onClick={() => handleAddToCart(product)}
                        className="relative -bottom-4 -right-5 flex items-center justify-center bg-amber-400 hover:bg-amber-400 fill-none text-white p-2.5 rounded-full transition-colors size-16 sm:size-16 z-3"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <motion.div
                          variants={cartVariants}
                          initial="initial"
                          animate={
                            animatingCartId === product._id
                              ? "animate"
                              : "initial"
                          }
                        >
                          <ShoppingCart className="w-8 h-8 sm:w-8 sm:h-8" />
                        </motion.div>
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Bottom Navigation Buttons */}
      {(isPrevAvailable || isNextAvailable) && <NavigationButtons />}
    </div>
  );
};

export default FeaturedProducts;
