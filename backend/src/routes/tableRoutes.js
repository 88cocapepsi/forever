import express from 'express';
import Table from '../models/Table.js';

const tableRouter = express.Router();

function buildDefaultTables() {
  return [
    // 6 bàn phía trước
    { name: 'Bàn 1', area: 'front', status: 'empty' },
    { name: 'Bàn 2', area: 'front', status: 'empty' },
    { name: 'Bàn 3', area: 'front', status: 'empty' },
    { name: 'Bàn 4', area: 'front', status: 'empty' },
    { name: 'Bàn 5', area: 'front', status: 'empty' },
    { name: 'Bàn 6', area: 'front', status: 'empty' },

    // 4 bàn phía sau
    { name: 'Bàn 7', area: 'back', status: 'empty' },
    { name: 'Bàn 8', area: 'back', status: 'empty' },
    { name: 'Bàn 9', area: 'back', status: 'empty' },
    { name: 'Bàn 10', area: 'back', status: 'empty' },

    // 4 bàn VIP
    { name: 'VIP 1', area: 'vip', status: 'empty' },
    { name: 'VIP 2', area: 'vip', status: 'empty' },
    { name: 'VIP 3', area: 'vip', status: 'empty' },
    { name: 'VIP 4', area: 'vip', status: 'empty' },

    // Khác
    { name: 'Mang về', area: 'other', status: 'empty' },
    { name: 'Giao đi', area: 'other', status: 'empty' },
  ];
}

// GET ALL TABLES
tableRouter.get('/', async (req, res) => {
  try {
    const tables = await Table.find().sort({ createdAt: 1, name: 1 });
    res.json(tables);
  } catch (error) {
    console.error('GET /tables error:', error);
    res.status(500).json({
      message: 'Lỗi lấy danh sách bàn',
      error: error.message,
    });
  }
});

// GET ONE TABLE
tableRouter.get('/:id', async (req, res) => {
  try {
    const table = await Table.findById(req.params.id);

    if (!table) {
      return res.status(404).json({ message: 'Không tìm thấy bàn' });
    }

    res.json(table);
  } catch (error) {
    console.error('GET /tables/:id error:', error);
    res.status(500).json({
      message: 'Lỗi lấy thông tin bàn',
      error: error.message,
    });
  }
});

// CREATE ONE TABLE
tableRouter.post('/', async (req, res) => {
  try {
    const { name, area, status, note, customerName, currentOrder } = req.body;

    if (!name || !String(name).trim()) {
      return res.status(400).json({ message: 'Tên bàn là bắt buộc' });
    }

    const cleanName = String(name).trim();

    const existed = await Table.findOne({ name: cleanName });
    if (existed) {
      return res.status(400).json({ message: `Bàn "${cleanName}" đã tồn tại` });
    }

    const newTable = await Table.create({
      name: cleanName,
      area: area || 'other',
      status: status || 'empty',
      note: note || '',
      customerName: customerName || '',
      currentOrder: currentOrder || {
        items: [],
        subtotal: 0,
        discount: 0,
        total: 0,
        updatedAt: new Date(),
      },
    });

    res.status(201).json(newTable);
  } catch (error) {
    console.error('POST /tables error:', error);
    res.status(500).json({
      message: 'Lỗi tạo bàn',
      error: error.message,
    });
  }
});

// SEED DEFAULT TABLES
tableRouter.post('/seed-default', async (req, res) => {
  try {
    const defaultTables = buildDefaultTables();

    const existingTables = await Table.find({}, { name: 1 });
    const existingNames = new Set(existingTables.map((t) => t.name));

    const missingTables = defaultTables.filter((table) => !existingNames.has(table.name));

    let insertedTables = [];
    if (missingTables.length > 0) {
      insertedTables = await Table.insertMany(missingTables);
    }

    const allTables = await Table.find().sort({ createdAt: 1, name: 1 });

    res.json({
      success: true,
      message:
        insertedTables.length > 0
          ? `Đã thêm ${insertedTables.length} bàn mặc định còn thiếu`
          : 'Tất cả bàn mặc định đã tồn tại, không có gì để thêm',
      insertedCount: insertedTables.length,
      insertedTables,
      tables: allTables,
    });
  } catch (error) {
    console.error('POST /tables/seed-default error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi tạo bàn mặc định',
      error: error.message,
    });
  }
});

