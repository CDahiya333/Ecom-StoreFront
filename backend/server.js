import dotenv from "dotenv";
dotenv.config();

import express from "express";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import couponRoutes from "./routes/couponRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import assistantRoutes from "./routes/assistantRoutes.js";
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";

const app = express();
const PORT = process.env.PORT || 5000;

// MiddleWares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Server is Running");
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/assistant", assistantRoutes);

app.listen(PORT, () => {
  console.log(`Listening on PORT:${PORT}`);
  connectDB();
});
