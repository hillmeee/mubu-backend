const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Wallet = require("../models/Wallet");
const Notification = require("../models/Notification");

// ✅ Basit test endpoint (şifresiz veri çekme)
router.get("/test", async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const walletCount = await Wallet.countDocuments();
    const notifCount = await Notification.countDocuments();

    res.json({
      success: true,
      users: userCount,
      wallets: walletCount,
      notifications: notifCount,
      message: "✅ Veritabanı bağlantısı başarılı!",
    });
  } catch (err) {
    console.error("DB test hatası:", err);
    res.status(500).json({
      success: false,
      message: "Veritabanı bağlantı hatası",
      error: err.message,
    });
  }
});

module.exports = router;
