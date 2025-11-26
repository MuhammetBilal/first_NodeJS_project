const { format, createLogger, transports } = require("winston");

const { LOG_LEVEL } = require("../../config");

const formats = format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss.SSS" }),
    format.simple(),
    format.splat(),
    format.printf(info => {
    // Mesajın içeriği undefined ise bile, onu boş bir objeyle/stringle değiştirerek güvenliği artır.
    const message = info.message || {}; // info.message null/undefined ise, boş obje {} olarak kabul et.
    
    // Basit loglar için de JSON.stringify kullanılarak undefined riski azaltılır.
    const safeMessage = (typeof message === 'string' || typeof message === 'number') ? message : JSON.stringify(message);

    const baseLog = `${info.timestamp} ${info.level.toUpperCase()}: `;
    
    // 1. Durum: Özel Log Objeleri (Auditlogs gibi)
    if (typeof message === 'object' && message !== null) {
        
        // Obje içindeki her bir alanın varlığını kontrol ederek güvenli atama yapıyoruz
        const email = message.email || 'N/A';
        const location = message.location || 'N/A';
        const procType = message.proc_type || 'N/A';
        const logContent = message.log ? JSON.stringify(message.log) : '{}';

        return `${baseLog} [email:${email}] [location:${location}] [procType:${procType}] [log:${logContent}]`;
    }
    
    // 2. Durum: Basit Loglar (String, Number veya diğer basit tipler)
    return `${baseLog} ${safeMessage}`;
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
