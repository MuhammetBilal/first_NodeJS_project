const {format, createLogger, transports} = require("winston");

const { LOG_LEVEL} = require("../../config");

const formats = format.combine(
    format.timestamp({ format : "YYYY-MM-DD HH:mm:ss:SSS" }),
    format.simple(),
    format.splat(),
    format.printf( info => `${info.timestamp} ${info.level.toLocaleUpperCase()}: [email: ${info.message.email}] [location: ${info.message.location}] [procType: ${info.message.proc_Type}] [log: ${info.message.log}] `)
    
)
// logger -> terminalde yapılan işlem hakkında bilgi verir.
// 2025-11-21 23:21:17 INFO: [email: a@b.com] [location: abc] [procType: abc] [log:{}]

const logger = createLogger({
    level: LOG_LEVEL,
    transports: [
        new (transports.Console)({ format: formats})
    ]
});

module.exports = logger;

