class Response{
    constructor(){}

    static successResponse(code,data){
        return{
            code,
            data 
        }
    }

    static errorResponse(error){
        return{
            code,
            error:{
                message: error.message,
                description: error.description 
            }
        }
    }
}

module.exports = Response;