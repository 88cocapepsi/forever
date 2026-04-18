import express from 'express';
import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { signToken } from '../utils/auth.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

export const authRouter = express.Router();

authRouter.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username: String(username || '').trim() });

    if (!user) {
      return res.status(401).json({ message: 'Sai tài khoản hoặc mật khẩu' });
    }

    const ok = await bcrypt.compare(String(password || ''), user.passwordHash);
    if (!ok) {
      return res.status(401).json({ message: 'Sai tài khoản hoặc mật khẩu' });
    }

    const token = signToken(user);
    return res.json({ token, user: { id: user._id, name: user.name, username: user.username, role: user.role } });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Lỗi đăng nhập' });
  }
});

authRouter.get('/me', requireAuth, async (req, res) => {
  res.json({ user: req.user });
});

authRouter.get('/users', requireAuth, requireAdmin, async (_req, res) => {
  const users = await User.find().select('-passwordHash').sort({ createdAt: -1 });
  res.json(users);
});

authRouter.post('/users', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { name, username, password, role } = req.body;
    const existed = await User.findOne({ username: String(username || '').trim() });
    if (existed) {
      return res.status(400).json({ message: 'Tên đăng nhập đã tồn tại' });
    }

    const passwordHash = await bcrypt.hash(String(password || '123456'), 10);
    const user = await User.create({
      name: String(name || '').trim(),
      username: String(username || '').trim(),
      passwordHash,
      role: role === 'admin' ? 'admin' : 'staff'
    });

    res.status(201).json({ id: user._id, name: user.name, username: user.username, role: user.role, isActive: user.isActive });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Không tạo được tài khoản' });
  }
});
