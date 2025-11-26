const express = require("express");
const { Query } = require("mongoose");
const { head } = require("../app");
const router = express.Router();

const Roles = require("../db/models/Roles");
const RolePrivileges = require("../db/models/RolePrivileges");
const Response = require("../lib/Response");
const CustomError = require("../lib/Error");
const Enum = require("../config/Enum");


router.get("/", async(req, res, next)=>{
   try {
        let roles  = await Roles.find({});
        res.json(Response.successResponse(roles));
   } catch (error) {
        let errorResponse = Response.errorResponse(err);
        res.status(errorResponse.code).json(errorResponse);  
   }

});
router.post("/add", async(req, res, next)=>{
    let body = req.body;

   try {
        if(!body.role_name) throw CustomError(Enum.HTTP_CODES.BAD_REQUEST,"Validation Error!","role_name field must be filled"
        )
        let role  = new Roles({
            role_name: body.role_name,
            is_active: true,
            created_by: req.user?.id
        
        });
        await role.save();
        res.json(Response.successResponse({success: true}));
   } catch (error) {
        let errorResponse = Response.errorResponse(err);
        res.status(errorResponse.code).json(errorResponse);  
   }

});

router.post("/update", async(req, res)=>{
    let body = req.body;

   try {
        if(!body.role_id) throw CustomError(Enum.HTTP_CODES.BAD_REQUEST,"Validation Error!","_id field must be filled")
        let updates = {};

        if(body.role_name) updates.role_name = body.role_name; 
        if(typeof body.is_active === "boolean") updates.is_active = body.is_active; 
        await Roles.updateOne({_id: body._id},updates);
        res.json(Response.successResponse({success: true}));
   } catch (error) {
        let errorResponse = Response.errorResponse(err);
        res.status(errorResponse.code).json(errorResponse);  
   }

});

router.post("/delete", async(req, res)=>{
    let body = req.body;

   try {
        if(!body.role_id) throw CustomError(Enum.HTTP_CODES.BAD_REQUEST,"Validation Error!","_id field must be filled")
        
        await Roles.deleteOne({_id: body._id});

        res.json(Response.successResponse({success: true}));


   } catch (error) {
        let errorResponse = Response.errorResponse(err);
        res.status(errorResponse.code).json(errorResponse);  
   }

});
module.exports = router;