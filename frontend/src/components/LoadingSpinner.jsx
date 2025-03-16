import React from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-amber-50">
      <motion.svg
        className="w-24 h-24"
        viewBox="0 0 50 50"
        initial={{ rotate: 0 }}
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
      >
        <circle
          cx="25"
          cy="25"
          r="20"
          fill="none"
          stroke="#8B4513"  // Warm brown tone
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray="90"
          strokeDashoffset="0"
        />
      </motion.svg>
    </div>
  );
};

export default LoadingSpinner;
