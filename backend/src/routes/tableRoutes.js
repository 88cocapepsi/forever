const express = require("express");
const router = express.Router();
const Table = require("../models/Table");

// =========================
// HELPER: danh sách bàn mặc định
// =========================
function buildDefaultTables() {
  return [
    // 6 bàn phía trước sảnh
    { name: "Bàn 1", area: "front", status: "empty" },
    { name: "Bàn 2", area: "front", status: "empty" },
    { name: "Bàn 3", area: "front", status: "empty" },
    { name: "Bàn 4", area: "front", status: "empty" },
    { name: "Bàn 5", area: "front", status: "empty" },
    { name: "Bàn 6", area: "front", status: "empty" },

    // 4 bàn phía sau công viên
    { name: "Bàn 7", area: "back", status: "empty" },
    { name: "Bàn 8", area: "back", status: "empty" },
    { name: "Bàn 9", area: "back", status: "empty" },
    { name: "Bàn 10", area: "back", status: "empty" },

    // 4 bàn VIP
    { name: "VIP 1", area: "vip", status: "empty" },
    { name: "VIP 2", area: "vip", status: "empty" },
    { name: "VIP 3", area: "vip", status: "empty" },
    { name: "VIP 4", area: "vip", status: "empty" },

    // Khác
    { name: "Mang về", area: "other", status: "empty" },
    { name: "Giao đi", area: "other", status: "empty" },
  ];
}

// =========================
// GET ALL TABLES
// =========================
router.get("/", async (req, res) => {
  try {
    const tables = await Table.find().sort({ createdAt: 1, name: 1 });
    res.json(tables);
  } catch (error) {
    console.error("GET /tables error:", error);
    res.status(500).json({ message: "Lỗi lấy danh sách bàn", error: error.message });
  }
});

// =========================
// GET ONE TABLE BY ID
// =========================
router.get("/:id", async (req, res) => {
  try {
    const table = await Table.findById(req.params.id);
    if (!table) {
      return res.status(404).json({ message: "Không tìm thấy bàn" });
    }
    res.json(table);
  } catch (error) {
    console.error("GET /tables/:id error:", error);
    res.status(500).json({ message: "Lỗi lấy thông tin bàn", error: error.message });
  }
});

// =========================
// CREATE ONE TABLE
// =========================
router.post("/", async (req, res) => {
  try {
    const { name, area, status, note } = req.body;

    if (!name || !String(name).trim()) {
      return res.status(400).json({ message: "Tên bàn là bắt buộc" });
    }

    const existed = await Table.findOne({ name: String(name).trim() });
    if (existed) {
      return res.status(400).json({ message: `Bàn "${name}" đã tồn tại` });
    }

    const newTable = await Table.create({
      name: String(name).trim(),
      area: area || "other",
      status: status || "empty",
      note: note || "",
    });

    res.status(201).json(newTable);
  } catch (error) {
    console.error("POST /tables error:", error);
    res.status(500).json({ message: "Lỗi tạo bàn", error: error.message });
  }
});

// =========================
// CREATE DEFAULT TABLES
// Chỉ thêm bàn còn thiếu, không tạo trùng
// =========================
router.post("/seed-default", async (req, res) => {
  try {
    const defaultTables = buildDefaultTables();

    const existingTables = await Table.find({}, { name: 1 });
    const existingNames = new Set(existingTables.map((t) => t.name));

    const missingTables = defaultTables.filter((t) => !existingNames.has(t.name));

    let inserted = [];
    if (missingTables.length > 0) {
      inserted = await Table.insertMany(missingTables);
    }

    const allTables = await Table.find().sort({ createdAt: 1, name: 1 });

    res.json({
      message:
        inserted.length > 0
          ? `Đã thêm ${inserted.length} bàn mặc định còn thiếu`
          : "Tất cả bàn mặc định đã tồn tại, không có gì để thêm",
      insertedCount: inserted.length,
      insertedTables: inserted,
      tables: allTables,
    });
  } catch (error) {
    console.error("POST /tables/seed-default error:", error);
    res.status(500).json({ message: "Lỗi tạo bàn mặc định", error: error.message });
  }
});

// =========================
// RESET ALL TABLES AND CREATE DEFAULT AGAIN
// Cẩn thận: route này sẽ xóa toàn bộ bàn hiện có
// =========================
router.post("/reset-default", async (req, res) => {
  try {
    const defaultTables = buildDefaultTables();

    await Table.deleteMany({});
    const inserted = await Table.insertMany(defaultTables);

    res.json({
      message: "Đã reset toàn bộ danh sách bàn về mặc định",
      insertedCount: inserted.length,
      tables: inserted,
    });
  } catch (error) {
    console.error("POST /tables/reset-default error:", error);
    res.status(500).json({ message: "Lỗi reset bàn mặc định", error: error.message });
  }
});

// =========================
// UPDATE TABLE
// =========================
router.put("/:id", async (req, res) => {
  try {
    const { name, area, status, note, currentOrder, customerName } = req.body;

    const table = await Table.findById(req.params.id);
    if (!table) {
      return res.status(404).json({ message: "Không tìm thấy bàn" });
    }

    if (name && String(name).trim() !== table.name) {
      const existed = await Table.findOne({
        name: String(name).trim(),
        _id: { $ne: req.params.id },
      });

      if (existed) {
        return res.status(400).json({ message: `Bàn "${name}" đã tồn tại` });
      }

      table.name = String(name).trim();
    }

    if (area !== undefined) table.area = area;
    if (status !== undefined) table.status = status;
    if (note !== undefined) table.note = note;
    if (currentOrder !== undefined) table.currentOrder = currentOrder;
    if (customerName !== undefined) table.customerName = customerName;

    const updatedTable = await table.save();
    res.json(updatedTable);
  } catch (error) {
    console.error("PUT /tables/:id error:", error);
    res.status(500).json({ message: "Lỗi cập nhật bàn", error: error.message });
  }
});

// =========================
// UPDATE TABLE STATUS ONLY
// =========================
router.patch("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;

    const table = await Table.findById(req.params.id);
    if (!table) {
      return res.status(404).json({ message: "Không tìm thấy bàn" });
    }

    table.status = status || "empty";
    const updatedTable = await table.save();

    res.json(updatedTable);
  } catch (error) {
    console.error("PATCH /tables/:id/status error:", error);
    res.status(500).json({ message: "Lỗi cập nhật trạng thái bàn", error: error.message });
  }
});

// =========================
// DELETE ONE TABLE
// =========================
router.delete("/:id", async (req, res) => {
  try {
    const table = await Table.findById(req.params.id);
    if (!table) {
      return res.status(404).json({ message: "Không tìm thấy bàn" });
    }

    await Table.findByIdAndDelete(req.params.id);

    res.json({ message: "Đã xóa bàn thành công" });
  } catch (error) {
    console.error("DELETE /tables/:id error:", error);
    res.status(500).json({ message: "Lỗi xóa bàn", error: error.message });
  }
});

module.exports = router;
