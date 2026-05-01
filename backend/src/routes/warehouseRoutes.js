import express from "express";

const router = express.Router();

const memoryWarehouse = [];
const memoryLogs = [];

router.get("/", async (req, res) => {
  res.json(memoryWarehouse);
});

router.get("/logs", async (req, res) => {
  res.json(memoryLogs);
});

router.post("/", async (req, res) => {
  const item = {
    _id: Date.now().toString(),
    name: req.body.name || "",
    quantity: Number(req.body.quantity || 0),
    unit: req.body.unit || "cái",
    note: req.body.note || "",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  memoryWarehouse.unshift(item);

  memoryLogs.unshift({
    _id: `${Date.now()}-log`,
    itemName: item.name,
    action: "create",
    quantity: item.quantity,
    unit: item.unit,
    note: item.note,
    createdAt: new Date(),
  });

  res.json(item);
});

router.put("/:id", async (req, res) => {
  const item = memoryWarehouse.find((x) => x._id === req.params.id);

  if (!item) {
    return res.status(404).json({ message: "Không tìm thấy hàng kho" });
  }

  item.name = req.body.name ?? item.name;
  item.quantity = Number(req.body.quantity ?? item.quantity);
  item.unit = req.body.unit ?? item.unit;
  item.note = req.body.note ?? item.note;
  item.updatedAt = new Date();

  memoryLogs.unshift({
    _id: `${Date.now()}-log`,
    itemName: item.name,
    action: "update",
    quantity: item.quantity,
    unit: item.unit,
    note: item.note,
    createdAt: new Date(),
  });

  res.json(item);
});

router.delete("/:id", async (req, res) => {
  const index = memoryWarehouse.findIndex((x) => x._id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ message: "Không tìm thấy hàng kho" });
  }

  const [removed] = memoryWarehouse.splice(index, 1);

  memoryLogs.unshift({
    _id: `${Date.now()}-log`,
    itemName: removed.name,
    action: "delete",
    quantity: removed.quantity,
    unit: removed.unit,
    note: removed.note,
    createdAt: new Date(),
  });

  res.json({ success: true });
});

export default router;
