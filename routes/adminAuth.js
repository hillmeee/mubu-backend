const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Wallet = require("../models/Wallet");
const Notification = require("../models/Notification");

// ✅ Test endpoint: Şifresiz erişim — sadece veri çekmeyi dener
router.get("/test", async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const totalWallets = await Wallet.countDocuments();
    const notifCount = await Notification.countDocuments();

    res.json({
      success: true,
      users: userCount,
      wallets: totalWallets,
      notifications: notifCount,
      message: "✅ Veritabanı bağlantısı başarılı!"
    });
  } catch (err) {
    console.error("DB test hatası:", err);
    res.status(500).json({ success: false, message: "Veritabanı bağlantı hatası" });
  }
});

module.exports = router;
