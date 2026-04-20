import express from 'express';
import crypto from 'crypto';
import User from '../models/User.js';

const authRouter = express.Router();

function createToken() {
  return crypto.randomBytes(24).toString('hex');
}

function sanitizeUser(user) {
  if (!user) return null;

  if (typeof user.toSafeJSON === 'function') {
    return user.toSafeJSON();
  }

  return {
    id: user._id?.toString?.() || String(user._id || ''),
    _id: user._id?.toString?.() || String(user._id || ''),
    name: user.name || '',
    username: user.username || '',
    role: user.role || 'staff',
    isActive: user.isActive !== false,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

async function ensureDefaultAdmin() {
  let admin = await User.findOne({ username: 'admin' });

  if (!admin) {
    admin = new User({
      name: 'Admin',
      username: 'admin',
      role: 'admin',
      isActive: true,
    });

    admin.setPassword('123456');
    await admin.save();

    console.log('✅ Default admin created: admin / 123456');
    return admin;
  }

  // Tự sửa admin cũ nếu thiếu passwordSalt/passwordHash
  if (!admin.passwordSalt || !admin.passwordHash) {
    admin.setPassword('123456');
    admin.name = admin.name || 'Admin';
    admin.role = admin.role || 'admin';
    admin.isActive = admin.isActive !== false;
    await admin.save();

    console.log('✅ Default admin repaired: admin / 123456');
  }

  return admin;
}

// LOGIN
authRouter.post('/login', async (req, res) => {
  try {
    await ensureDefaultAdmin();

    const username = String(req.body?.username || '').trim().toLowerCase();
    const password = String(req.body?.password || '').trim();

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng nhập tài khoản và mật khẩu',
      });
    }

    const user = await User.findOne({ username });

    if (!user || user.isActive === false) {
      return res.status(401).json({
        success: false,
        message: 'Sai tài khoản hoặc mật khẩu',
      });
    }

    // Tự sửa user cũ nếu thiếu salt/hash
    if (!user.passwordSalt || !user.passwordHash) {
      if (user.username === 'admin') {
        user.setPassword('123456');
        await user.save();
      } else {
        return res.status(500).json({
          success: false,
          message: 'Tài khoản này đang thiếu dữ liệu bảo mật. Hãy tạo lại tài khoản.',
        });
      }
    }

    const validPassword =
      typeof user.verifyPassword === 'function'
        ? user.verifyPassword(password)
        : false;

    if (!validPassword) {
      return res.status(401).json({
        success: false,
        message: 'Sai tài khoản hoặc mật khẩu',
      });
    }

    return res.json({
      success: true,
      token: createToken(),
      user: sanitizeUser(user),
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

// GET ALL USERS
authRouter.get('/users', async (req, res) => {
  try {
    await ensureDefaultAdmin();

    const users = await User.find().sort({ createdAt: -1 });

    return res.json(users.map((user) => sanitizeUser(user)));
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
    const username = String(req.body?.username || '').trim().toLowerCase();
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
      user: sanitizeUser(user),
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
