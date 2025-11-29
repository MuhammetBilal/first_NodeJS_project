/* eslint-env node */
const mongoose = require("mongoose");
let instance = null;
class Database {
    constructor() {
        if(!instance){
            this.mongoConnection = null;
            instance = this;
        }
        return instance;
    }
    async connect(options){
    try{
        console.log("Database Connecting...");
        
        let connectionUri = process.env.CONNECTION_STRING; 

        if (!connectionUri) {
            console.error("HATA: Bağlantı dizesi (CONNECTION_STRING) ortam değişkeninde tanımlı değil!");
            process.exit(1);
        }

        let db = await mongoose.connect(connectionUri); // Doğru kullanım
    
        this.mongoConnection = db;
        console.log("Database Connected.");
    }catch(err){
        console.error(err);
        process.exit(1);
    }
}
}

module.exports = Database;