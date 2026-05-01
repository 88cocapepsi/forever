import express from 'express';
import mongoose from 'mongoose';
import Table from '../models/Table.js';
import Order from '../models/Order.js';

const router = express.Router();

const defaultTables = [
  { name: 'Bàn 1', area: 'front', status: 'empty' },
  { name: 'Bàn 2', area: 'front', status: 'empty' },
  { name: 'Bàn 3', area: 'front', status: 'empty' },
  { name: 'Bàn 4', area: 'front', status: 'empty' },
  { name: 'Bàn 5', area: 'front', status: 'empty' },
  { name: 'Bàn 6', area: 'front', status: 'empty' },
  { name: 'Bàn 7', area: 'back', status: 'empty' },
  { name: 'Bàn 8', area: 'back', status: 'empty' },
  { name: 'Bàn 9', area: 'back', status: 'empty' },
  { name: 'Bàn 10', area: 'back', status: 'empty' },
  { name: 'VIP 1', area: 'vip', status: 'empty' },
  { name: 'VIP 2', area: 'vip', status: 'empty' },
  { name: 'VIP 3', area: 'vip', status: 'empty' },
  { name: 'VIP 4', area: 'vip', status: 'empty' },
  { name: 'Mang về', area: 'other', status: 'empty' },
  { name: 'Giao đi', area: 'other', status: 'empty' },
];

function isObjectIdLike(value) {
  if (!value) return false;
  if (typeof value === 'string') return mongoose.Types.ObjectId.isValid(value);
  if (value instanceof mongoose.Types.ObjectId) return true;
  return false;
}

async function attachCurrentOrder(tableDoc) {
  const table = tableDoc.toObject ? tableDoc.toObject() : { ...tableDoc };
  const raw = table.currentOrder;

  if (isObjectIdLike(raw)) {
    const order = await Order.findById(raw).lean();
    table.currentOrder = order || null;
  } else if (raw && typeof raw === 'object' && raw._id && mongoose.Types.ObjectId.isValid(raw._id)) {
    const order = await Order.findById(raw._id).lean();
    table.currentOrder = order || raw;
  }

  return table;
}

router.get('/', async (req, res) => {
  try {
    const tables = await Table.find().sort({ area: 1, name: 1 });
    const result = await Promise.all(tables.map(attachCurrentOrder));
    res.json(result);
  } catch (err) {
    console.error('GET TABLES ERROR:', err);
    res.status(500).json({ message: err.message || 'Không lấy được danh sách bàn' });
  }
});

router.post('/seed-default', async (req, res) => {
  try {
    let createdCount = 0;

    for (const item of defaultTables) {
      const exists = await Table.findOne({ name: item.name });
      if (!exists) {
        await Table.create({ ...item, note: '', customerName: '', currentOrder: null });
        createdCount += 1;
      }
    }

    const tables = await Table.find().sort({ area: 1, name: 1 });
    const result = await Promise.all(tables.map(attachCurrentOrder));
    res.json({ success: true, createdCount, tables: result });
  } catch (err) {
    console.error('SEED TABLES ERROR:', err);
    res.status(500).json({ message: err.message || 'Không tạo được bàn mặc định' });
  }
});

router.post('/', async (req, res) => {
  try {
    const table = await Table.create({
      name: req.body.name || 'Bàn mới',
      area: req.body.area || 'other',
      status: req.body.status || 'empty',
      note: req.body.note || '',
      customerName: req.body.customerName || '',
      currentOrder: null,
    });
    res.json(table);
  } catch (err) {
    res.status(500).json({ message: err.message || 'Không tạo được bàn' });
  }
});

router.put('/:id', async (req, res) => {
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
      { new: true, runValidators: true }
    );

    if (!table) return res.status(404).json({ message: 'Không tìm thấy bàn' });
    res.json(await attachCurrentOrder(table));
  } catch (err) {
    res.status(500).json({ message: err.message || 'Không cập nhật được bàn' });
  }
});

export default router;
