const express = require("express");
const { HTTP_CODES } = require("../config/Enum");
const emitter = require("../lib/Emitter");
const { json } = require("is_js");
const router = express.Router();

emitter.addEmitter("nocifications");

router.get("/", async (req, res) =>{
   
    res.writeHead(HTTP_CODES.OK,{
        "Content-Type": "text/event-stream",
        "Connection": "keep-alive",
        "Cache-Control": "no-cache, no-transform"
    });

    const listener = (data) => {
        res.write("data: " + JSON.stringify(data) + "\n\n");
    }

    emitter.getEmitter("nocifications").on("messages", listener);

    req.on("close", () => {
        emitter.getEmitter("notifications").off("messages", listener);
    })

});

module.exports = router;