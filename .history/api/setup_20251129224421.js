/* eslint-env node */
require("dotenv").config(); // .env dosyasını oku
const mongoose = require("mongoose");
const Users = require("./db/models/Users");
const Roles = require("./db/models/Roles");
const RolePrivileges = require("./db/models/RolePrivileges");
const UserRoles = require("./db/models/UserRoles");

const run = async () => {
    try {
        console.log("⏳ Veritabanına bağlanılıyor...");
        await mongoose.connect(process.env.CONNECTION_STRING);
        console.log("✅ Bağlantı başarılı!");

        const email = "bilalerkoc@gmail.com"; // SENİN MAİLİN

        // 1. Kullanıcıyı Bul
        let user = await Users.findOne({ email: email });
        if (!user) {
            console.log("❌ HATA: Kullanıcı bulunamadı (" + email + ")");
            process.exit(1);
        }
        console.log("👤 Kullanıcı bulundu: " + user.first_name);

        // 2. Eski Verileri Temizle
        console.log("🧹 Eski yetkiler temizleniyor...");
        await Roles.deleteMany({});
        await RolePrivileges.deleteMany({});
        await UserRoles.deleteMany({});

        // 3. Super Admin Rolü Oluştur
        let role = await Roles.create({
            role_name: "Super Admin",
            is_active: true,
            created_by: user._id
        });
        console.log("👑 Super Admin rolü oluşturuldu.");

        // 4. Yetkileri Tanımla (Config ile uyumlu)
        let permissions = [
            "user_view", "user_add", "user_update", "user_delete",
            "users_view", "users_add", "users_update", "users_delete",
            "category_view", "category_add", "category_update", "category_delete", "category_export", "category_import",
            "role_view", "role_add", "role_update", "role_delete",
            "auditlogs_view"
        ];

        // 5. Yetkileri Ekle
        for (let perm of permissions) {
            await RolePrivileges.create({
                role_id: role._id,
                permission: perm,
                created_by: user._id
            });
        }
        console.log("✅ Tüm yetkiler yüklendi.");

        // 6. Kullanıcıyı Role Bağla
        await UserRoles.create({
            role_id: role._id,
            user_id: user._id
        });
        console.log("🔗 Kullanıcı role bağlandı.");

        console.log("------------------------------------------------");
        console.log("🎉 İŞLEM BAŞARIYLA TAMAMLANDI! 🎉");
        console.log("------------------------------------------------");
        process.exit(0);

    } catch (err) {
        console.error("❌ BİR HATA OLUŞTU:", err);
        process.exit(1);
    }
};

run();