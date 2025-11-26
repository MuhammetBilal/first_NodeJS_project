const express = require("express");
const { Query } = require("mongoose");
const { head } = require("../app");
const router = express.Router();
const Categories = require("../db/models/Categories");
const Response = require("../lib/Response");
const CustomError = require("../lib/Error");
const Enum = require("../config/Enum");
const Auditlogs = require("../lib/Auditlogs")

router.get("/", async(req, res, next) => {
   
    try{
        let categories = await Categories.find({});     //SELECT sorgusu
        
        res.json(Response.successResponse(categories));
    }catch(err){
        let errorResponse = Response.errorResponse(err);
        res.status(errorResponse.code).json(Response.errorResponse(err));
    }
});

router.post("/add", async(req, res) => {
    let body = req.body;
    try{
        if(!body.name) throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST,"Validation Error!","name field must be filled");

        let category = new Categories({
            name: body.name,
            is_active: true,
            created_by: req.user?.id
        });

        await category.save(); 

        Auditlogs.info(req.user?.email, "Categories","Add","Added");

        res.json(Response.successResponse({success:true}));
    }catch(err){
        let errorResponse = Response.errorResponse(err);
        res.status(errorResponse.code).json(errorResponse);
    }
});

router.post("/update", async (req,res)=>{
    let body = req.body;
    try {
        if(!body._id) throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST,"Validation Error!","_id field must be filled");

        let updates = {};

        if(body.name) updates.name = body.name;
        if(typeof body.is_active === "boolean") updates.is_active = body.is_active;
        await Categories.updateOne({_id: body._id}, updates);

        Auditlogs.info(req.user?.email, "Categories","Update","Updated");

        res.json(Response.successResponse({success:true}));
    } catch (err) {
        let errorResponse = Response.errorResponse(err);
        res.status(errorResponse.code).json(errorResponse);
    }
});

router.post("/delete", async (req,res)=>{
    let body = req.body;
    try {
        if(!body._id) throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST,"Validation Error!","_id field must be filled");

        await Categories.deleteOne({_id: body._id});
        
        res.json(Response.successResponse({success:true}));
    } catch (err) {
        let errorResponse = Response.errorResponse(err);
        res.status(errorResponse.code).json(errorResponse);
    }
});
module.exports = router;