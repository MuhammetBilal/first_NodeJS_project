const { error } = require("is_js");
const Enum = require("../config/Enum");
const AuditlogsModel = require("../db/models/Auditlogs");

let instance = null;
class Auditlogs{
    constructor(){
        if(!instance){
            instance = this;
        }
        return instance;
    }

    info(email, location, proc_type, log){
        this.#saveToDB({
            level: Enum.LOG_LEVELS.INFO,
            email,location,proc_type,log
        });
    }
    warn(email, location, proc_type, log){
        this.#saveToDB({
            level: Enum.LOG_LEVELS.WARN,
            email,location,proc_type,log
        });
    }
    
    error(email, location, proc_type, log){
        this.#saveToDB({
            level: Enum.LOG_LEVELS.ERROR,
            email,location,proc_type,log
        });
    }
    debug(email, location, proc_type, log){
        this.#saveToDB({
            level: Enum.LOG_LEVELS.DEBUG,
            email,location,proc_type,log
        });
    }
    verbose(email, location, proc_type, log){
        this.#saveToDB({
            level: Enum.LOG_LEVELS.VERBOSE,
            email,location,proc_type,log
        });
    }
    http(email, location, proc_type, log){
        this.#saveToDB({
            level: Enum.LOG_LEVELS.HTTP,
            email,location,proc_type,log
        });
    }
    #saveToDB({level, email, location,proc_type,log}){ // # -> private bir class olamsını sağlar
        AuditlogsModel.create({
            level,
            email,
            location,
            proc_type,
            log
        });
    }
}

module.exports = new Auditlogs();