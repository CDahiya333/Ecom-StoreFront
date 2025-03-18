import { useEffect, useState } from "react";
import { ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react";
import useCartStore from "../Stores/useCartStore.js";

const FeaturedProducts = ({ featuredProducts }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(4);
  const { addToCart } = useCartStore();

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
        <button
          onClick={prevSlide}
          className="p-2 mx-2 rounded-full bg-amber-300 hover:bg-amber-400 transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}
      {isNextAvailable && (
        <button
          onClick={nextSlide}
          className="p-2 mx-2 rounded-full bg-amber-300 hover:bg-amber-400 transition-colors"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}
    </div>
  );

  return (
    <div className="relative">
      {/* Title + Top Navigation Buttons */}
      <div className="flex flex-col items-center mb-6">
        <h3 className="text-2xl font-bold heading-font -mt-5 text-amber-900 mb-4">
          Trending Products
        </h3>
        {(isPrevAvailable || isNextAvailable) && <NavigationButtons />}
      </div>

      {/* Products Wrapper using Flex */}
      <div className="flex flex-wrap gap-6 justify-center ">
        {visibleProducts.map((product) => (
          <div
            key={product._id}
            className="bg-white rounded-lg shadow-lg overflow-hidden border border-transparent hover:border-amber-200 transition-colors w-72"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4 flex flex-col">
              <h4 className="text-lg font-semibold text-gray-900 mb-1">
                {product.name}
              </h4>
              <p className="text-gray-700 text-sm mb-2">
                {product.description}
              </p>
              <p className="text-gray-900 font-bold mb-3 text-2xl">
                ${product.price}
              </p>
              <button
                onClick={() => addToCart(product)}
                className="mx-auto flex items-center gap-2 bg-amber-400 hover:bg-amber-500 text-white font-semibold py-2 px-4 rounded transition-colors"
              >
                <ShoppingCart className="w-5 h-5" />
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Navigation Buttons */}
      {(isPrevAvailable || isNextAvailable) && <NavigationButtons />}
    </div>
  );
};

export default FeaturedProducts;
