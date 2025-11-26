const express = require("express");
const { Query } = require("mongoose");
const { head } = require("../app");
const router = express.Router();

const Roles = require("../db/models/Roles");
const RolePrivileges = require("../db/models/RolePrivileges");
const Response = require("../lib/Response");


router.get("/", async(req, res, next)=>{
   try {
        let roles  = await Roles.find({});
        res.json(Response.successResponse(roles));
   } catch (error) {
        let errorResponse = Response.errorResponse(err);
        res.status(errorResponse.code).json(errorResponse);  
   }

});

module.exports = router;