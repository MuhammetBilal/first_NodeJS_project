/* eslint-disable valid-typeof */
const express = require("express");
const router = express.Router();
const Auditlogs = require("../db/models/Auditlogs");
const Response = require("../lib/Response");
const moment = require("moment/moment");
const auth = require("../lib/auth")();

router.all("*",auth.authenticate(), (req, res, next) => { // authenticaiton - kimlik doğrulama işlemi. Token kullanarak routerları kontrol eder.
    next();
}); 


router.post("/", auth.checkRoles("auditlogs_view"), async (req, res, next) =>{
    try {
        let body = req.body;
        let query = {};
        let skip = body.skip;
        let limit = body.limit;

        // eslint-disable-next-line valid-typeof
        if(typeof body.skip !== "numeric"){ // limit geçiş
            skip = 0;
        }
        if(typeof body.limit !== "numeric" || body.limit > 500){ // değişikler listelenirken limit koyulur
            limit = 500;
        }
        if(body.begin_date && body.end_date){ // zaman filtrelemesi
            query.created_at = {
                $gte: moment(body.begin_date), 
                $lte: moment(body.end_date)
            }
             
        }else{
            query.created_at = {
                $gte: moment().subtract(1, "day").startOf("day"), 
                $lte: moment()
            }
        }

        let auditlogs = await Auditlogs.find(query).sort({created_at: -1}).skip(skip).limit(limit);
       
        res.json(Response.successResponse(auditlogs));
        
    } catch (err) {
        let errorResponse = Response.errorResponse(err, req.user?.language);
        res.status(errorResponse.code).json(errorResponse);
    }

})

module.exports = router;