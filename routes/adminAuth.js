// 📂 routes/adminAuth.js
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User");

// 🔐 Admin oluşturma veya güncelleme
router.get("/create-admin", async (req, res) => {
  try {
    const adminEmail = "admin@mubu.com";
    const adminPassword = "Admin123!";

    let admin = await User.findOne({ email: adminEmail });

    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    if (admin) {
      admin.password = hashedPassword;
      admin.role = "admin";
      admin.verified = true;
      admin.profileCompleted = true;
      admin.pinCreated = true;
      await admin.save();
      return res.json({ success: true, message: "✅ Admin güncellendi!" });
    } else {
      const newAdmin = new User({
        email: adminEmail,
        password: hashedPassword,
        role: "admin",
        verified: true,
        profileCompleted: true,
        pinCreated: true,
        name: "Admin User",
      });
      await newAdmin.save();
      return res.json({ success: true, message: "✅ Yeni admin oluşturuldu!" });
    }
  } catch (err) {
    console.error("❌ Admin oluşturma hatası:", err);
    res.status(500).json({ success: false, message: "Sunucu hatası" });
  }
});

module.exports = router;
