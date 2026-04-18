import express from 'express';
import { Product } from '../models/Product.js';
import { InventoryLog } from '../models/InventoryLog.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

export const productRouter = express.Router();

productRouter.get('/', requireAuth, async (_req, res) => {
  const products = await Product.find().sort({ category: 1, name: 1 });
  res.json(products);
});

productRouter.post('/', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { name, category, price, stock, unit } = req.body;
    const trimmedName = String(name || '').trim();
    if (!trimmedName) {
      return res.status(400).json({ message: 'Tên món không được để trống' });
    }

    const product = await Product.create({
      name: trimmedName,
      category: String(category || 'Khác').trim(),
      price: Number(price || 0),
      stock: Number(stock || 0),
      unit: unit || 'ly'
    });

    if (Number(stock || 0) > 0) {
      await InventoryLog.create({
        product: product._id,
        productName: product.name,
        type: 'import',
        quantity: Number(stock),
        note: 'Tồn kho ban đầu',
        createdBy: req.user._id
      });
    }

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Không tạo được sản phẩm' });
  }
});

productRouter.put('/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    const current = await Product.findById(req.params.id);
    if (!current) return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });

    const nextStock = Number(req.body.stock);
    const stockDelta = Number.isFinite(nextStock) ? nextStock - Number(current.stock || 0) : 0;

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name: String(req.body.name || current.name).trim(),
        category: String(req.body.category || current.category).trim(),
        price: Number(req.body.price ?? current.price),
        stock: Number.isFinite(nextStock) ? nextStock : current.stock,
        unit: req.body.unit || current.unit,
        isActive: typeof req.body.isActive === 'boolean' ? req.body.isActive : current.isActive
      },
      { new: true }
    );

    if (stockDelta !== 0) {
      await InventoryLog.create({
        product: product._id,
        productName: product.name,
        type: 'adjustment',
        quantity: stockDelta,
        note: 'Điều chỉnh tồn kho từ giao diện admin',
        createdBy: req.user._id
      });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Không cập nhật được sản phẩm' });
  }
});

productRouter.post('/:id/import', requireAuth, requireAdmin, async (req, res) => {
  try {
    const quantity = Number(req.body.quantity || 0);
    const note = String(req.body.note || 'Nhập kho');
    if (quantity <= 0) {
      return res.status(400).json({ message: 'Số lượng nhập phải lớn hơn 0' });
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    }

    product.stock += quantity;
    await product.save();

    await InventoryLog.create({
      product: product._id,
      productName: product.name,
      type: 'import',
      quantity,
      note,
      createdBy: req.user._id
    });

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Không nhập kho được' });
  }
});

productRouter.get('/inventory/logs', requireAuth, requireAdmin, async (_req, res) => {
  const logs = await InventoryLog.find().sort({ createdAt: -1 }).limit(200);
  res.json(logs);
});
