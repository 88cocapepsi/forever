import express from 'express';
import Product from '../models/Product.js';
import InventoryLog from '../models/InventoryLog.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', requireAuth, async (req, res) => {
  try {
    const products = await Product.find().sort({ category: 1, name: 1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message || 'Không lấy được sản phẩm' });
  }
});

router.post('/', requireAuth, requireAdmin, async (req, res) => {
  try {
    const payload = {
      name: req.body.name || '',
      category: req.body.category || 'Khác',
      price: Number(req.body.price || 0),
      stock: Number(req.body.stock || 0),
      unit: req.body.unit || 'ly',
      isActive: req.body.isActive !== false,
    };

    if (!payload.name.trim()) return res.status(400).json({ message: 'Thiếu tên món' });

    const product = await Product.create(payload);
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message || 'Không tạo được sản phẩm' });
  }
});

router.put('/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    const payload = {
      name: req.body.name,
      category: req.body.category,
      price: Number(req.body.price || 0),
      stock: Number(req.body.stock || 0),
      unit: req.body.unit,
      isActive: req.body.isActive !== false,
    };

    const product = await Product.findByIdAndUpdate(req.params.id, payload, {
      new: true,
      runValidators: true,
    });

    if (!product) return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message || 'Không cập nhật được sản phẩm' });
  }
});

router.post('/:id/import', requireAuth, requireAdmin, async (req, res) => {
  try {
    const quantity = Number(req.body.quantity || 0);
    if (quantity <= 0) return res.status(400).json({ message: 'Số lượng nhập không hợp lệ' });

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });

    product.stock = Number(product.stock || 0) + quantity;
    await product.save();

    try {
      await InventoryLog.create({
        product: product._id,
        productName: product.name,
        type: 'import',
        quantity,
        note: req.body.note || 'Nhập kho',
        createdBy: req.user?._id || null,
      });
    } catch (logErr) {
      console.warn('CREATE INVENTORY LOG WARNING:', logErr.message);
    }

    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message || 'Không nhập kho được' });
  }
});

router.get('/inventory/logs', requireAuth, requireAdmin, async (req, res) => {
  try {
    const logs = await InventoryLog.find().sort({ createdAt: -1 }).limit(100);
    res.json(logs);
  } catch {
    res.json([]);
  }
});

export default router;
