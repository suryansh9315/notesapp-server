const mongo = require('mongoose');
const uri = "mongodb://localhost:27017/myNotebook?readPreference=primary&appname=MongoDB%20Compass&ssl=false";

const connectMongo = ()=>{
    mongo.connect(uri,()=>{
        console.log("Db Up Bitches")
    })
}
module.exports = connectMongo;
