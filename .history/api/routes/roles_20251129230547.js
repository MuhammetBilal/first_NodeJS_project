const express = require("express");
const router = express.Router();
const Roles = require("../db/models/Roles");
const RolePrivileges = require("../db/models/RolePrivileges");
const Response = require("../lib/Response");
const CustomError = require("../lib/Error");
const Enum = require("../config/Enum");
const role_privileges = require("../config/role_privileges");
const auth = require("../lib/auth")();

router.all("*", auth.authenticate(), (req, res, next) => {
    next();
});

router.get("/", auth.checkRoles("roles_view"), async (req, res) => {
    try {
        let roles = await Roles.find({}).lean();
        for (let i = 0; i < roles.length; i++) {
            // Her rolün yetkilerini de bulup içine ekleyelim
            let permissions = await RolePrivileges.find({ role_id: roles[i]._id });
            roles[i].permissions = permissions.map(p => p.permission);
        }
        res.json(Response.successResponse(roles));
    } catch (err) {
        let errorResponse = Response.errorResponse(err);
        res.status(errorResponse.code).json(errorResponse);
    }
});

router.post("/add", auth.checkRoles("roles_add"), async (req, res) => {
    let body = req.body;
    try {
        if (!body.role_name) throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "Validation Error", "Role name field must be filled");

        let role = new Roles({
            role_name: body.role_name,
            is_active: true,
            created_by: req.user.id
        });

        await role.save();

        // Gelen yetkileri (permissions) kaydet
        if (body.permissions && Array.isArray(body.permissions)) {
            for (let perm of body.permissions) {
                await RolePrivileges.create({
                    role_id: role._id,
                    permission: perm,
                    created_by: req.user.id
                });
            }
        }

        res.json(Response.successResponse({ success: true }));
    } catch (err) {
        let errorResponse = Response.errorResponse(err);
        res.status(errorResponse.code).json(errorResponse);
    }
});

router.post("/update", auth.checkRoles("roles_update"), async (req, res) => {
    let body = req.body;
    try {
        if (!body._id) throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "Validation Error", "_id field must be filled");

        let updates = {};
        if (body.role_name) updates.role_name = body.role_name;
        if (typeof body.is_active === "boolean") updates.is_active = body.is_active;

        await Roles.updateOne({ _id: body._id }, updates);

        // Yetkileri Güncelle: Önce eskileri sil, sonra yenileri ekle
        if (body.permissions && Array.isArray(body.permissions)) {
            await RolePrivileges.deleteMany({ role_id: body._id });
            
            for (let perm of body.permissions) {
                await RolePrivileges.create({
                    role_id: body._id,
                    permission: perm,
                    created_by: req.user.id
                });
            }
        }

        res.json(Response.successResponse({ success: true }));
    } catch (err) {
        let errorResponse = Response.errorResponse(err);
        res.status(errorResponse.code).json(errorResponse);
    }
});

router.post("/delete", auth.checkRoles("roles_delete"), async (req, res) => {
    let body = req.body;
    try {
        if (!body._id) throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "Validation Error", "_id field must be filled");

        await Roles.deleteOne({ _id: body._id });
        await RolePrivileges.deleteMany({ role_id: body._id }); // Rol silinirse yetkileri de silinsin

        res.json(Response.successResponse({ success: true }));
    } catch (err) {
        let errorResponse = Response.errorResponse(err);
        res.status(errorResponse.code).json(errorResponse);
    }
});

// Sistemdeki TÜM yetki tanımlarını Frontend'e gönderen rota
router.get("/permissions", async (req, res) => {
    res.json(Response.successResponse(role_privileges));
});

module.exports = router;