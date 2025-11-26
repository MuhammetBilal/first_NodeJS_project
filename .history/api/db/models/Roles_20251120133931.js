const mongoose = require("mongoose");
const RolePrivileges = require("./RolePrivileges"); // <-- Hata burada olabilir

const schema = mongoose.Schema({
    role_name: {type: String, required: true, unique: true},
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

class Roles extends mongoose.Model {

    static async remove(query) {

        if (query._id) {
            await RolePrivileges.deleteMany({role_id: query._id});
        }

        await super.deleteMany(query);
    }

}

schema.loadClass(Roles);
module.exports = mongoose.model("roles", schema);