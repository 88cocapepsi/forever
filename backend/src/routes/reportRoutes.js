import express from "express";
import { Product } from "../models/Product.js";
import { Order } from "../models/Order.js";

const router = express.Router();

/**
 * 📊 TỔNG HỢP BÁO CÁO
 */
router.get("/summary", async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const yearStart = new Date(today.getFullYear(), 0, 1);

    const todayOrders = await Order.find({
      paidAt: { $gte: today },
    });

    const monthOrders = await Order.find({
      paidAt: { $gte: monthStart },
    });

    const yearOrders = await Order.find({
      paidAt: { $gte: yearStart },
    });

    const calcRevenue = (orders) =>
      orders.reduce((sum, o) => sum + (o.subtotal || 0), 0);

    const allProducts = await Product.find();

    const lowStock = allProducts.filter((p) => (p.stock || 0) < 10);

    res.json({
      todayRevenue: calcRevenue(todayOrders),
      monthRevenue: calcRevenue(monthOrders),
      yearRevenue: calcRevenue(yearOrders),
      todayOrders: todayOrders.length,

      topProducts: [],
      shiftStats: [],

      lowStock,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
