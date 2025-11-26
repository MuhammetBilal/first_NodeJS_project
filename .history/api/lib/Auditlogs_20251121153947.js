const { error } = require("is_js");
const Enum = require("../config/Enum");
const Auditlogs = require("../db/models/Auditlogs");

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
            level: Enum.LOG_LEVEL.INFO,
            email,location,proc_type,log
        });
    }
    warn(email, location, proc_type, log){
        this.#saveToDB({
            level: Enum.LOG_LEVEL.WARN,
            email,location,proc_type,log
        });
    }
    
    error(email, location, proc_type, log){
        this.#saveToDB({
            level: Enum.LOG_LEVEL.ERROR,
            email,location,proc_type,log
        });
    }
    debug(email, location, proc_type, log){
        this.#saveToDB({
            level: Enum.LOG_LEVEL.DEBUG,
            email,location,proc_type,log
        });
    }
    verbose(email, location, proc_type, log){
        this.#saveToDB({
            level: Enum.LOG_LEVEL.VERBOSE,
            email,location,proc_type,log
        });
    }
    http(email, location, proc_type, log){
        this.#saveToDB({
            level: Enum.LOG_LEVEL.HTTP,
            email,location,proc_type,log
        });
    }
    #saveToDB({level, email, location,proc_type,log}){ // # -> private bir class olamsını sağlar
        Auditlogs.create({
            level,
            email,
            location,
            proc_type,
            log
        });
    }
}