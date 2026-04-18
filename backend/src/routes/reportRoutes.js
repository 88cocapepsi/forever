import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import { Order } from '../models/Order.js';
import { Product } from '../models/Product.js';
import { InventoryLog } from '../models/InventoryLog.js';

export const reportRouter = express.Router();

function startOfDay(date = new Date()) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function startOfMonth(date = new Date()) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function startOfYear(date = new Date()) {
  return new Date(date.getFullYear(), 0, 1);
}

function sumRevenue(orders) {
  return orders.reduce((total, order) => total + Number(order.subtotal || 0), 0);
}

reportRouter.get('/summary', requireAuth, async (_req, res) => {
  const now = new Date();
  const sod = startOfDay(now);
  const som = startOfMonth(now);
  const soy = startOfYear(now);

  const [dayOrders, monthOrders, yearOrders, recentPaid, lowStock, topProducts, inventoryLogs] = await Promise.all([
    Order.find({ status: 'paid', paidAt: { $gte: sod } }),
    Order.find({ status: 'paid', paidAt: { $gte: som } }),
    Order.find({ status: 'paid', paidAt: { $gte: soy } }),
    Order.find({ status: 'paid' }).sort({ paidAt: -1 }).limit(20),
    Product.find({ isActive: true, stock: { $lte: 5 } }).sort({ stock: 1, name: 1 }).limit(20),
    Order.aggregate([
      { $match: { status: 'paid', paidAt: { $gte: som } } },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.name',
          qty: { $sum: '$items.quantity' },
          revenue: { $sum: { $multiply: ['$items.quantity', '$items.price'] } }
        }
      },
      { $sort: { qty: -1, revenue: -1 } },
      { $limit: 10 }
    ]),
    InventoryLog.find().sort({ createdAt: -1 }).limit(20)
  ]);

  const ca1Start = new Date(sod);
  ca1Start.setHours(6, 0, 0, 0);
  const ca1End = new Date(sod);
  ca1End.setHours(14, 0, 0, 0);
  const ca2End = new Date(sod);
  ca2End.setHours(22, 0, 0, 0);

  const shiftStats = [
    {
      name: 'Ca sáng',
      revenue: sumRevenue(dayOrders.filter((o) => o.paidAt && o.paidAt >= ca1Start && o.paidAt < ca1End)),
      orders: dayOrders.filter((o) => o.paidAt && o.paidAt >= ca1Start && o.paidAt < ca1End).length
    },
    {
      name: 'Ca chiều',
      revenue: sumRevenue(dayOrders.filter((o) => o.paidAt && o.paidAt >= ca1End && o.paidAt < ca2End)),
      orders: dayOrders.filter((o) => o.paidAt && o.paidAt >= ca1End && o.paidAt < ca2End).length
    },
    {
      name: 'Ca tối',
      revenue: sumRevenue(dayOrders.filter((o) => o.paidAt && o.paidAt >= ca2End)),
      orders: dayOrders.filter((o) => o.paidAt && o.paidAt >= ca2End).length
    }
  ];

  res.json({
    todayRevenue: sumRevenue(dayOrders),
    monthRevenue: sumRevenue(monthOrders),
    yearRevenue: sumRevenue(yearOrders),
    todayOrders: dayOrders.length,
    monthOrders: monthOrders.length,
    yearOrders: yearOrders.length,
    recentPaid,
    lowStock,
    topProducts,
    shiftStats,
    recentInventoryLogs: inventoryLogs
  });
});
