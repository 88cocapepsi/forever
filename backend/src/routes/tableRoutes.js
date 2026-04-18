import express from 'express';
import { PosTable } from '../models/Table.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

export const tableRouter = express.Router();

tableRouter.get('/', requireAuth, async (_req, res) => {
  const tables = await PosTable.find().populate('currentOrder').sort({ zone: 1, name: 1 });
  res.json(tables);
});

tableRouter.post('/seed-default', requireAuth, requireAdmin, async (_req, res) => {
  const defaults = [
    ...Array.from({ length: 6 }, (_, i) => ({ name: `Bàn ${i + 1}`, zone: 'Sảnh trước', type: 'table' })),
    ...Array.from({ length: 4 }, (_, i) => ({ name: `Bàn ${i + 7}`, zone: 'Sau công viên', type: 'table' })),
    { name: 'Mang về', zone: 'Khác', type: 'takeaway' },
    { name: 'Giao đi', zone: 'Khác', type: 'delivery' }
  ];

  for (const item of defaults) {
    const existed = await PosTable.findOne({ name: item.name });
    if (!existed) {
      await PosTable.create(item);
    }
  }

  const tables = await PosTable.find().sort({ zone: 1, name: 1 });
  res.json(tables);
});
