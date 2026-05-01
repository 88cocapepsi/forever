import express from "express";
import mongoose from "mongoose";
import { Order } from "../models/Order.js";
import { PosTable } from "../models/Table.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

/**
 * 🔥 MỞ ORDER CHO BÀN
 * POST /api/orders/table/:tableId/open
 */
router.post("/table/:tableId/open", requireAuth, async (req, res) => {
  try {
    const { tableId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(tableId)) {
      return res.status(400).json({ message: "tableId không hợp lệ" });
    }

    // check bàn
    const table = await PosTable.findById(tableId);
    if (!table) {
      return res.status(404).json({ message: "Không tìm thấy bàn" });
    }

    // nếu đã có order mở thì return luôn
    let existingOrder = await Order.findOne({
      table: tableId,
      status: "open",
    });

    if (existingOrder) {
      return res.json(existingOrder);
    }

    // tạo order mới
    const order = await Order.create({
      table: tableId,
      items: [],
      subtotal: 0,
      status: "open",
      openedBy: req.user._id, // 🔥 cực kỳ quan trọng
    });

    // update bàn
    table.currentOrder = order._id;
    table.status = "serving";
    await table.save();

    res.json(order);
  } catch (err) {
    console.error("OPEN ORDER ERROR:", err);
    res.status(500).json({ message: err.message });
  }
});

export default router;
