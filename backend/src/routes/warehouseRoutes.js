import express from 'express';
import { requireAuth, requireAdmin } from '../middleware/auth.js';
import { WarehouseItem } from '../models/WarehouseItem.js';
import { WarehouseLog } from '../models/WarehouseLog.js';

export const warehouseRouter = express.Router();

warehouseRouter.get('/', requireAuth, async (_req, res) => {
  const items = await WarehouseItem.find().sort({ updatedAt: -1, name: 1 });
  res.json(items);
});

warehouseRouter.get('/logs', requireAuth, requireAdmin, async (_req, res) => {
  const logs = await WarehouseLog.find().sort({ createdAt: -1 }).limit(200);
  res.json(logs);
});

warehouseRouter.post('/', requireAuth, requireAdmin, async (req, res) => {
  try {
    const item = await WarehouseItem.create({
      name: String(req.body.name || '').trim(),
      quantity: Number(req.body.quantity || 0),
      unit: String(req.body.unit || 'cái').trim(),
      note: String(req.body.note || '').trim()
    });

    await WarehouseLog.create({
      warehouseItem: item._id,
      itemName: item.name,
      action: 'create',
      quantity: item.quantity,
      unit: item.unit,
      note: item.note,
      createdBy: req.user._id
    });

    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Không tạo được hàng kho' });
  }
});

warehouseRouter.put('/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    const current = await WarehouseItem.findById(req.params.id);
    if (!current) {
      return res.status(404).json({ message: 'Không tìm thấy hàng kho' });
    }

    const item = await WarehouseItem.findByIdAndUpdate(
      req.params.id,
      {
        name: String(req.body.name || current.name).trim(),
        quantity: Number(req.body.quantity ?? current.quantity),
        unit: String(req.body.unit || current.unit).trim(),
        note: String(req.body.note ?? current.note).trim()
      },
      { new: true }
    );

    await WarehouseLog.create({
      warehouseItem: item._id,
      itemName: item.name,
      action: 'edit',
      quantity: item.quantity,
      unit: item.unit,
      note: item.note,
      createdBy: req.user._id
    });

    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Không cập nhật được hàng kho' });
  }
});

warehouseRouter.delete('/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    const item = await WarehouseItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Không tìm thấy hàng kho' });
    }

    await WarehouseLog.create({
      warehouseItem: item._id,
      itemName: item.name,
      action: 'delete',
      quantity: item.quantity,
      unit: item.unit,
      note: item.note,
      createdBy: req.user._id
    });

    await WarehouseItem.findByIdAndDelete(req.params.id);
    res.json({ ok: true, message: 'Đã xóa hàng kho' });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Không xóa được hàng kho' });
  }
});
