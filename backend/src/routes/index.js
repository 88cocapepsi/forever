import express from "express";

import authRoutes from "./authRoutes.js";
import productRoutes from "./productRoutes.js";
import tableRoutes from "./tableRoutes.js";
import orderRoutes from "./orderRoutes.js";
import reportRoutes from "./reportRoutes.js";
import warehouseRoutes from "./warehouseRoutes.js";
import notificationRoutes from "./notificationRoutes.js";

const router = express.Router();

/**
 * 🔥 ROOT TEST
 */
router.get("/", (req, res) => {
  res.json({
    success: true,
    message: "FOREVER POS API running",
  });
});

/**
 * 🔥 HEALTH CHECK (FIX lỗi 404 anh đang gặp)
 */
router.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "API OK",
    time: new Date(),
  });
});

/**
 * 🔐 AUTH
 */
router.use("/auth", authRoutes);

/**
 * 🍹 PRODUCTS
 */
router.use("/products", productRoutes);

/**
 * 🪑 TABLES
 */
router.use("/tables", tableRoutes);

/**
 * 🧾 ORDERS (QUAN TRỌNG)
 */
router.use("/orders", orderRoutes);

/**
 * 📊 REPORTS
 */
router.use("/reports", reportRoutes);

/**
 * 📦 WAREHOUSE
 */
router.use("/warehouse", warehouseRoutes);

/**
 * 🔔 NOTIFICATIONS
 */
router.use("/notifications", notificationRoutes);

export default router;
