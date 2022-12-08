require("dotenv").config();    //6
//1
const express = require("express");
const db = require("./db/connect");                                           //10 import db
const cors = require('cors');
const jwt = require ('jsonwebtoken');
//const createError = require('./utils/createError');
//const cookieParser = require('cookie-parser');

//import routes
//const allRoutes =require( './router/index.js');

//2
const app = express();
//(DB connection)  
db();
const registerRouter = require("./router/registerRouter");
const userRouter = require("./router/userRouter");
const tasksRouter = require("./router/tasksRouter");
const createError = require("./utils/createError");

app.get('/', (req, res) => {
  res.send('Welcome to Org!');
})

//middleware to convert incoming data into jason format
app.use(cors());
app.use(express.json());


app.use("/register",registerRouter);

//authentication
app.use("/",  (req,res,next) => {
  const token = req.headers.accesstoken
  if(!token){
    return res.status(400).send({msessage:"Token not found"})
  }
  return jwt.verify(token,process.env.SECRET_KEY,(err,decoded) => {
      if(err){
        return next (createError({status:401,message:"InvalidToken"}));
      }
      req.user=decoded;
    return next();
    });
    
  })
  

app.use("/users",userRouter);
app.use("/tasks",tasksRouter);


//app.use(cookieParser());

//app.use('/api', allRoutes);

// app.use((err, req, res, next) => {
//     const status = err.statusCode || 500;
//     const message = err.message || 'Internal Server Error';
//     return res.status(status).send({ message, stack: err.stack });
//   });




//3
const PORT = process.env.PORT || 4000;                                             //3  


app.listen(PORT,()=>{                                                              //4 //5 env
    console.log(`App is running on port ${PORT}` );
})
