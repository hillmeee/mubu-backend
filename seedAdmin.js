const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
require("dotenv").config();

const seedAdmin = async () => {
  try {
    // MongoDB URI kontrolü
    if (!process.env.MONGO_URI) {
      console.error("❌ HATA: MONGO_URI environment variable bulunamadı!");
      console.error("📝 Lütfen .env dosyasında MONGO_URI değişkenini tanımlayın:");
      console.error("   MONGO_URI=mongodb://localhost:27017/mubudb");
      console.error("   veya");
      console.error("   MONGO_URI=mongodb+srv://kullanici:sifre@cluster.mongodb.net/dbname");
      process.exit(1);
    }

    // MongoDB URI format kontrolü
    const mongoUri = process.env.MONGO_URI.trim(); // Boşlukları temizle
    if (!mongoUri.startsWith("mongodb://") && !mongoUri.startsWith("mongodb+srv://")) {
      console.error("❌ HATA: MONGO_URI geçersiz format!");
      console.error("   MongoDB connection string 'mongodb://' veya 'mongodb+srv://' ile başlamalıdır.");
      console.error("   Mevcut değer (ilk 50 karakter):", mongoUri.substring(0, 50));
      console.error("");
      console.error("📝 .env dosyasında MONGO_URI şöyle olmalı:");
      console.error("   MONGO_URI=mongodb+srv://kullanici:sifre@cluster.mongodb.net/dbname");
      console.error("");
      console.error("   ÖNEMLİ: Tırnak işareti (\" veya ') kullanma!");
      console.error("   ÖNEMLİ: Satır başında veya sonunda boşluk olmamalı!");
      process.exit(1);
    }

    console.log("🔗 MongoDB'ye bağlanılıyor...");
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB'ye bağlandı");

    const adminEmail = "admin@mubu.com";
    const adminPassword = "Admin123!"; // Bu şifreyi değiştirmeyi unutma!

    // Mevcut admin kullanıcısını kontrol et
    let admin = await User.findOne({
      $or: [
        { email: adminEmail },
        { role: "admin" }
      ]
    });

    if (admin) {
      console.log("📝 Mevcut admin kullanıcısı bulundu, güncelleniyor...");
      
      // Şifreyi hashle
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      
      // Admin kullanıcısını güncelle
      admin.email = adminEmail;
      admin.password = hashedPassword;
      admin.role = "admin";
      admin.verified = true;
      admin.pinCreated = true; // Admin için PIN gerekli değil ama true yapıyoruz
      admin.profileCompleted = true;
      admin.firstLoginCompleted = true;
      
      await admin.save();
      console.log("✅ Admin kullanıcısı güncellendi!");
      console.log("📧 Email:", adminEmail);
      console.log("🔑 Şifre:", adminPassword);
    } else {
      console.log("➕ Yeni admin kullanıcısı oluşturuluyor...");
      
      // Şifreyi hashle
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      
      // Yeni admin kullanıcısı oluştur
      admin = new User({
        email: adminEmail,
        password: hashedPassword,
        role: "admin",
        verified: true,
        pinCreated: true,
        profileCompleted: true,
        firstLoginCompleted: true,
        name: "Admin User"
      });
      
      await admin.save();
      console.log("✅ Admin kullanıcısı oluşturuldu!");
      console.log("📧 Email:", adminEmail);
      console.log("🔑 Şifre:", adminPassword);
    }

    process.exit(0);
  } catch (err) {
    console.error("❌ Admin seedleme hatası:", err);
    process.exit(1);
  }
};

seedAdmin();

