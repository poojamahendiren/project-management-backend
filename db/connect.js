const mongoose = require("mongoose");                                  //8 i mongoose

db = async() => {                                                      //9 connect  //10 import db index.js
    try{
        await mongoose.connect(process.env.MONGO_URL);
        console.log("DB connection established");
    }
    catch{
        console.log('DB Error: ', error);
    }
    
}

module.exports = db;