var express = require('express');
const bcrypt = require("bcrypt-nodejs"); // password hash işlemi için kullanılır.
const Users = require('../db/models/Users');
var router = express.Router();
const Response = require("../lib/Response");
const CustomError = require('../lib/Error');
const Enum = require('../config/Enum');

/* GET users listing. */
router.get('/', async (req, res) => {
    try {
      let users = await Users.find({});

      res.json(Response.successResponse(users));

    } catch (err) {
      let errorResponse = Response.errorResponse(err);
      res.status(errorResponse.code).json(errorResponse);
    }
});

router.post('/add', async (req, res) => {
  let body = req.body;  
    try {
        if(!body.email) throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "Validation Error!","email field be filled");
        if(!body.password) throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "Validation Error!","password field be filled");

        if (!Enum.EMAIL_REGEX.test(body.email)) {
          throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "Validation Error!", "The email address format is not valid." + Enum.EMAIL_REGEX);
        }
        if(body.password.length < Enum.PASS_LENGTH){
          throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST,"Validation Error!"," Password length must be greater than" + Enum.PASS_LENGTH);
        }


        let password = bcrypt.hashSync(body.password, bcrypt.genSaltSync(8), null); // (data, karıştırma işlemi, null) şifre hashleme işlemi
        await Users.create({
          email: body.email,
          password,
          is_active: body.is_active,
          first_name: body.first_name,
          last_name: body.last_name,
          phone_number: body.phone_number
        });

        res.status(Enum.HTTP_CODES.CREATED).json(Response.successResponse({success: true}, Enum.HTTP_CODES.CREATED));

      } catch (err) {
        let errorResponse = Response.errorResponse(err);
        res.status(errorResponse.code).json(errorResponse);
      }
});
module.exports = router;
