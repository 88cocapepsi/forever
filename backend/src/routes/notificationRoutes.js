import express from 'express';
import { Notification } from '../models/Notification.js';
import { requireAuth } from '../middleware/auth.js';

export const notificationRouter = express.Router();

notificationRouter.get('/', requireAuth, async (req, res) => {
  const limit = Math.min(Number(req.query.limit || 50), 200);
  const notifications = await Notification.find().sort({ createdAt: -1 }).limit(limit);
  res.json(notifications);
});

notificationRouter.post('/', requireAuth, async (req, res) => {
  try {
    const item = await Notification.create({
      type: String(req.body.type || 'system').trim(),
      title: String(req.body.title || '').trim(),
      message: String(req.body.message || '').trim(),
      level: String(req.body.level || 'info').trim(),
      createdByName: String(req.user?.name || req.body.createdByName || '').trim()
    });
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Không tạo được thông báo' });
  }
});

notificationRouter.put('/:id/read', requireAuth, async (req, res) => {
  const item = await Notification.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { readBy: req.user._id } },
    { new: true }
  );
  if (!item) return res.status(404).json({ message: 'Không tìm thấy thông báo' });
  res.json(item);
});

notificationRouter.put('/read-all/all', requireAuth, async (req, res) => {
  await Notification.updateMany(
    { readBy: { $ne: req.user._id } },
    { $addToSet: { readBy: req.user._id } }
  );
  res.json({ ok: true });
});
