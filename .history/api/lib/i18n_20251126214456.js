const i18n = require("../i18n");

class I18n {
    constructor(lang){
        this.lang = lang;
    }

    translate(text, lang = this.lang) {
        
        let arr = text.split("."); // COMMON.VALIDAION_ERROR_TITLE => ['COMMON', VALIDATION_ERROR_TITLE]

        let val = i18n[lang][arr[0]]; //text["EN","COMMON"];

        for(let i = 1; i< arr.length; i++){
            val = val[arr[i]];
        }
        return val;
    }
}

module.exports = I18n;