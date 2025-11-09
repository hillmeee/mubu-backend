const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Wallet = require("../models/Wallet");
const Notification = require("../models/Notification");
const authMiddleware = require("../middleware/authMiddleware"); // ✅ Token kontrolü

// 🔐 Admin Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1️⃣ Kullanıcıyı e-posta ile bul
    const admin = await User.findOne({ email, role: "admin" });
    if (!admin)
      return res
        .status(404)
        .json({ success: false, message: "Admin bulunamadı veya yetkiniz yok." });

    // 2️⃣ Şifre kontrolü
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch)
      return res
        .status(400)
        .json({ success: false, message: "Şifre hatalı." });

    // 3️⃣ Token oluştur
    const token = jwt.sign(
      {
        userId: admin._id,
        email: admin.email,
        role: admin.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      message: "Giriş başarılı.",
      token,
      user: {
        name: admin.name,
        email: admin.email,
      },
    });
  } catch (err) {
    console.error("Admin login hatası:", err);
    res.status(500).json({ success: false, message: "Sunucu hatası." });
  }
});

// 🧠 Korunan Dashboard endpoint
router.get("/dashboard", authMiddleware, async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const walletCount = await Wallet.countDocuments();
    const notifCount = await Notification.countDocuments();

    res.json({
      success: true,
      users: userCount,
      wallets: walletCount,
      notifications: notifCount,
      message: "✅ Dashboard verisi başarıyla alındı.",
    });
  } catch (err) {
    console.error("Dashboard hatası:", err);
    res.status(500).json({
      success: false,
      message: "Veritabanı bağlantı hatası",
      error: err.message,
    });
  }
});

module.exports = router;
