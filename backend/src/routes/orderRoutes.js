import express from 'express';
import mongoose from 'mongoose';
import { requireAuth } from '../middleware/auth.js';
import { Order } from '../models/Order.js';
import { PosTable } from '../models/Table.js';
import { Product } from '../models/Product.js';
import { InventoryLog } from '../models/InventoryLog.js';

export const orderRouter = express.Router();

function recalcSubtotal(order) {
  order.subtotal = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  return order;
}

orderRouter.get('/open', requireAuth, async (_req, res) => {
  const orders = await Order.find({ status: 'open' }).sort({ updatedAt: -1 });
  res.json(orders);
});

orderRouter.get('/history', requireAuth, async (req, res) => {
  const limit = Math.min(Number(req.query.limit || 50), 200);
  const orders = await Order.find({ status: 'paid' }).sort({ paidAt: -1 }).limit(limit);
  res.json(orders);
});

orderRouter.post('/table/:tableId/open', requireAuth, async (req, res) => {
  try {
    const table = await PosTable.findById(req.params.tableId);
    if (!table) return res.status(404).json({ message: 'Không tìm thấy bàn' });

    if (table.currentOrder) {
      const currentOrder = await Order.findById(table.currentOrder);
      if (currentOrder && currentOrder.status === 'open') {
        return res.json(currentOrder);
      }
    }

    const order = await Order.create({ table: table._id, openedBy: req.user._id, items: [], subtotal: 0 });
    table.currentOrder = order._id;
    await table.save();
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Không mở được đơn' });
  }
});

orderRouter.get('/:orderId', requireAuth, async (req, res) => {
  const order = await Order.findById(req.params.orderId);
  if (!order) return res.status(404).json({ message: 'Không tìm thấy đơn' });
  res.json(order);
});

orderRouter.post('/:orderId/items', requireAuth, async (req, res) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const { productId, quantity } = req.body;
    const qty = Number(quantity || 1);
    if (qty <= 0) throw new Error('Số lượng phải lớn hơn 0');

    const order = await Order.findById(req.params.orderId).session(session);
    if (!order || order.status !== 'open') throw new Error('Đơn không tồn tại hoặc đã đóng');

    const product = await Product.findById(productId).session(session);
    if (!product || !product.isActive) throw new Error('Sản phẩm không tồn tại hoặc đã ngừng bán');
    if (product.stock < qty) throw new Error(`Tồn kho không đủ cho ${product.name}`);

    const existed = order.items.find((item) => item.product.toString() === product._id.toString());
    if (existed) {
      existed.quantity += qty;
    } else {
      order.items.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: qty
      });
    }

    product.stock -= qty;
    await product.save({ session });
    order.subtotal = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    await order.save({ session });

    await InventoryLog.create([
      {
        product: product._id,
        productName: product.name,
        type: 'sale',
        quantity: -qty,
        note: `Bán hàng cho đơn ${order._id}`,
        createdBy: req.user._id
      }
    ], { session });

    await session.commitTransaction();
    res.json(order);
  } catch (error) {
    await session.abortTransaction();
    res.status(400).json({ message: error.message || 'Không thêm món được' });
  } finally {
    session.endSession();
  }
});

orderRouter.put('/:orderId/items/:productId', requireAuth, async (req, res) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const nextQty = Number(req.body.quantity || 0);
    if (nextQty < 0) throw new Error('Số lượng không hợp lệ');

    const order = await Order.findById(req.params.orderId).session(session);
    if (!order || order.status !== 'open') throw new Error('Đơn không tồn tại hoặc đã đóng');

    const product = await Product.findById(req.params.productId).session(session);
    if (!product) throw new Error('Không tìm thấy sản phẩm');

    const item = order.items.find((it) => it.product.toString() === req.params.productId);
    if (!item) throw new Error('Không tìm thấy món trong đơn');

    const delta = nextQty - item.quantity;
    if (delta > 0 && product.stock < delta) throw new Error(`Tồn kho không đủ cho ${product.name}`);

    product.stock -= delta;
    await product.save({ session });

    if (nextQty === 0) {
      order.items = order.items.filter((it) => it.product.toString() !== req.params.productId);
    } else {
      item.quantity = nextQty;
    }

    await recalcSubtotal(order);
    await order.save({ session });

    await InventoryLog.create([
      {
        product: product._id,
        productName: product.name,
        type: 'adjustment',
        quantity: -delta,
        note: `Điều chỉnh đơn ${order._id}`,
        createdBy: req.user._id
      }
    ], { session });

    await session.commitTransaction();
    res.json(order);
  } catch (error) {
    await session.abortTransaction();
    res.status(400).json({ message: error.message || 'Không cập nhật món được' });
  } finally {
    session.endSession();
  }
});

orderRouter.post('/:orderId/pay', requireAuth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order || order.status !== 'open') {
      return res.status(404).json({ message: 'Không tìm thấy đơn đang mở' });
    }

    order.status = 'paid';
    order.paidBy = req.user._id;
    order.paidAt = new Date();
    await order.save();

    await PosTable.findOneAndUpdate({ currentOrder: order._id }, { currentOrder: null });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Không thanh toán được' });
  }
});
