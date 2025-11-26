const express = require("express");
const { Query } = require("mongoose");
const { head } = require("../app");
const router = express.Router();

router.get("/", function(req, res, next){
    res.send('send with a resource')

});

module.exports = router;