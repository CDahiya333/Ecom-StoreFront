import React, { useEffect, useState } from "react";
// eslint-disable-next-line
import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import useCartStore from "../Stores/useCartStore.js";
import CartItemCard from "../components/CartItemCard.jsx";
import useUserStore from "../Stores/useUserStore.js";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import EmptyCartUI from "../components/EmptyCartUI.jsx";

const CartPage = () => {
  const {
    cart,
    getCartItems,
    total,
    subtotal,
    coupon,
    applyCoupon,
    removeCoupon,
    isCouponApplied,
    isLoading,
  } = useCartStore();

  const { user } = useUserStore();
  const [couponCode, setCouponCode] = useState("");
  const [couponFeedback, setCouponFeedback] = useState("");

  useEffect(() => {
    if (user) {
      // Force refresh cart when page loads
      getCartItems();
    }
  }, [getCartItems, user]);

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (couponCode.trim()) {
      applyCoupon(couponCode.trim())
        .then(() => {
          setCouponFeedback("Coupon applied successfully!");
        })
        .catch(() => {
          setCouponFeedback("Invalid coupon code.");
        });
    } else {
      setCouponFeedback("Please enter a coupon code.");
    }
  };

  const handleRemoveCoupon = () => {
    removeCoupon();
    setCouponCode("");
    setCouponFeedback("");
  };

  return (
    <div className="min-h-screen bg-amber-50 text-gray-800 pt-20 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-8">
        {/* Cart Items Section */}
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-6">Your Cart</h1>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner />
            </div>
          ) : cart.length === 0 ? (
            <EmptyCartUI />
          ) : (
            <div className="space-y-4">
              {cart.map((item) => (
                <CartItemCard key={item._id} item={item} />
              ))}
            </div>
          )}

          {/* Totals */}
          {cart.length > 0 && (
            <div className="mt-8 border-t pt-4">
              <p className="text-lg font-medium">
                Subtotal:{" "}
                <span className="font-bold">${subtotal.toFixed(2)}</span>
              </p>

              {coupon && (
                <p className="text-lg font-medium text-green-600">
                  Discount:{" "}
                  <span className="font-bold">
                    {coupon.discountPercentage}%
                  </span>
                  <button
                    onClick={handleRemoveCoupon}
                    className="ml-2 text-sm text-red-500 hover:text-red-700"
                  >
                    (Remove)
                  </button>
                </p>
              )}

              <p className="text-2xl font-bold">
                Total:{" "}
                <span className="text-amber-800">${total.toFixed(2)}</span>
              </p>
            </div>
          )}

          {/* Recommended Section */}
          {cart.length > 0 && <RecommendedProducts />}
        </div>

        {/* Coupon Code Interface */}
        {cart.length <= 0 ? (
          <div></div>
        ) : (
          <div className="w-full lg:w-1/3 bg-white rounded-xl shadow-xl p-6 h-fit">
            <h2 className="text-2xl font-bold mb-4">Apply Coupon</h2>
            <form onSubmit={handleApplyCoupon} className="space-y-4">
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="Enter coupon code"
                className="w-full px-4 py-2 rounded-md border border-gray-300 shadow-sm focus:border-amber-500 focus:ring focus:ring-amber-500"
                disabled={isCouponApplied}
              />
              <button
                type="submit"
                className={`w-full flex justify-center items-center py-2 px-4 rounded-md ${
                  isCouponApplied
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-amber-800 hover:bg-amber-700"
                } text-white transition-colors`}
                disabled={isCouponApplied}
              >
                {isCouponApplied ? "Coupon Applied" : "Apply Code"}
              </button>
            </form>
            {couponFeedback && (
              <p
                className={`mt-4 text-center font-medium ${
                  couponFeedback.includes("Invalid") ||
                  couponFeedback.includes("Please")
                    ? "text-red-600"
                    : "text-green-600"
                }`}
              >
                {couponFeedback}
              </p>
            )}

            {isCouponApplied && (
              <button
                onClick={handleRemoveCoupon}
                className="mt-4 w-full text-center text-sm text-amber-700 hover:text-amber-900"
              >
                Remove coupon and enter a different code
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
