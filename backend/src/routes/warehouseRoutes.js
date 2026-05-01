import express from 'express';
import WarehouseItem from '../models/WarehouseItem.js';
import WarehouseLog from '../models/WarehouseLog.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', requireAuth, async (req, res) => {
  try {
    const items = await WarehouseItem.find().sort({ updatedAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message || 'Không lấy được kho' });
  }
});

router.get('/logs', requireAuth, requireAdmin, async (req, res) => {
  try {
    const logs = await WarehouseLog.find().sort({ createdAt: -1 }).limit(100);
    res.json(logs);
  } catch {
    res.json([]);
  }
});

router.post('/', requireAuth, requireAdmin, async (req, res) => {
  try {
    const item = await WarehouseItem.create({
      name: req.body.name || '',
      quantity: Number(req.body.quantity || 0),
      unit: req.body.unit || 'cái',
      note: req.body.note || '',
    });

    await WarehouseLog.create({
      warehouseItem: item._id,
      itemName: item.name,
      action: 'create',
      quantity: item.quantity,
      unit: item.unit,
      note: item.note,
      createdBy: req.user?._id || null,
    });

    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message || 'Không thêm hàng kho được' });
  }
});

router.put('/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    const item = await WarehouseItem.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        quantity: Number(req.body.quantity || 0),
        unit: req.body.unit,
        note: req.body.note,
      },
      { new: true, runValidators: true }
    );

    if (!item) return res.status(404).json({ message: 'Không tìm thấy hàng kho' });

    await WarehouseLog.create({
      warehouseItem: item._id,
      itemName: item.name,
      action: 'edit',
      quantity: item.quantity,
      unit: item.unit,
      note: item.note,
      createdBy: req.user?._id || null,
    });

    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message || 'Không cập nhật kho được' });
  }
});

router.delete('/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    const item = await WarehouseItem.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: 'Không tìm thấy hàng kho' });

    await WarehouseLog.create({
      warehouseItem: item._id,
      itemName: item.name,
      action: 'delete',
      quantity: item.quantity,
      unit: item.unit,
      note: item.note,
      createdBy: req.user?._id || null,
    });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Không xóa hàng kho được' });
  }
});

export default router;
