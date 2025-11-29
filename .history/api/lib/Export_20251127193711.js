const xlsx = require("node-xlsx");

class Export{
    constructor(){

    }

    /**
     *@param {array} titles excel tablosunun başlıkları
     *@param {array} columns excel tablosuna yazılacak verilerin başlıkları
     *@param {array} data excel tablosuna yazılacak veriler 
     */

     toExcel(titles, columns, data = []) {

        let rows = [];

        rows.push(titles) // başlıklar satıra eklendi

        for( let i = 0; i<data.length; i++){
            let item = data[i];
            let cols = [];

            for (let j = 0; j < columns.length; j++){
                cols.push(item[columns[j]]);
            }

            rows.push(cols);
        }

        xlsx.build([{name: "Sheet", data: rows}])
     }
}
module.exports = Export;