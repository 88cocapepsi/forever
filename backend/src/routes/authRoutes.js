import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { config } from '../config.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const router = express.Router();
const JWT_SECRET = config.jwtSecret || process.env.JWT_SECRET || 'forever-pos-secret';

function signToken(user) {
  return jwt.sign(
    {
      id: user._id.toString(),
      username: user.username,
      role: user.role,
      name: user.name,
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

function safeUser(user) {
  return {
    id: user._id.toString(),
    _id: user._id,
    name: user.name,
    username: user.username,
    role: user.role,
    isActive: user.isActive,
  };
}

export async function ensureDefaultAdmin() {
  const adminName = process.env.DEFAULT_ADMIN_NAME || process.env.SEED_ADMIN_NAME || config.seedAdminName || 'Admin FOREVER';
  const adminUsername = (process.env.DEFAULT_ADMIN_USERNAME || process.env.SEED_ADMIN_USERNAME || config.seedAdminUsername || 'admin').toLowerCase();
  const adminPassword = process.env.DEFAULT_ADMIN_PASSWORD || process.env.SEED_ADMIN_PASSWORD || config.seedAdminPassword || '123456';

  let admin = await User.findOne({ username: adminUsername });

  if (!admin) {
    admin = await User.create({
      name: adminName,
      username: adminUsername,
      password: adminPassword,
      role: 'admin',
      isActive: true,
    });
    console.log(`✅ Default admin created: ${adminUsername}`);
    return admin;
  }

  let changed = false;
  if (!admin.password) {
    admin.password = adminPassword;
    changed = true;
  }
  if (admin.role !== 'admin') {
    admin.role = 'admin';
    changed = true;
  }
  if (admin.isActive === false) {
    admin.isActive = true;
    changed = true;
  }
  if (changed) {
    await admin.save();
    console.log(`✅ Default admin repaired: ${adminUsername}`);
  }

  return admin;
}

router.post('/login', async (req, res) => {
  try {
    const username = String(req.body.username || '').trim().toLowerCase();
    const password = String(req.body.password || '').trim();

    if (!username || !password) {
      return res.status(400).json({ message: 'Nhập tài khoản và mật khẩu' });
    }

    const user = await User.findOne({ username });
    if (!user || user.isActive === false) {
      return res.status(401).json({ message: 'Sai tài khoản hoặc mật khẩu' });
    }

    if (!user.password) {
      return res.status(500).json({ message: 'Tài khoản chưa có mật khẩu trong database' });
    }

    const ok = await user.comparePassword(password);
    if (!ok) {
      return res.status(401).json({ message: 'Sai tài khoản hoặc mật khẩu' });
    }

    res.json({ token: signToken(user), user: safeUser(user) });
  } catch (err) {
    console.error('LOGIN ERROR:', err);
    res.status(500).json({ message: err.message || 'Lỗi đăng nhập' });
  }
});

router.get('/users', requireAuth, requireAdmin, async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 }).select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message || 'Không lấy được danh sách tài khoản' });
  }
});

router.post('/users', requireAuth, requireAdmin, async (req, res) => {
  try {
    const payload = {
      name: req.body.name || '',
      username: String(req.body.username || '').trim().toLowerCase(),
      password: String(req.body.password || '').trim(),
      role: req.body.role || 'staff',
      isActive: req.body.isActive !== false,
    };

    if (!payload.username || !payload.password) {
      return res.status(400).json({ message: 'Thiếu tài khoản hoặc mật khẩu' });
    }

    const exists = await User.findOne({ username: payload.username });
    if (exists) {
      return res.status(409).json({ message: 'Tài khoản đã tồn tại' });
    }

    const user = await User.create(payload);
    const result = await User.findById(user._id).select('-password');
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message || 'Không tạo được tài khoản' });
  }
});

export default router;
