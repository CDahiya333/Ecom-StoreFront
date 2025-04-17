import React, { useEffect } from "react";
import useCartStore from "../Stores/useCartStore";
import { useState } from "react";
import { ExternalLink, Trash } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import axios from "../lib/axios";

const stripePromise = loadStripe(
  "pk_test_51REBzFHPalGUMZWuoeNfoCl2Pgh3aa6xIS6g0jqfBlKBoqG2lHaRAbTcw9v0v8F7NkwAG8tp1Z90QtyBucUhTi3q00CMJtK7ZB"
);
const CheckOut = () => {
  const {
    cart,
    total,
    subtotal,
    coupon,
    applyCoupon,
    removeCoupon,
    getMyCoupon,
    isCouponApplied,
  } = useCartStore();

  useEffect(() => {
    getMyCoupon();
  }, [getMyCoupon]);

  const savings = subtotal - total;
  const formattedSubtotal = subtotal.toFixed(2);
  const formattedTotal = total.toFixed(2);
  const formattedSavings = savings.toFixed(2);

  const [couponCode, setCouponCode] = useState("");
  const [couponFeedback, setCouponFeedback] = useState("");
  const navigate = useNavigate();
  // const coupon = true;

  useEffect(() => {
    if (coupon) setCouponCode(coupon.code);
  }, [coupon]);

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!couponCode) return;
    applyCoupon(setCouponCode);
  };
  const handleRemoveCoupon = () => {
    removeCoupon();
    setCouponCode("");
    setCouponFeedback("");
  };
  const handleStripePayment = async () => {
    const stripe = await stripePromise;
    const res = await axios.post("/payments/create-checkout-session", {
      products: cart,
      couponCode: coupon ? coupon.code : null,
    });
    const session = res.data;
    const result = await stripe.redirectToCheckout({
      sessionId: session.id,
    });

    if (result.error) {
      console.error("Error:", result.error);
    }
  };
  return (
    <div>
      {/* Coupon Code Interface */}
      <div className="w-full  bg-white rounded-xl shadow-xl p-6 h-fit py-2.5 my-15 flex flex-col flex-wrap">
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
            {coupon ? "Coupon Applied" : "Apply Code"}
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
            Remove Coupon
          </button>
        )}
        {/* Savings : Delete Trash Icon */}
        {coupon && (
          <div className="text-md font-medium flex justify-evenly ">
            <p className="text-green-600 mt-2">
              {" "}
              You saved: <span className="font-bold">${formattedSavings}</span>
            </p>
            <Trash
              onClick={handleRemoveCoupon}
              className="ml-6 items-center mt-2 text-red-600"
              size={20}
            />
          </div>
        )}
        {/* Available Coupons */}
        {coupon && (
          <div className="mt-4">
            <h3 className="text-lg font-medium text-black-300">
              {" "}
              Available Coupons
            </h3>
            <p className="mt-2 text-sm text-gray-400 flex items-center hover:text-gray-500 ">
              {coupon.code}:{" "}
              <span className="ml-2">{coupon.discountPercentage}% OFF</span>
              {/* FREE4U:  <span className="ml-2">15% OFF</span> */}
            </p>
          </div>
        )}
      </div>

      {/* Totals */}
      {cart.length > 0 && (
        <div className="mt-8 border-t pt-4">
          <p className="text-lg font-medium">
            Original:{" "}
            <span className="font-bold line-through ">
              ${formattedSubtotal}
            </span>
          </p>

          <p className="text-2xl font-bold">
            Total: <span className="text-amber-800">${formattedTotal}</span>
          </p>

          <button
            className="w-4/5 md:static fixed bottom-8 left-4 right-4 z-10 py-4 rounded-full flex justify-center items-center md:py-2 px-4 md:my-4 md:rounded-md bg-amber-800 hover:bg-amber-700 text-white transition-colors shadow-lg md:shadow-none"
            onClick={handleStripePayment}
          >
            Proceed to Checkout
          </button>

          <div className="pb-16 md:pb-0 block md:hidden"></div>
          <p
            className="flex text-center flex-start  my-4 text-black-200 cursor-pointer text-sm pr-4 md:pr-0"
            onClick={() => navigate("/")}
          >
            Continue Shopping <ExternalLink size={18} className="ml-2" />
          </p>
        </div>
      )}
    </div>
  );
};

export default CheckOut;
