const mongoose = require("mongoose");
const RolePrivileges = require("./RolePrivileges");

const schema = mongoose.Schema({
    role_name: {type: String ,required : true},
    is_active: {type: Boolean ,default : true},
    created_by: {
        type: mongoose.SchemaTypes.ObjectId
    },
},{
    versionKey : false,
    timestamps: {
        createdAt: "created_at",
        updatedAt: "updated_at"
    }
});

class Roles extends mongoose.Model{

    async deleteOne(Query){

        await RolePrivileges.deleteOne({role_id: query._id}); // role silinecekse role_privileges'teki veriler de silinecek

        await super.deleteOne(query);
    }
}

schema.loadClass(Roles);
module.exports = mongoose.model("roles", schema);