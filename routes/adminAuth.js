const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const router = express.Router();

// 🚨 Geçici admin oluşturma route
router.get("/create-admin", async (req, res) => {
  try {
    const email = "admin@mubu.com";
    const password = "Admin123!";

    let admin = await User.findOne({ email });

    if (admin) {
      const hashed = await bcrypt.hash(password, 10);
      admin.password = hashed;
      admin.role = "admin";
      admin.verified = true;
      admin.pinCreated = true;
      admin.profileCompleted = true;
      admin.firstLoginCompleted = true;
      await admin.save();
      return res.json({ success: true, message: "Admin güncellendi" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    admin = new User({
      email,
      password: hashedPassword,
      role: "admin",
      verified: true,
      pinCreated: true,
      profileCompleted: true,
      firstLoginCompleted: true,
      name: "Admin User",
    });

    await admin.save();
    res.json({ success: true, message: "Admin oluşturuldu" });
  } catch (err) {
    console.error("Admin oluşturma hatası:", err);
    res.status(500).json({ success: false, message: "Sunucu hatası" });
  }
});

module.exports = router;
