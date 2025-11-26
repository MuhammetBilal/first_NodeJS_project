const { format, createLogger, transports } = require("winston");

const { LOG_LEVEL } = require("../../config/Enum");


const formats = format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss.SSS" }),
    format.simple(),
    format.splat(),
    
    // printf fonksiyonu düzeltildi:
    format.printf(info => {
        // info.message bir obje mi? (Özel loglarımız)
        if (typeof info.message === 'object' && info.message !== null) {
             // Eğer bu bir objedir, email, location vb. alanları okuyabiliriz.
             return `${info.timestamp} ${info.level.toUpperCase()}: [email:${info.message.email}] [location:${info.message.location}] [procType:${info.message.proc_type}] [log:${JSON.stringify(info.message.log)}]`;
        }
        
        // info.message bir dizeyse (Basit loglar)
        return `${info.timestamp} ${info.level.toUpperCase()}: ${info.message}`;
    })
)

// ...

// 2023-05-04 12:12:12 INFO: [email:asd] [location:asd] [procType:asd] [log:{}]

const logger = createLogger({
    level: LOG_LEVEL,
    transports: [
        new (transports.Console)({ format: formats })
    ]
});

module.exports = logger;
