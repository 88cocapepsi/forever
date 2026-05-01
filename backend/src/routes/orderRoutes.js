import express from 'express';
import mongoose from 'mongoose';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Table from '../models/Table.js';
import User from '../models/User.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

async function getActorUserId(req) {
  if (req.user?._id) return req.user._id;
  if (req.user?.id && mongoose.Types.ObjectId.isValid(req.user.id)) return req.user.id;

  const admin =
    (await User.findOne({ username: 'admin' })) ||
    (await User.findOne({ role: 'admin' })) ||
    (await User.findOne());

  return admin?._id || null;
}

function calcSubtotal(items = []) {
  return items.reduce(
    (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0),
    0
  );
}

function isObjectIdLike(value) {
  if (!value) return false;
  if (typeof value === 'string') return mongoose.Types.ObjectId.isValid(value);
  if (value instanceof mongoose.Types.ObjectId) return true;
  return false;
}

router.get('/history', requireAuth, async (req, res) => {
  try {
    const limit = Math.min(Number(req.query.limit || 100), 500);
    const orders = await Order.find({ status: 'paid' })
      .sort({ paidAt: -1, createdAt: -1 })
      .limit(limit)
      .lean();
    res.json(orders);
  } catch (err) {
    console.error('ORDER HISTORY ERROR:', err);
    res.status(500).json({ message: err.message || 'Không lấy được lịch sử đơn' });
  }
});

router.post('/table/:tableId/open', requireAuth, async (req, res) => {
  try {
    const { tableId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(tableId)) {
      return res.status(400).json({ message: 'tableId không hợp lệ' });
    }

    const table = await Table.findById(tableId);
    if (!table) return res.status(404).json({ message: 'Không tìm thấy bàn' });

    let order = null;

    if (isObjectIdLike(table.currentOrder)) {
      order = await Order.findById(table.currentOrder);
      if (order && order.status === 'open') return res.json(order);
    } else if (
      table.currentOrder &&
      typeof table.currentOrder === 'object' &&
      table.currentOrder._id &&
      mongoose.Types.ObjectId.isValid(table.currentOrder._id)
    ) {
      order = await Order.findById(table.currentOrder._id);
      if (order && order.status === 'open') return res.json(order);
    }

    order = await Order.findOne({ table: tableId, status: 'open' }).sort({ createdAt: -1 });
    if (order) {
      table.currentOrder = order._id.toString();
      table.status = 'serving';
      await table.save();
      return res.json(order);
    }

    const openedBy = await getActorUserId(req);
    if (!openedBy) {
      return res.status(500).json({ message: 'Không tìm thấy user admin để tạo đơn' });
    }

    order = await Order.create({
      table: table._id,
      tableName: table.name,
      items: [],
      subtotal: 0,
      total: 0,
      discount: 0,
      status: 'open',
      openedBy,
      paidBy: null,
      paidAt: null,
    });

    table.currentOrder = order._id.toString();
    table.status = 'serving';
    await table.save();

    res.json(order);
  } catch (err) {
    console.error('OPEN ORDER ERROR:', err);
    res.status(500).json({ message: err.message || 'Không mở được đơn' });
  }
});

router.get('/:id', requireAuth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Không tìm thấy đơn' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message || 'Không lấy được đơn' });
  }
});

router.post('/:orderId/items', requireAuth, async (req, res) => {
  try {
    const { productId } = req.body;
    const quantity = Math.max(1, Number(req.body.quantity || 1));

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: 'productId không hợp lệ' });
    }

    const order = await Order.findById(req.params.orderId);
    if (!order) return res.status(404).json({ message: 'Không tìm thấy đơn' });
    if (order.status !== 'open') return res.status(400).json({ message: 'Đơn đã đóng, không thể thêm món' });

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Không tìm thấy món' });

    const existing = order.items.find((item) => String(item.product) === String(productId));
    if (existing) {
      existing.quantity += quantity;
    } else {
      order.items.push({
        product: product._id,
        name: product.name,
        price: Number(product.price || 0),
        quantity,
      });
    }

    product.stock = Math.max(0, Number(product.stock || 0) - quantity);
    await product.save();

    order.subtotal = calcSubtotal(order.items);
    order.total = Math.max(0, order.subtotal - Number(order.discount || 0));
    await order.save();

    await Table.findByIdAndUpdate(order.table, {
      currentOrder: order._id.toString(),
      status: 'serving',
    });

    res.json(order);
  } catch (err) {
    console.error('ADD ITEM ERROR:', err);
    res.status(500).json({ message: err.message || 'Không thêm món được' });
  }
});

router.put('/:orderId/items/:productId', requireAuth, async (req, res) => {
  try {
    const quantity = Number(req.body.quantity || 0);
    const order = await Order.findById(req.params.orderId);
    if (!order) return res.status(404).json({ message: 'Không tìm thấy đơn' });

    const item = order.items.find((i) => String(i.product) === String(req.params.productId));
    if (!item) return res.status(404).json({ message: 'Không tìm thấy món trong đơn' });

    item.quantity = quantity;
    order.items = order.items.filter((i) => Number(i.quantity || 0) > 0);
    order.subtotal = calcSubtotal(order.items);
    order.total = Math.max(0, order.subtotal - Number(order.discount || 0));
    await order.save();

    res.json(order);
  } catch (err) {
    console.error('UPDATE ITEM ERROR:', err);
    res.status(500).json({ message: err.message || 'Không cập nhật món được' });
  }
});

router.post('/:orderId/pay', requireAuth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) return res.status(404).json({ message: 'Không tìm thấy đơn' });

    const paidBy = await getActorUserId(req);
    order.status = 'paid';
    order.paidAt = new Date();
    order.paidBy = paidBy;
    order.subtotal = calcSubtotal(order.items);
    order.total = Math.max(0, order.subtotal - Number(order.discount || 0));
    await order.save();

    await Table.findByIdAndUpdate(order.table, {
      currentOrder: null,
      status: 'empty',
    });

    res.json(order);
  } catch (err) {
    console.error('PAY ORDER ERROR:', err);
    res.status(500).json({ message: err.message || 'Không thanh toán được' });
  }
});

export default router;
