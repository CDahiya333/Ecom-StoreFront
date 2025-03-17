import { PlusCircle, ShoppingBasket, BarChart } from "lucide-react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import CreateProductForum from "../components/CreateProductForum.jsx";
import ProductList from "../components/ProductList.jsx";
import Analytics from "../components/Analytics.jsx";
import useProductStore from "../Stores/useProductStore.js";

const tabs = [
  { id: "create", label: "Create Product", icon: PlusCircle },
  { id: "products", label: "Products", icon: ShoppingBasket },
  { id: "analytics", label: "Analytics", icon: BarChart },
];

const tabButtonVariants = {
  initial: { opacity: 0, y: -10 },
  animate: { opacity: 1, y: 0 },
  hover: { scale: 1.05 },
};

const contentVariants = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
};

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState("create");
  const { fetchAllProducts } = useProductStore();

  useEffect(() => {
    fetchAllProducts();
  }, [fetchAllProducts]);

  const renderTabContent = () => {
    switch (activeTab) {
      case "create":
        return (
          <div className="p-6">
            <CreateProductForum />
          </div>
        );
      case "products":
        return (
          <div className="p-6">
            <ProductList />
          </div>
        );
      case "analytics":
        return (
          <div className="p-6">
            <Analytics />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-amber-50 text-gray-800">
      <div className="container mx-auto px-6 py-8 mt-12">
        <h1 className="text-4xl sm:text-5xl font-bold text-center mb-8 heading-font">
          Admin Dashboard
        </h1>
        <div className="flex justify-center space-x-4 mb-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <motion.button
                key={tab.id}
                variants={tabButtonVariants}
                initial="initial"
                animate="animate"
                whileHover="hover"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 border-b-4 transition-colors duration-300 ${
                  isActive
                    ? "border-amber-800 text-amber-800 font-semibold"
                    : "border-transparent text-gray-600 hover:text-amber-700"
                }`}
              >
                <Icon size={20} />
                <span>{tab.label}</span>
              </motion.button>
            );
          })}
        </div>
        <AnimatePresence exitBeforeEnter>
          <AnimatePresence>
            <motion.div
              key={activeTab}
              variants={contentVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="bg-white shadow-xl rounded-xl p-6 border border-amber-200 max-w-5xl mx-auto"
            >
              {renderTabContent()}
            </motion.div>
          </AnimatePresence>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdminPage;
