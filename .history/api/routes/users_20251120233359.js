var express = require('express');
const bcrypt = require("bcrypt-nodejs"); // password hash işlemi için kullanılır.
const is = require("is_js"); // email kontrol için kullanılır
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

        if(is.not.email(body.email)) throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "Validation Error!","email field be an email format"); // email formatında olup olmadığını kontrol ediyor

        if(!body.password) throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "Validation Error!","password field be filled");

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

router.post('/update', async (req, res) => {
  try {
      let body = req.body;  
      let updates = {};
      
      if(!body._id) throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST,"Validation Error","_id fields must be filled");

      if(body.password && body.password.length >= Enum.PASS_LENGTH){
        updates.password = bcrypt.hashSync(body.password, bcrypt.genSaltSync(8), null);
      }

      if(typeof body.is_active === "boolean") updates.is_active = body.is_active;
      if(body.first_name) updates.first_name = body.first_name;
      if(body.last_name) updates.last_name = body.last_name;
      if(body.phone_number) updates.phone_number = body.phone_number;7

      await Users.updateOne({_id: body._id}, updates);

      res.json(Response.successResponse({success: true}));

        res.status(Enum.HTTP_CODES.CREATED).json(Response.successResponse({success: true}, Enum.HTTP_CODES.CREATED));

      } catch (err) {
        let errorResponse = Response.errorResponse(err);
        res.status(errorResponse.code).json(errorResponse);
      }
});
module.exports = router;