// RESET DEFAULT TABLES
tableRouter.post('/reset-default', async (req, res) => {
  try {
    const defaultTables = buildDefaultTables();

    await Table.deleteMany({});
    const insertedTables = await Table.insertMany(defaultTables);

    res.json({
      success: true,
      message: 'Đã reset toàn bộ danh sách bàn về mặc định',
      insertedCount: insertedTables.length,
      tables: insertedTables,
    });
  } catch (error) {
    console.error('POST /tables/reset-default error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi reset bàn mặc định',
      error: error.message,
    });
  }
});

// UPDATE TABLE
tableRouter.put('/:id', async (req, res) => {
  try {
    const { name, area, status, note, currentOrder, customerName } = req.body;

    const table = await Table.findById(req.params.id);
    if (!table) {
      return res.status(404).json({ message: 'Không tìm thấy bàn' });
    }

    if (name !== undefined) {
      const cleanName = String(name).trim();

      if (!cleanName) {
        return res.status(400).json({ message: 'Tên bàn không được để trống' });
      }

      if (cleanName !== table.name) {
        const existed = await Table.findOne({
          name: cleanName,
          _id: { $ne: req.params.id },
        });

        if (existed) {
          return res.status(400).json({ message: `Bàn "${cleanName}" đã tồn tại` });
        }
      }

      table.name = cleanName;
    }

    if (area !== undefined) table.area = area;
    if (status !== undefined) table.status = status;
    if (note !== undefined) table.note = note;
    if (customerName !== undefined) table.customerName = customerName;
    if (currentOrder !== undefined) table.currentOrder = currentOrder;

    const updatedTable = await table.save();
    res.json(updatedTable);
  } catch (error) {
    console.error('PUT /tables/:id error:', error);
    res.status(500).json({
      message: 'Lỗi cập nhật bàn',
      error: error.message,
    });
  }
});

// UPDATE TABLE STATUS ONLY
tableRouter.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;

    const table = await Table.findById(req.params.id);
    if (!table) {
      return res.status(404).json({ message: 'Không tìm thấy bàn' });
    }

    table.status = status || 'empty';

    const updatedTable = await table.save();
    res.json(updatedTable);
  } catch (error) {
    console.error('PATCH /tables/:id/status error:', error);
    res.status(500).json({
      message: 'Lỗi cập nhật trạng thái bàn',
      error: error.message,
    });
  }
});

// CLEAR CURRENT ORDER OF TABLE
tableRouter.patch('/:id/clear-order', async (req, res) => {
  try {
    const table = await Table.findById(req.params.id);
    if (!table) {
      return res.status(404).json({ message: 'Không tìm thấy bàn' });
    }

    table.currentOrder = {
      items: [],
      subtotal: 0,
      discount: 0,
      total: 0,
      updatedAt: new Date(),
    };
    table.customerName = '';
    table.note = '';
    table.status = 'empty';

    const updatedTable = await table.save();
    res.json(updatedTable);
  } catch (error) {
    console.error('PATCH /tables/:id/clear-order error:', error);
    res.status(500).json({
      message: 'Lỗi xóa đơn hiện tại của bàn',
      error: error.message,
    });
  }
});

// DELETE TABLE
tableRouter.delete('/:id', async (req, res) => {
  try {
    const table = await Table.findById(req.params.id);

    if (!table) {
      return res.status(404).json({ message: 'Không tìm thấy bàn' });
    }

    await Table.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Đã xóa bàn thành công',
    });
  } catch (error) {
    console.error('DELETE /tables/:id error:', error);
    res.status(500).json({
      message: 'Lỗi xóa bàn',
      error: error.message,
    });
  }
});

export { tableRouter };
export default tableRouter;
