const { format, createLogger, transports } = require("winston");

const { LOG_LEVEL } = require("../../config");

const formats = format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss.SSS" }),
    format.splat(),
    format.printf(info => {
    const data = info.message || {};
    return `${info.timestamp} ${info.level.toUpperCase()}: ` +
    `[email:${data.email}] [location:${data.location}] ` +
    `[procType:${data.proc_type}] [log:${JSON.stringify(data.log)}]`;
})
);


// 2023-05-04 12:12:12 INFO: [email:asd] [location:asd] [procType:asd] [log:{}]

const logger = createLogger({
    level: LOG_LEVEL,
    transports: [
        new (transports.Console)({ format: formats })
    ]
});

module.exports = logger;
