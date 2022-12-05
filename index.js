require("dotenv").config();    //6
//1
const express = require("express");
const db = require("./db/connect");                                           //10 import db
const cors = require('cors');
const cookieParser = require('cookie-parser');

//import routes
const allRoutes =require( './routes/index.js');

//2
const app = express();
//(DB connection)  
db();

app.get('/', (req, res) => {
  res.send('Welcome to Org!');
})

//middleware to convert incoming data into jason format
app.use(express.json());
app.use(cors());
app.use(cookieParser());


app.use('/api', allRoutes);


app.use((err, req, res, next) => {
    const status = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    return res.status(status).send({ message, stack: err.stack });
  });

//3
const PORT = process.env.PORT || 4000;                                             //3  


app.listen(PORT,()=>{                                                              //4 //5 env
    console.log(`App is running on port ${PORT}` );
})
