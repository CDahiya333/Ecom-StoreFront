import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";
import useCartStore from "../Stores/useCartStore";
import axios from "../lib/axios";
import toast from "react-hot-toast";

const PurchaseSuccessPage = () => {
  const { width, height } = useWindowSize();
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState(null);
  const { clearCart } = useCartStore();

  useEffect(() => {
    document.title = "Thank You for Your Purchase";
  }, []);

  useEffect(() => {
    const handleCheckOutSuccess = async (sessionId) => {
      try {
        await axios.post("/payments/checkout-success", {
          sessionId,
        });
        console.log("Clearing Cart");
        clearCart();
      } catch (error) {
        console.log(error);
      } finally {
        setIsProcessing(false);
      }
    };
    const sessionId = new URLSearchParams(window.location.search).get(
      "session_id"
    );
    if (sessionId) {
      handleCheckOutSuccess(sessionId);
    } else {
      setIsProcessing(false);
      setError("Unable to Process the Order");
    }
  }, [clearCart]);

  if (isProcessing) return "Processing...";
  if (error) {
    toast.error("Unable to Process Request");
    console.log("Error message:", error);
  }

  return (
    <div className="min-h-screen bg-amber-50 flex items-center justify-center relative overflow-hidden px-4">
      <Confetti
        width={width}
        height={height}
        numberOfPieces={750}
        recycle={false}
      />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-white rounded-2xl shadow-xl border border-amber-100 max-w-lg w-full p-8 text-center"
      >
        <h1 className="text-4xl sm:text-5xl font-bold text-amber-900 mb-4 heading-font">
          Purchase Successful!
        </h1>
        <p className="text-lg text-gray-700 mb-6 body-font">
          Thank you for choosing Us. Your order has been placed and is being
          processed with care. Check your email for Order Details
        </p>
        {/* TODO: Add Order Details and Estimated Delivery */}
        <Link to="/" className="inline-block mt-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-amber-900 text-white px-6 py-3 rounded-xl font-semibold shadow-md hover:bg-amber-800 transition-colors duration-300"
          >
            Continue Shopping
          </motion.button>
        </Link>
      </motion.div>
    </div>
  );
};

export default PurchaseSuccessPage;
