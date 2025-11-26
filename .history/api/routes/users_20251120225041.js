var express = require('express');
const Users = require('../db/models/Users');
var router = express.Router();
const Response = require("../lib/Response");

/* GET users listing. */
router.get('/', async (req, res, next) => {
    try {
      let users = await Users.find({});

      res.json(Response.successResponse(users));

    } catch (err) {
      let errorResponse = Response.errorResponse(err);
      res.status(errorResponse.code).json(errorResponse);
    }
});

module.exports = router;
