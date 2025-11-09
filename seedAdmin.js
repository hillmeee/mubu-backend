require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  const email = "admin@mubu.com";
  const newPassword = "Admin123!";

  const hashed = await bcrypt.hash(newPassword, 10);

  const user = await User.findOne({ email });
  if (!user) {
    console.log("Admin bulunamadı, oluşturuluyor...");
    await User.create({
      name: "Admin User",
      email,
      password: hashed,
      role: "admin",
      verified: true,
      pinCreated: true,
      profileCompleted: true,
      firstLoginCompleted: true,
    });
  } else {
    user.password = hashed;
    await user.save();
    console.log("Admin şifresi başarıyla güncellendi!");
  }

  mongoose.connection.close();
})();
