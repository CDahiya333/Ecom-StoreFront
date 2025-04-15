import { get } from "mongoose";
import User from "../models/userModel.js";

export const getAnalytics = async (req, res) => {
  try {
    const stats = await getAnalyticsStats();
    const endDate = new Date();
    const startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000);
    const graphChart = await getGraphData(startDate, endDate);

    res.json({
      stats,
      graphChart,
    });
  } catch (error) {
    console.log("Error in getAnalytics", error.message);
    return res.status(500).json({ message: "Server Error" });
  }
};
async function getAnalyticsStats() {
  try {
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();

    const salesData = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalSales: { $sum: 1 },
          totalRevenue: { $sum: "$totalAmount" },
        },
      },
    ]);

    const { totalSales, totalRevenue } = salesData[0] || {
      totalSales: 0,
      totalRevenue: 0,
    };

    return {
      users: totalUsers,
      products: totalProducts,
      totalSales,
      totalRevenue,
    };
  } catch (error) {
    console.log("Error in getAnalyticsStats", error.message);
    return res.status(500).json({ message: "Server Error" });
  }
}
async function getGraphData(startDate, endDate) {
  try {
    const graphData = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          totalSales: { $sum: 1 },
          totalRevenue: { $sum: "$totalAmount" },
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
    ]);
    const dateArray = getDatesInRange(startDate, endDate);
    return dateArray.map((date) => {
      const foundData = graphData.find((data) => data._id === date);
      return {
        date,
        totalSales: foundData ? foundData.totalSales : 0,
        totalRevenue: foundData ? foundData.totalRevenue : 0,
      };
    });
  } catch (error) {
    console.log("Error in getGraphData", error.message);
    return res.status(500).json({ message: "Server Error" });
  }
}