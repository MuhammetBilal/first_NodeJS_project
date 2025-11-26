/* eslint-disable no-undef */
module.exports = {
    "PORT": process.env.PORT || "3000",
    "LOG_LEVEL": process.env.LOG_LEVEL || "debug",
    "CONNECTION_STRING": process.env.CONNETION_STRING || "mongodb://localhost:27017/first_NodeJS_project",
    "JWT": {
        "SECRET": "123456",
        "EXPIRE_TIME": !isNan(parseInt(process.env.TOKEN_EXPIRE_TIME)) ? parseInt(process.env.TOKEN_EXPIRE_TIME) : 24*60*6
    }
}