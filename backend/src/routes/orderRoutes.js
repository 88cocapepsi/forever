import express from "express";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import Table from "../models/Table.js";
import User from "../models/User.js";

const router = express.Router();

async function getDefaultUserId(req) {
  if (req.user?.id) return req.user.id;
  if (req.user?._id) return req.user._id;

  const admin =
    (await User.findOne({ username: "admin" })) ||
    (await User.findOne({ role: "admin" })) ||
    (await User.findOne());

  return admin?._id || null;
}

function calcSubtotal(items = []) {
  return items.reduce(
    (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0),
    0
  );
}

/**
 * LỊCH SỬ THANH TOÁN
 * PHẢI ĐẶT TRƯỚC /:id
 */
router.get("/history", async (req, res) => {
  try {
    const limit = Number(req.query.limit || 100);

    const orders = await Order.find({ status: "paid" })
      .sort({ paidAt: -1, createdAt: -1 })
      .limit(limit)
      .lean();

    res.json(orders);
  } catch (err) {
    console.error("ORDER HISTORY ERROR:", err);
    res.status(500).json({ message: err.message || "Không lấy được lịch sử đơn" });
  }
});

/**
 * MỞ / LẤY ORDER THEO BÀN
 */
router.post("/table/:tableId/open", async (req, res) => {
  try {
    const { tableId } = req.params;

    const table = await Table.findById(tableId);
    if (!table) {
      return res.status(404).json({ message: "Không tìm thấy bàn" });
    }

    if (table.currentOrder) {
      const existingOrder = await Order.findById(table.currentOrder);
      if (existingOrder) return res.json(existingOrder);
    }

    const openedBy = await getDefaultUserId(req);

    if (!openedBy) {
      return res.status(500).json({
        message: "Không tìm thấy user admin để tạo đơn. Hãy kiểm tra collection users.",
      });
    }

    const order = await Order.create({
      table: tableId,
      items: [],
      subtotal: 0,
      status: "open",
      openedBy,
      paidBy: null,
      note: "",
      paidAt: null,
    });

    table.currentOrder = order._id;
    table.status = "busy";
    await table.save();

    res.json(order);
  } catch (err) {
    console.error("OPEN ORDER ERROR:", err);
    res.status(500).json({ message: err.message || "Không mở được đơn" });
  }
});

/**
 * LẤY ORDER THEO ID
 */
router.get("/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Không tìm thấy đơn" });
    }

    res.json(order);
  } catch (err) {
    console.error("GET ORDER ERROR:", err);
    res.status(500).json({ message: err.message || "Không lấy được đơn" });
  }
});

/**
 * THÊM MÓN VÀO ORDER
 */
router.post("/:orderId/items", async (req, res) => {
  try {
    const { productId } = req.body;
    const quantity = Number(req.body.quantity || 1);

    const order = await Order.findById(req.params.orderId);
    if (!order) {
      return res.status(404).json({ message: "Không tìm thấy đơn" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Không tìm thấy món" });
    }

    const existing = order.items.find(
      (item) => String(item.product) === String(productId)
    );

    if (existing) {
      existing.quantity += quantity;
    } else {
      order.items.push({
        product: product._id,
        name: product.name,
        price: Number(product.price || 0),
        quantity,
      });
    }

    product.stock = Math.max(0, Number(product.stock || 0) - quantity);
    await product.save();

    order.subtotal = calcSubtotal(order.items);
    order.status = "open";
    await order.save();

    const table = await Table.findById(order.table);
    if (table) {
      table.currentOrder = order._id;
      table.status = "busy";
      await table.save();
    }

    res.json(order);
  } catch (err) {
    console.error("ADD ITEM ERROR:", err);
    res.status(500).json({ message: err.message || "Không thêm món được" });
  }
});

/**
 * CẬP NHẬT SỐ LƯỢNG
 */
router.put("/:orderId/items/:productId", async (req, res) => {
  try {
    const quantity = Number(req.body.quantity || 0);

    const order = await Order.findById(req.params.orderId);
    if (!order) {
      return res.status(404).json({ message: "Không tìm thấy đơn" });
    }

    const item = order.items.find(
      (i) => String(i.product) === String(req.params.productId)
    );

    if (!item) {
      return res.status(404).json({ message: "Không tìm thấy món trong đơn" });
    }

    item.quantity = quantity;
    order.items = order.items.filter((i) => Number(i.quantity || 0) > 0);
    order.subtotal = calcSubtotal(order.items);

    await order.save();

    res.json(order);
  } catch (err) {
    console.error("UPDATE ITEM ERROR:", err);
    res.status(500).json({ message: err.message || "Không cập nhật món được" });
  }
});

/**
 * THANH TOÁN
 */
router.post("/:orderId/pay", async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);

    if (!order) {
      return res.status(404).json({ message: "Không tìm thấy đơn" });
    }

    const paidBy = await getDefaultUserId(req);

    order.status = "paid";
    order.paidAt = new Date();
    order.paidBy = paidBy;
    order.subtotal = calcSubtotal(order.items);

    await order.save();

    const table = await Table.findById(order.table);
    if (table) {
      table.currentOrder = null;
      table.status = "empty";
      await table.save();
    }

    res.json(order);
  } catch (err) {
    console.error("PAY ORDER ERROR:", err);
    res.status(500).json({ message: err.message || "Không thanh toán được" });
  }
});

export default router;
