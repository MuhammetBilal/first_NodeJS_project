const mongoose = require("mongoose");
const RolePrivileges = require("./RolePrivileges");

const schema = mongoose.Schema({
    role_name: {type: String, required: true},
    is_active: {type: Boolean, default: true},
    created_by: {
        type: mongoose.SchemaTypes.ObjectId
    }
},{
    versionKey: false,
    timestamps: {
        createdAt: "created_at",
        updatedAt: "updated_at"
    }
});
schema.index({ role_name: 1 }, { unique: true });// benzersizlik index,

// Roles.js (DÜZELTİLMİŞ KOD)

class Roles extends mongoose.Model {
    // Mongoose'un standart toplu silme metodunu geçersiz kılıyoruz.
    static async deleteMany(query) { 
        if (query._id) {
            // İlişkili tüm yetkileri sil
            await RolePrivileges.deleteMany({role_id: query._id}); 
        }
        
        // Mongoose'un kendi silme işlemini çağır.
        return super.deleteMany(query); 
    }
}

schema.loadClass(Roles);
module.exports = mongoose.model("roles", schema);