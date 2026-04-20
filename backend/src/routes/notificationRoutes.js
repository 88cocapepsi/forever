import express from 'express';
import Notification from '../models/Notification.js';

const notificationRouter = express.Router();

// GET /api/notifications?limit=100
notificationRouter.get('/', async (req, res) => {
  try {
    const limit = Math.max(1, Math.min(200, Number(req.query.limit || 100)));

    const notifications = await Notification.find()
      .sort({ createdAt: -1 })
      .limit(limit);

    res.json(notifications);
  } catch (error) {
    console.error('GET /api/notifications error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi lấy danh sách thông báo',
      error: error.message,
    });
  }
});

// POST /api/notifications
notificationRouter.post('/', async (req, res) => {
  try {
    const type = String(req.body?.type || 'system').trim();
    const title = String(req.body?.title || '').trim();
    const message = String(req.body?.message || '').trim();
    const level = String(req.body?.level || 'info').trim();
    const meta = req.body?.meta || {};

    if (!message) {
      return res.status(400).json({
        success: false,
        message: 'Nội dung thông báo là bắt buộc',
      });
    }

    const notification = await Notification.create({
      type,
      title,
      message,
      level,
      meta,
      readBy: [],
    });

    res.status(201).json(notification);
  } catch (error) {
    console.error('POST /api/notifications error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi tạo thông báo',
      error: error.message,
    });
  }
});

// PUT /api/notifications/:id/read
notificationRouter.put('/:id/read', async (req, res) => {
  try {
    const userId = String(req.body?.userId || '').trim();

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu userId để đánh dấu đã đọc',
      });
    }

    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy thông báo',
      });
    }

    if (!notification.readBy.includes(userId)) {
      notification.readBy.push(userId);
      await notification.save();
    }

    res.json(notification);
  } catch (error) {
    console.error('PUT /api/notifications/:id/read error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi cập nhật trạng thái đã đọc',
      error: error.message,
    });
  }
});

// PUT /api/notifications/read-all/all
notificationRouter.put('/read-all/all', async (req, res) => {
  try {
    const userId = String(req.body?.userId || '').trim();

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu userId để đọc tất cả',
      });
    }

    const notifications = await Notification.find();

    for (const item of notifications) {
      if (!item.readBy.includes(userId)) {
        item.readBy.push(userId);
        await item.save();
      }
    }

    res.json({
      success: true,
      message: 'Đã đánh dấu tất cả là đã đọc',
    });
  } catch (error) {
    console.error('PUT /api/notifications/read-all/all error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi đọc tất cả thông báo',
      error: error.message,
    });
  }
});

export { notificationRouter };
export default notificationRouter;
