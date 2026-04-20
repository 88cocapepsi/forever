import express from 'express';
import crypto from 'crypto';
import User from '../models/User.js';

const authRouter = express.Router();

function createToken() {
  return crypto.randomBytes(24).toString('hex');
}

async function ensureDefaultAdmin() {
  const adminExists = await User.findOne({ username: 'admin' });

  if (!adminExists) {
    const admin = new User({
      name: 'Admin',
      username: 'admin',
      role: 'admin',
      isActive: true,
    });

    admin.setPassword('123456');
    await admin.save();
    console.log('✅ Default admin created: admin / 123456');
  }
}

// LOGIN
authRouter.post('/login', async (req, res) => {
  try {
    await ensureDefaultAdmin();

    const username = String(req.body?.username || '')
      .trim()
      .toLowerCase();
    const password = String(req.body?.password || '').trim();

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng nhập tài khoản và mật khẩu',
      });
    }

    const user = await User.findOne({ username });

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Sai tài khoản hoặc mật khẩu',
      });
    }

    const ok = user.verifyPassword(password);

    if (!ok) {
      return res.status(401).json({
        success: false,
        message: 'Sai tài khoản hoặc mật khẩu',
      });
    }

    return res.json({
      success: true,
      token: createToken(),
      user: user.toSafeJSON(),
    });
  } catch (error) {
    console.error('POST /api/auth/login error:', error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi đăng nhập',
      error: error.message,
    });
  }
});

// GET USERS
authRouter.get('/users', async (req, res) => {
  try {
    await ensureDefaultAdmin();

    const users = await User.find().sort({ createdAt: -1 });

    return res.json(users.map((user) => user.toSafeJSON()));
  } catch (error) {
    console.error('GET /api/auth/users error:', error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi lấy danh sách tài khoản',
      error: error.message,
    });
  }
});

// CREATE USER
authRouter.post('/users', async (req, res) => {
  try {
    await ensureDefaultAdmin();

    const name = String(req.body?.name || '').trim();
    const username = String(req.body?.username || '')
      .trim()
      .toLowerCase();
    const password = String(req.body?.password || '').trim();
    const role = String(req.body?.role || 'staff').trim().toLowerCase();

    if (!name || !username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng nhập đầy đủ họ tên, tài khoản và mật khẩu',
      });
    }

    if (!['admin', 'staff'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Role không hợp lệ',
      });
    }

    const existed = await User.findOne({ username });

    if (existed) {
      return res.status(400).json({
        success: false,
        message: `Tài khoản "${username}" đã tồn tại`,
      });
    }

    const user = new User({
      name,
      username,
      role,
      isActive: true,
    });

    user.setPassword(password);
    await user.save();

    return res.status(201).json({
      success: true,
      message: 'Tạo tài khoản thành công',
      user: user.toSafeJSON(),
    });
  } catch (error) {
    console.error('POST /api/auth/users error:', error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi tạo tài khoản',
      error: error.message,
    });
  }
});

export { authRouter, ensureDefaultAdmin };
export default authRouter;
