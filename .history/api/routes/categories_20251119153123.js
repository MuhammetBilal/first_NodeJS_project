const express = require("express");
const { Query } = require("mongoose");
const { head } = require("../app");
const router = express.Router();
const isAuthenticated  = false;
router.all("*",(req,res,next)=>{
    if(isAuthenticated){
        next();
    }else{
        res.json({success: false, error: "Not authenticated!"});
    }
})


router.get("/", function(req, res, next){
    res.jsonp({success: true})

});

module.exports = router;