const express = require("express");
const { Query } = require("mongoose");
const { head } = require("../app");
const router = express.Router();

router.get("/", (req, res, next) =>{
    res.send('send with a resource')

})

module.exports = router;