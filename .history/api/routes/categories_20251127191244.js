const express = require("express");
const router = express.Router();
const Categories = require("../db/models/Categories");
const Response = require("../lib/Response");
const CustomError = require("../lib/Error");
const Enum = require("../config/Enum");
const Auditlogs = require("../lib/Auditlogs");
const Logger = require("../lib/logger/LoggerClass");
const auth = require("../lib/auth")();
const config = require("../config");
const i18n = new (require("../lib/i18n"))(config.DEFAULT_LANG);
const emitter = require("../lib/Emitter"); // bildirim

router.all("*",auth.authenticate(), (req, res, next) => { // authenticaiton - kimlik doğrulama işlemi. Token kullanarak routerları kontrol eder.
    next();
}); 

router.get("/", auth.checkRoles("category_view"),async(req, res, next) => {
   
    try{
        let categories = await Categories.find({});     //SELECT sorgusu
        
        res.json(Response.successResponse(categories));
    }catch(err){
        let errorResponse = Response.errorResponse(err);
        res.status(errorResponse.code).json(Response.errorResponse(err));
    }
});

router.post("/add",/*auth.checkRoles("category_add"),*/ async(req, res) => {
    let body = req.body;
    try{
        if(!body.name) throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST,i18n.translate("COMMON.VALIDATION_ERROR_TITLE",req.user.language),i18n.translate("COMMON.FIELD_MUST_BE_FILLED",req.user.language, ["name"]));

        let category = new Categories({
            name: body.name,
            is_active: true,
            created_by: req.user?.id
        });

        await category.save(); 

        Auditlogs.info(req.user?.email, "Categories","Add", category); // ekleme işleminin kaydı tutulur
        Logger.info(req.user?.email, "Categories", "Add", category); // log işlemi terminalde yapılan işlem hakkında bilgi verir

        res.json(Response.successResponse({success:true}));
    }catch(err){
        Logger.error(req.user?.email, "Categories", "Add", err); // log işlemi terminalde yapılan işlem hakkında bilgi verir
        let errorResponse = Response.errorResponse(err);
        res.status(errorResponse.code).json(errorResponse);
    }
});

router.post("/update",auth.checkRoles("category_update"),  async (req,res)=>{
    let body = req.body;
    try {
        if(!body._id) throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST,i18n.translate("COMMON.VALIDATION_ERROR_TITLE",req.user.language),i18n.translate("COMMON.FIELD_MUST_BE_FILLED",req.user.language, ["_id"]));

        let updates = {};

        if(body.name) updates.name = body.name;
        if(typeof body.is_active === "boolean") updates.is_active = body.is_active;
        await Categories.updateOne({_id: body._id}, updates);

        Auditlogs.info(req.user?.email, "Categories","Update",{_id: body._id, ...updates}); // değişiklik işleminin kaydı tutulur

        res.json(Response.successResponse({success:true}));
    } catch (err) {
        let errorResponse = Response.errorResponse(err);
        res.status(errorResponse.code).json(errorResponse);
    }
});

router.post("/delete", auth.checkRoles("category_delete"), async (req,res)=>{
    let body = req.body;
    try {
        if(!body._id) throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST,i18n.translate("COMMON.VALIDATION_ERROR_TITLE",req.user.language),i18n.translate("COMMON.FIELD_MUST_BE_FILLED",req.user.language, ["name"]));

        await Categories.deleteOne({_id: body._id});

        Auditlogs.info(req.user?.email, "Categories","Delete",{_id: body._id}); // silme işleminin kaydı tutulur
        
        res.json(Response.successResponse({success:true}));
    } catch (err) {
        let errorResponse = Response.errorResponse(err);
        res.status(errorResponse.code).json(errorResponse);
    }
});
module.exports = router;