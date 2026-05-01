import express from "express";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import Table from "../models/Table.js";

const router = express.Router();

/**
 * 🟢 MỞ / LẤY ORDER THEO BÀN
 */
router.post("/table/:tableId/open", async (req, res) => {
  try {
    const { tableId } = req.params;

    const table = await Table.findById(tableId);
    if (!table) return res.status(404).json({ message: "Không tìm thấy bàn" });

    // nếu đã có order thì trả về luôn
    if (table.currentOrder) {
      const order = await Order.findById(table.currentOrder);
      return res.json(order);
    }

    // tạo order mới
    const order = await Order.create({
      table: tableId,
      items: [],
      subtotal: 0,
      total: 0,
    });

    table.currentOrder = order._id;
    await table.save();

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * 🟢 LẤY ORDER THEO ID
 */
router.get("/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * 🟢 THÊM MÓN
 */
router.post("/:orderId/items", async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    const order = await Order.findById(req.params.orderId);
    const product = await Product.findById(productId);

    if (!order || !product)
      return res.status(404).json({ message: "Không tìm thấy dữ liệu" });

    const existing = order.items.find((i) => i.product == productId);

    if (existing) {
      existing.quantity += quantity;
    } else {
      order.items.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity,
      });
    }

    // trừ kho
    product.stock = Math.max(0, product.stock - quantity);
    await product.save();

    // tính tiền
    order.subtotal = order.items.reduce(
      (sum, i) => sum + i.price * i.quantity,
      0
    );

    await order.save();

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * 🟢 UPDATE SỐ LƯỢNG
 */
router.put("/:orderId/items/:productId", async (req, res) => {
  try {
    const { quantity } = req.body;

    const order = await Order.findById(req.params.orderId);
    if (!order) return res.status(404).json({ message: "Không tìm thấy order" });

    const item = order.items.find(
      (i) => i.product == req.params.productId
    );

    if (!item) return res.status(404).json({ message: "Không có món" });

    item.quantity = Math.max(0, quantity);

    // nếu = 0 thì xóa
    order.items = order.items.filter((i) => i.quantity > 0);

    order.subtotal = order.items.reduce(
      (sum, i) => sum + i.price * i.quantity,
      0
    );

    await order.save();

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * 🟢 THANH TOÁN
 */
router.post("/:orderId/pay", async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) return res.status(404).json({ message: "Không tìm thấy order" });

    order.paidAt = new Date();
    await order.save();

    // reset bàn
    const table = await Table.findById(order.table);
    if (table) {
      table.currentOrder = null;
      await table.save();
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * 🟢 LỊCH SỬ
 */
router.get("/history/all", async (req, res) => {
  try {
    const orders = await Order.find({ paidAt: { $ne: null } })
      .sort({ paidAt: -1 })
      .limit(100);

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
