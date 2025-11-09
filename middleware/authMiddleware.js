const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "Yetkisiz erişim." });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 🔹 Kullanıcıyı bul
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ success: false, message: "Kullanıcı bulunamadı." });
    }

    // 🔹 req.user içine bilgileri koy
    req.user = {
      userId: user._id,
      role: user.role,
      email: user.email,
    };

    next();
  } catch (err) {
    console.error("authMiddleware hata:", err.message);
    res.status(401).json({ success: false, message: "Token geçersiz veya süresi dolmuş." });
  }
};

module.exports = authMiddleware;
