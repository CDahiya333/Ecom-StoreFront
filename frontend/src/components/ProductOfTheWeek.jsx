import React, { useState } from "react";
// eslint-disable-next-line
import { motion, useAnimation } from "framer-motion";
import { ShoppingCart, Heart, Bookmark } from "lucide-react";
// import useCartStore from "../Stores/useCartStore.js";

const ProductOfTheWeek = ({ product }) => {
  //   const { addToCart } = useCartStore();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const cartControls = useAnimation();
  if (!product) return null;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 -mt-10 mb-12">
      {/* Heading */}
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-6xl  lg:text-6xl script-heading-regular text-center mb-12 mt-12 text-black"
      >
        <span className="script-heading  ">Editor's</span> Pick
      </motion.h2>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 hover:border-amber-200 h-[1000px] md:h-[750px] lg:h-[750px]"
      >
        <div className="flex h-[1000px] flex-col lg:flex-row md:h-[830px] lg:h-[750px]">
          {/* Image Section - Left Half */}
          <div className="w-full lg:w-1/2 sm:w-full h-[800px] md:h-[750px] bg-gray-50 relative overflow-hidden">
            <motion.img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
              initial={{ scale: 1 }}
              whileHover={{ scale: 1.04 }}
              transition={{ duration: 0.1, ease: "easeInOut" }}
            />
            {/* Featured Badge */}
            <div className=" absolute top-5 left-5 z-10 text-amber-800 font-bold hover:scale-105 ease-in-out duration-300 opacity-95">
              <motion.div
                initial={{ rotate: -15, scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                className="bg-amber-100 text-amber-800 px-3 py-1.5 rounded-full font-medium text-xs "
              >
                <span className="text-amber-800 text-xs ">⭐️</span>
                <span className="text-xs">Product of the Week</span>
              </motion.div>
            </div>
          </div>

          {/* Content Section - Right Half */}
          <div className="h-[850px] lg:w-1/2 p-6 sm:p-8 lg:p-12 flex flex-col justify-between relative">
            <div>
              <motion.h3
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4"
              >
                {product.name}
              </motion.h3>
              {/* Divider Section */}
              <motion.div
                className="w-full h-1 bg-amber-300 mb-6 justify-center mx-auto"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.5 }}
              />
              {/* Description Section */}
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                <strong className="text-black text-xl">
                  ✨ Experience Pure Elegance in a Jar
                </strong>
                <br />
                A Premium collection of 3 artisanal soy candles, each
                hand-poured to capture the essence of serenity, sophistication,
                and sensory delight.
                <br />
                <br />
                Featuring <strong>Enticing aromas</strong> of mogra, jasmine,
                and rose, every detail whispers elegance. These candles don't
                just smell nice — they <em>tell a story</em>, soothe the soul,
                and elevate the everyday.
                <br />
                <br />
                <strong className="text-black text-xl">
                  Your space deserves this.
                </strong>{" "}
                ✨<br />
                Don't just light a candle — <em>ignite elegance.</em>
              </p>

              <div className="flex items-center mb-8 mt-12 relative bottom-8">
                <span className="text-2xl sm:text-2xl font-bold text-gray-400 line-through mt-2">
                  ${product.price}
                </span>
                <br />
                <span className="text-3xl sm:text-4xl font-bold text-gray-900">
                  189.99
                </span>
                <span className="ml-4 text-lg text-green-600 font-semibold">
                  Expires in 24 hours
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-4 relative bottom-14 mt-12 md:bottom-24 -pb-12">
              {/* Wishlist Button */}
              <button
                onClick={() => setIsWishlisted(!isWishlisted)}
                className={`p-4 rounded-full shadow-md transition-transform transform hover:scale-110 ${
                  isWishlisted
                    ? "bg-blue-500 text-white"
                    : "bg-white text-blue-500"
                }`}
                aria-label="Add to Wishlist"
              >
                <Bookmark size={24} />
              </button>

              {/* Favorite Button */}
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className={`p-4 rounded-full shadow-md transition-transform transform hover:scale-110 ${
                  isFavorite ? "bg-red-500 text-white" : "bg-white text-red-500"
                }`}
                aria-label="Add to Favorites"
              >
                <Heart size={24} />
              </button>

              {/* Cart Button */}
              <motion.div
                className="bg-amber-400 rounded-full pr-400"
                animate={cartControls}
              >
                <motion.button
                  onClick={() => {
                    cartControls.start({
                      x: [0, 500, 0],
                      transition: {
                        duration: 1.6,
                        times: [0, 0.5, 1],
                        ease: "easeInOut",
                      },
                    });
                  }}
                  className="p-4 bg-amber-400 text-white rounded-full shadow-md transition-colors hover:bg-amber-500 relative"
                  aria-label="Add to Cart"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ShoppingCart size={24} />
                </motion.button>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProductOfTheWeek;
