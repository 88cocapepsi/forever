import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || "forever-pos-secret";

function signToken(user) {
  return jwt.sign(
    {
      id: user._id,
      username: user.username,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
}

function safeUser(user) {
  return {
    id: user._id,
    _id: user._id,
    name: user.name,
    username: user.username,
    role: user.role,
    isActive: user.isActive,
  };
}

export async function ensureDefaultAdmin() {
  const adminUsername = process.env.DEFAULT_ADMIN_USERNAME || "admin";
  const adminPassword = process.env.DEFAULT_ADMIN_PASSWORD || "123456";

  const existing = await User.findOne({ username: adminUsername.toLowerCase() });

  if (!existing) {
    await User.create({
      name: "Admin",
      username: adminUsername.toLowerCase(),
      password: adminPassword,
      role: "admin",
      isActive: true,
    });

    console.log(`✅ Default admin created: ${adminUsername}`);
  }
}

router.post("/login", async (req, res) => {
  try {
    const username = String(req.body.username || "").trim().toLowerCase();
    const password = String(req.body.password || "").trim();

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ message: "Sai tài khoản hoặc mật khẩu" });
    }

    if (user.isActive === false) {
      return res.status(403).json({ message: "Tài khoản đã bị khóa" });
    }

    const ok = await user.comparePassword(password);

    if (!ok) {
      return res.status(401).json({ message: "Sai tài khoản hoặc mật khẩu" });
    }

    res.json({
      token: signToken(user),
      user: safeUser(user),
    });
  } catch (err) {
    res.status(500).json({ message: err.message || "Lỗi đăng nhập" });
  }
});

router.get("/users", async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 }).select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message || "Không lấy được danh sách tài khoản" });
  }
});

router.post("/users", async (req, res) => {
  try {
    const payload = {
      name: req.body.name || "",
      username: String(req.body.username || "").trim().toLowerCase(),
      password: String(req.body.password || "").trim(),
      role: req.body.role || "staff",
      isActive: req.body.isActive !== false,
    };

    if (!payload.username || !payload.password) {
      return res.status(400).json({ message: "Thiếu tài khoản hoặc mật khẩu" });
    }

    const exists = await User.findOne({ username: payload.username });

    if (exists) {
      return res.status(409).json({ message: "Tài khoản đã tồn tại" });
    }

    const user = await User.create(payload);
    const result = await User.findById(user._id).select("-password");

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message || "Không tạo được tài khoản" });
  }
});

export default router;
