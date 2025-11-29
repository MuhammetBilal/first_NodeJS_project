const mongoose = require("mongoose");
const {PASS_LENGTH, HTTP_CODES} = require("../../config/Enum");
const validator = require("validator");
const CustomError = require("../../lib/Error");
const bcrypt = require("bcrypt-nodejs");
const {DEFAULT_LANG} = require("../../config");
const schema = mongoose.Schema({
    email: {type: String ,required : true},
    password: {type: String ,required : true},
    is_active: {type: Boolean ,default : true},
    first_name: String,
    last_name: String,
    phone_number: String,
    language: {type: String, default: DEFAULT_LANG}
},{
    versionKey: false,
    timestamps: {
        createdAt: "created_at",
        updatedAt: "updated_at"
    }
});

schema.index({ email: 1 }, { unique: true });


class Users extends mongoose.Model{
    validPassword(password){ // şifre çözümlemesi yapıldı
        return bcrypt.compareSync(password, this.password);
    }
    static validateFieldsBeforeAuth(email, password){
        // validator.isEmail(email) fonksiyonunu kullanarak format kontrolü yapıyoruz.
        if(typeof password !== "string" || password.length < PASS_LENGTH || !validator.isEmail(email)) 
            throw new CustomError(HTTP_CODES.UNAUTHORIZED, "Validation Error", "email or password wrong");
        
        return null;
    }
}

schema.loadClass(Users);
module.exports = mongoose.model("users", schema);