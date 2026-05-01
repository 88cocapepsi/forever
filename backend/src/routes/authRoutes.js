import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

// =============================
// 🔐 LOGIN
// =============================
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Thiếu username hoặc password",
      });
    }

    const user = await User.findOne({
      username: username.toLowerCase(),
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Sai tài khoản hoặc mật khẩu",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password || "");

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Sai tài khoản hoặc mật khẩu",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET || "forever-secret",
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        username: user.username,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("❌ LOGIN ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Lỗi server",
    });
  }
});

// =============================
// 👤 GET CURRENT USER
// =============================
router.get("/me", async (req, res) => {
  try {
    const auth = req.headers.authorization;

    if (!auth) {
      return res.status(401).json({ success: false });
    }

    const token = auth.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "forever-secret"
    );

    const user = await User.findById(decoded.id).select("-password");

    res.json({
      success: true,
      user,
    });
  } catch (err) {
    res.status(401).json({ success: false });
  }
});

// =============================
// 👥 CREATE USER (ADMIN)
// =============================
router.post("/users", async (req, res) => {
  try {
    const { name, username, password, role } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Thiếu dữ liệu",
      });
    }

    const exist = await User.findOne({
      username: username.toLowerCase(),
    });

    if (exist) {
      return res.status(400).json({
        success: false,
        message: "Username đã tồn tại",
      });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      username: username.toLowerCase(),
      password: hashed,
      role: role || "staff",
    });

    res.json({
      success: true,
      user,
    });
  } catch (err) {
    console.error("❌ CREATE USER ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Lỗi server",
    });
  }
});

// =============================
// 👥 GET USERS
// =============================
router.get("/users", async (req, res) => {
  try {
    const users = await User.find().select("-password");

    res.json({
      success: true,
      data: users,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
    });
  }
});

// =============================
// 🔥 AUTO CREATE ADMIN
// =============================
export async function ensureDefaultAdmin() {
  try {
    const adminUsername =
      process.env.DEFAULT_ADMIN_USERNAME || "admin";
    const adminPassword =
      process.env.DEFAULT_ADMIN_PASSWORD || "123456";

    let existing = await User.findOne({
      username: adminUsername.toLowerCase(),
    });

    if (!existing) {
      const hashed = await bcrypt.hash(adminPassword, 10);

      await User.create({
        name: "Admin FOREVER",
        username: adminUsername.toLowerCase(),
        password: hashed,
        role: "admin",
      });

      console.log("✅ Default admin created");
      return;
    }

    if (!existing.password) {
      existing.password = await bcrypt.hash(adminPassword, 10);
      existing.role = existing.role || "admin";
      await existing.save();

      console.log("✅ Default admin repaired");
    }
  } catch (err) {
    console.error("❌ ensureDefaultAdmin ERROR:", err);
  }
}

// =============================
export default router;
