// 📁 C:\Users\ahmet\admins\mubu-backend\routes\adminRoutes.js

const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Wallet = require("../models/Wallet");
const PiggyBank = require("../models/PiggyBank");
const Notification = require("../models/Notification");
const authorizeRoles = require("../middleware/authorizeRoles");
const authMiddleware = require("../middleware/authMiddleware");

// ✅ 1. Genel Dashboard verileri
router.get("/overview", authMiddleware, authorizeRoles("admin"), async (req, res) => {
  try {
    const users = await User.countDocuments();
    const wallets = await Wallet.countDocuments();
    const piggybanks = await PiggyBank.countDocuments();
    const notifications = await Notification.countDocuments();

    // Son 10 bildirim
    const recentNotifications = await Notification.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate("userId", "name phone role");

    res.json({
      success: true,
      data: {
        users,
        wallets,
        piggybanks,
        notifications,
        recentNotifications,
      },
    });
  } catch (err) {
    console.error("❌ Admin overview error:", err);
    res.status(500).json({ success: false, message: "Server error." });
  }
});

// ✅ 2. Tüm kullanıcıları getir
router.get("/users", authMiddleware, authorizeRoles("admin"), async (req, res) => {
  try {
    const users = await User.find()
      .select("name phone role verified createdAt isBanned")
      .sort({ createdAt: -1 });
    res.json({ success: true, users });
  } catch (err) {
    console.error("❌ Admin users fetch error:", err);
    res.status(500).json({ success: false, message: "Server error." });
  }
});

// 📊 Admin Dashboard Stats
router.get("/stats", authMiddleware, authorizeRoles("admin"), async (req, res) => {
  try {
    const users = await User.countDocuments();
    const wallets = await Wallet.countDocuments();
    const notifications = await Notification.countDocuments();
    const piggybanks = await PiggyBank.countDocuments();

    res.json({
      success: true,
      users,
      wallets,
      notifications,
      piggybanks,
      message: "Dashboard stats loaded.",
    });
  } catch (err) {
    console.error("❌ Stats fetch error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});


// ✅ 3. Kullanıcı Ban / Aktif durumu değiştir
router.patch("/user/:id/toggle-ban", authMiddleware, authorizeRoles("admin"), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "Kullanıcı bulunamadı" });
    }

    user.isBanned = !user.isBanned;
    await user.save();

    res.json({
      success: true,
      message: user.isBanned ? "Kullanıcı banlandı" : "Ban kaldırıldı",
    });
  } catch (err) {
    console.error("❌ Ban toggle error:", err);
    res.status(500).json({ success: false, message: "Server error." });
  }
});

// ✅ 4. Kullanıcı sil
router.delete("/user/:id/delete", authMiddleware, authorizeRoles("admin"), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user)
      return res.status(404).json({ success: false, message: "Kullanıcı bulunamadı" });

    // Kullanıcıyla ilişkili cüzdanı da sil
    await Wallet.deleteOne({ userId: req.params.id });
    await User.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: "Kullanıcı başarıyla silindi" });
  } catch (err) {
    console.error("❌ Delete user error:", err);
    res.status(500).json({ success: false, message: "Server error." });
  }
});

module.exports = router;
