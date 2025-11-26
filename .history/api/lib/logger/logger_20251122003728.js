const { format, createLogger, transports } = require("winston");

const { LOG_LEVEL } = require("../../config");

const formats = format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss.SSS" }),
    format.simple(),
    format.splat(),
    format.printf(info => {
    return `${info.timestamp} ${info.level.toUpperCase()}: ` +
        `[email:${info.email}] ` +
        `[location:${info.location}] ` +
        `[procType:${info.proc_type}] ` +
        `[log:${JSON.stringify(info.log)}]`;
})
)

// 2023-05-04 12:12:12 INFO: [email:asd] [location:asd] [procType:asd] [log:{}]

const logger = createLogger({
    level: LOG_LEVEL,
    transports: [
        new (transports.Console)({ format: formats })
    ]
});

module.exports = logger;
