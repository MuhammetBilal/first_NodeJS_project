const express = require("express");
const { Query } = require("mongoose");
const { head } = require("../app");
const router = express.Router();

router.get("/:id", (req, res, next) =>{
    res.json({
        body: req.body,
        params: req.params,
        query: req.query,
        headers: req.headers
    }); 

})

module.exports = router;