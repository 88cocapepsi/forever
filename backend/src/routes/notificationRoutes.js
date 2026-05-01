import express from "express";

const router = express.Router();

const memoryNotifications = [];

router.get("/", async (req, res) => {
  const limit = Number(req.query.limit || 100);
  res.json(memoryNotifications.slice(0, limit));
});

router.post("/", async (req, res) => {
  const item = {
    _id: Date.now().toString(),
    type: req.body.type || "system",
    title: req.body.title || "Thông báo",
    message: req.body.message || "",
    level: req.body.level || "info",
    meta: req.body.meta || {},
    readBy: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  memoryNotifications.unshift(item);
  res.json(item);
});

router.put("/:id/read", async (req, res) => {
  const item = memoryNotifications.find((x) => x._id === req.params.id);

  if (!item) {
    return res.status(404).json({ message: "Không tìm thấy thông báo" });
  }

  const userId = req.user?.id || req.user?._id || "local-user";

  if (!item.readBy.includes(userId)) {
    item.readBy.push(userId);
  }

  item.updatedAt = new Date();
  res.json(item);
});

router.put("/read-all/all", async (req, res) => {
  const userId = req.user?.id || req.user?._id || "local-user";

  memoryNotifications.forEach((item) => {
    if (!item.readBy.includes(userId)) {
      item.readBy.push(userId);
    }
    item.updatedAt = new Date();
  });

  res.json({ success: true });
});

export default router;
