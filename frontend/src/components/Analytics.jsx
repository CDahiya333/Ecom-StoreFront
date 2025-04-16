// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import axios from "../lib/axios";
import { Users, Package, ShoppingCart, DollarSign } from "lucide-react";
import LoadingSpinner from "./LoadingSpinner.jsx";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const cardVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  hover: { scale: 1.04, transition: { duration: 0.3 } },
};

const Analytics = () => {
  const [analyticsData, setAnalyticsData] = useState({
    users: 0,
    products: 0,
    totalSales: 0,
    totalRevenue: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [dailySalesData, setDailySalesData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        const response = await axios.get("/analytics");

        // Check if the response has the expected structure
        if (response.data && response.data.stats) {
          setAnalyticsData(response.data.stats);
        } else {
          console.error("Unexpected API response format:", response.data);
          setError("Received unexpected data format from the server");
        }

        if (response.data && Array.isArray(response.data.graphChart)) {
          const formattedData = response.data.graphChart.map((item) => ({
            name: new Date(item.date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            }),
            sales: item.totalSales,
            revenue: item.totalRevenue,
          }));
          setDailySalesData(formattedData);
        } else {
          setDailySalesData([]);
        }
      } catch (error) {
        console.error("Error fetching analytics data:", error);
        setError("Failed to fetch analytics data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalyticsData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-800">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-800">
        <div className="bg-red-50 p-6 rounded-xl border border-red-200 text-red-800">
          <h2 className="text-xl font-bold mb-2">Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="vh-screen bg-amber-50 text-gray-800 px-4 sm:px-6 lg:px-8 py-8">
      {/* Analytics Data Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <AnalyticsCard
          title="Total Users"
          value={analyticsData.users.toLocaleString()}
          icon={Users}
        />
        <AnalyticsCard
          title="Total Products"
          value={analyticsData.products.toLocaleString()}
          icon={Package}
        />
        <AnalyticsCard
          title="Total Sales"
          value={analyticsData.totalSales.toLocaleString()}
          icon={ShoppingCart}
        />
        <AnalyticsCard
          title="Total Revenue"
          value={`$${analyticsData.totalRevenue.toLocaleString()}`}
          icon={DollarSign}
        />
      </div>

      {/* Analytics Chart */}
      <motion.div
        variants={cardVariants}
        initial="initial"
        animate="animate"
        whileHover="hover"
        className="bg-white rounded-xl shadow-xl border border-transparent hover:border-amber-200 p-6"
      >
        <h2 className="text-2xl font-bold mb-4 text-amber-900">
          Daily Sales & Revenue (Last 7 Days)
        </h2>
        {dailySalesData.length > 0 ? (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={dailySalesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" stroke="#6B7280" />
              <YAxis yAxisId="left" stroke="#6B7280" name="Sales" />
              <YAxis
                yAxisId="right"
                orientation="right"
                stroke="#6B7280"
                name="Revenue ($)"
              />
              <Tooltip
                formatter={(value, name) => {
                  return name === "revenue"
                    ? `$${value.toLocaleString()}`
                    : value.toLocaleString();
                }}
              />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="sales"
                stroke="#10B981"
                activeDot={{ r: 8 }}
                name="Sales"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="revenue"
                stroke="#78350F"
                activeDot={{ r: 8 }}
                name="Revenue ($)"
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-64 text-gray-500">
            No sales data available for the last 7 days
          </div>
        )}
      </motion.div>
    </div>
  );
};

// Analytics Card Component and Styling
// eslint-disable-next-line no-unused-vars
const AnalyticsCard = ({ title, value, icon: Icon }) => (
  <motion.div
    variants={cardVariants}
    initial="initial"
    animate="animate"
    whileHover="hover"
    className="bg-white rounded-xl shadow-xl border border-transparent hover:border-amber-200 p-6 relative overflow-hidden"
  >
    <div className="flex flex-col justify-between">
      <div>
        <p className="text-sm font-semibold text-amber-900 mb-1">{title}</p>
        <h3 className="text-3xl font-bold text-gray-800">{value}</h3>
      </div>
    </div>
    {/* Display icon in a subdued style */}
    <div className="absolute -bottom-4 -right-4 opacity-25">
      <Icon className="h-20 w-20" />
    </div>
  </motion.div>
);

export default Analytics;
