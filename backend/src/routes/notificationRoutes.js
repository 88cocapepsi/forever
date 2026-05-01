import express from 'express';
import Notification from '../models/Notification.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/', requireAuth, async (req, res) => {
  try {
    const limit = Math.min(Number(req.query.limit || 100), 300);
    const notifications = await Notification.find().sort({ createdAt: -1 }).limit(limit);
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: err.message || 'Không lấy được thông báo' });
  }
});

router.post('/', requireAuth, async (req, res) => {
  try {
    const item = await Notification.create({
      type: req.body.type || 'system',
      title: req.body.title || 'Thông báo',
      message: req.body.message || '',
      level: req.body.level || 'info',
      meta: req.body.meta || {},
      readBy: [],
    });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message || 'Không tạo được thông báo' });
  }
});

router.put('/read-all/all', requireAuth, async (req, res) => {
  try {
    const userId = String(req.user?._id || req.user?.id || '');
    await Notification.updateMany({ readBy: { $ne: userId } }, { $push: { readBy: userId } });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Không cập nhật được thông báo' });
  }
});

router.put('/:id/read', requireAuth, async (req, res) => {
  try {
    const userId = String(req.user?._id || req.user?.id || '');
    const item = await Notification.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { readBy: userId } },
      { new: true }
    );

    if (!item) return res.status(404).json({ message: 'Không tìm thấy thông báo' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message || 'Không đánh dấu được thông báo' });
  }
});

export default router;
