import React from "react";
import useCartStore from "../Stores/useCartStore";
import { useState } from "react";
import { ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";
const CheckOut = () => {
  const {
    cart,
    total,
    subtotal,
    coupon,
    applyCoupon,
    removeCoupon,
    isCouponApplied,
  } = useCartStore();

  const savings = subtotal - total;
  const formattedSubtotal = subtotal.toFixed(2);
  const formattedTotal = total.toFixed(2);
  const formattedSavings = savings.toFixed(2);

  const [couponCode, setCouponCode] = useState("");
  const [couponFeedback, setCouponFeedback] = useState("");
  const navigate = useNavigate();

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
    <div>
      {/* Coupon Code Interface */}
      <div className="w-full  bg-white rounded-xl shadow-xl p-6 h-fit py-2.5 my-15">
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
        {coupon && (
          <p className="text-lg font-medium text-green-600">
            Savings: <span className="font-bold">{formattedSavings}%</span>
            <button
              onClick={handleRemoveCoupon}
              className="ml-2 text-sm text-red-500 hover:text-red-700"
            >
              (Remove)
            </button>
          </p>
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

          {savings > 0 && (
            <dl className="flex items-center justify-between gap-4">
              <dt className="text-base font-normal text-gray-300">Savings</dt>
              <dd className="text-base font-medium text-amber-300">
                -${formattedSavings}
              </dd>
            </dl>
          )}
          <p className="text-2xl font-bold">
            Total: <span className="text-amber-800">${formattedTotal}</span>
          </p>

          <button className="w-full flex justify-center items-center py-2 px-4 my-4 rounded-md bg-amber-800 hover:bg-amber-700 text-white transition-colors">
            Proceed to Checkout
          </button>
          <p
            className="flex text-center flex-start  my-4 text-black-200 cursor-pointer text-sm pr-4"
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
