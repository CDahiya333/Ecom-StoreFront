import { XCircle, ArrowLeft } from "lucide-react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const PurchaseCancelPage = () => {
  return (
    <div className="min-h-screen bg-amber-50 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="bg-white border border-amber-200 rounded-xl shadow-lg overflow-hidden max-w-md w-full"
      >
        <div className="p-8">
          <div className="flex justify-center">
            <XCircle className="w-16 h-16 text-red-500" />
          </div>
          <h1 className="mt-4 text-center text-3xl font-bold text-red-500 heading-font">
            Purchase Cancelled
          </h1>
          <p className="mt-2 text-center text-gray-600 body-font">
            Your order has been cancelled, and no charges have been made.
          </p>
          <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-4">
            <p className="text-sm text-gray-500 text-center">
              If you experienced any issues during checkout, please reach out to
              our support team.
            </p>
          </div>
          <div className="mt-6 flex justify-center">
            <Link
              to="/"
              className="flex items-center space-x-2 bg-amber-900 hover:bg-amber-800 text-white font-bold py-3 px-6 rounded-full transition duration-300"
            >
              <ArrowLeft size={20} />
              <span>Return to Shop</span>
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PurchaseCancelPage;
