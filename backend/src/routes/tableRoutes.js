import express from "express";
import Table from "../models/Table.js";

const router = express.Router();

const defaultTables = [
  { name: "Bàn 1", area: "front", status: "empty" },
  { name: "Bàn 2", area: "front", status: "empty" },
  { name: "Bàn 3", area: "front", status: "empty" },
  { name: "Bàn 4", area: "front", status: "empty" },
  { name: "Bàn 5", area: "front", status: "empty" },
  { name: "Bàn 6", area: "front", status: "empty" },

  { name: "Bàn 7", area: "back", status: "empty" },
  { name: "Bàn 8", area: "back", status: "empty" },
  { name: "Bàn 9", area: "back", status: "empty" },
  { name: "Bàn 10", area: "back", status: "empty" },

  { name: "VIP 1", area: "vip", status: "empty" },
  { name: "VIP 2", area: "vip", status: "empty" },
  { name: "VIP 3", area: "vip", status: "empty" },
  { name: "VIP 4", area: "vip", status: "empty" },

  { name: "Mang về", area: "other", status: "empty" },
  { name: "Giao đi", area: "other", status: "empty" },
];

router.get("/", async (req, res) => {
  try {
    const tables = await Table.find()
      .populate("currentOrder")
      .sort({ area: 1, name: 1 });

    res.json(tables);
  } catch (err) {
    res.status(500).json({ message: err.message || "Không lấy được danh sách bàn" });
  }
});

router.post("/seed-default", async (req, res) => {
  try {
    const created = [];

    for (const item of defaultTables) {
      const exists = await Table.findOne({ name: item.name });

      if (!exists) {
        const table = await Table.create({
          name: item.name,
          area: item.area,
          status: item.status,
          note: "",
          customerName: "",
          currentOrder: null,
        });

        created.push(table);
      }
    }

    const tables = await Table.find()
      .populate("currentOrder")
      .sort({ area: 1, name: 1 });

    res.json({
      success: true,
      createdCount: created.length,
      tables,
    });
  } catch (err) {
    res.status(500).json({ message: err.message || "Không tạo được bàn mặc định" });
  }
});

router.post("/", async (req, res) => {
  try {
    const table = await Table.create({
      name: req.body.name || "Bàn mới",
      area: req.body.area || "other",
      status: req.body.status || "empty",
      note: req.body.note || "",
      customerName: req.body.customerName || "",
      currentOrder: null,
    });

    res.json(table);
  } catch (err) {
    res.status(500).json({ message: err.message || "Không tạo được bàn" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const table = await Table.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        area: req.body.area,
        status: req.body.status,
        note: req.body.note,
        customerName: req.body.customerName,
        currentOrder: req.body.currentOrder,
      },
      { new: true }
    ).populate("currentOrder");

    if (!table) {
      return res.status(404).json({ message: "Không tìm thấy bàn" });
    }

    res.json(table);
  } catch (err) {
    res.status(500).json({ message: err.message || "Không cập nhật được bàn" });
  }
});

export default router;
