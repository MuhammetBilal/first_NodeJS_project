/* eslint-disable no-undef */
if(process.env.NODE_ENV != "production")
  require('dotenv').config()
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var app = express();

app.use(cors());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
/*app.use((req, res, next)=>{
  console.log("Ben app.js te tanımlanan bir middleware'im");
  next();
});*/
app.use('/api', require('./routes/index'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
// --- GEÇİCİ KURULUM KODU (app.js içine) ---
app.get('/setup-roles', async (req, res) => {
    try {
        const Users = require("./db/models/Users"); // Yollar app.js'e göre ayarlandı
        const UserRoles = require("./db/models/UserRoles");
        const RolePrivileges = require("./db/models/RolePrivileges");
        const Roles = require("./db/models/Roles");

        // 1. Kullanıcıyı Bul
        let user = await Users.findOne({ email: "bilalerkoc@gmail.com" });
        if (!user) return res.send("HATA: Kullanıcı bulunamadı!");

        // 2. Temizlik
        await Roles.deleteMany({});
        await RolePrivileges.deleteMany({});
        await UserRoles.deleteMany({});

        // 3. Rol Oluştur
        let role = await Roles.create({
            role_name: "Super Admin",
            is_active: true,
            created_by: user._id
        });

        // 4. Yetkiler (Hem tekil hem çoğul ekliyoruz, garanti olsun)
        let permissions = [
            "user_view", "user_add", "user_update", "user_delete",
            "users_view", "users_add", "users_update", "users_delete",
            "category_view", "category_add", "category_update", "category_delete", "category_export", "category_import",
            "role_view", "role_add", "role_update", "role_delete",
            "auditlogs_view"
        ];

        for (let perm of permissions) {
            await RolePrivileges.create({
                role_id: role._id,
                permission: perm,
                created_by: user._id
            });
        }

        // 5. Bağla
        await UserRoles.create({
            role_id: role._id,
            user_id: user._id
        });

        res.send("İŞLEM BAŞARILI! Veritabanı sıfırlandı ve yetkiler verildi. Çıkış yapıp tekrar girin.");

    } catch (err) {
        res.send("Hata: " + err.message);
        console.error(err);
    }
});
module.exports = app;
