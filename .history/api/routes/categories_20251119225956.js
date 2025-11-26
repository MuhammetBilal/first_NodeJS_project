const express = require("express");
const { Query } = require("mongoose");
const { head } = require("../app");
const router = express.Router();
const Categories = require("../db/models/Categories");
const Response = require("../lib/Response");

router.get("/", async(req, res, next) => {
   
    try{
        let categories = await Categories.find({});     //SELECT sorgusu
        
        res.json(Response.successResponse(categories));
    }catch(err){
        res.json(Response.errorResponse(err))
    }
});

module.exports = router;