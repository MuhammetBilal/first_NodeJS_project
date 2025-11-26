const express = require("express");
const { Query } = require("mongoose");
const { head } = require("../app");
const router = express.Router();
const Categories = require("../db/models/Categories");
const Response = require("../lib/Response");
const CustomError = require("../lib/Error");
const Enum = require("../config/Enum");

router.get("/", async(req, res, next) => {
   
    try{
        let categories = await Categories.find({});     //SELECT sorgusu
        
        res.json(Response.successResponse(categories));
    }catch(err){
        res.json(Response.errorResponse(err))
    }
});

router.post("/add", async(req, res) => {
    let body = req.body;
    try{
        if(!body.name) throw new CustomError
    }catch(err){
        res.json(Response.errorResponse(err))
    }
});
module.exports = router;