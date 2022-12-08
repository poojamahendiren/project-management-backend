const express = require('express');
const bcrypt = require ('bcrypt');
const jwt = require ('jsonwebtoken');
const router = express.Router();
const createError = require('../utils/createError')
const User =require('../models/user.model.js') ;
 require('dotenv');
//const router = express.Router();




router.post("/signup", async(req,res,next)=>{
    if (!req.body.name || !req.body.email || !req.body.password) {
        //return res.status(400).send({message: 'Name, Email & password are required'})
        return next(
          createError({
            message: 'Name, Email & password are required',
            statusCode: 400,
          }),
        );
    }
    
    try {
        const existUser = await User.findOne({email:req.body.email});
        if(existUser){
            return res.status(400).send({message:"You are already a exist user"})
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
    
        const newUser = new User({
          name: req.body.name,
          email: req.body.email,
          password: hashedPassword,
        });
    
        await newUser.save((err,data)=>{
            if(err){
                return res.status(400).send({message: 'Error while adding new user. Please check the data'});
            }

        });
         res.status(201).send({ message: "User has been added successfully." });
    } catch (error) {
      res.status(500).send({
        message: 'Internal Server Error'
      })
    }

})



router.post("/signin", async(req,res,next)=>{

  if (!req.body.email || !req.body.password) {
    //return res.status(400).send({message: 'Email & password are required'})
    return next(
      createError({
        message: 'Email and password are required',
        statusCode: 400,
      }),
    );
  }

  try {
    const existUser = await User.findOne({email:req.body.email}).select('name email password');
        if(!existUser){
            return res.status(400).send({message:"You are not a registered user please signup yourself to register "})
        }
        console.log(existUser);


        const isPasswordCorrect = await bcrypt.compare(
          req.body.password,existUser.password,
        );
        if (!isPasswordCorrect) {
          
            //return res.status(400).send({message: 'Password is incorrect'})
            return res.status(400).send({message:"Incorrect Password"})
        }
        const payload = {
          id: existUser._id,
          name: existUser.name,
        };

        const token = jwt.sign(payload,process.env.SECRET_KEY,{expiresIn:"1d"});
        res.send(token);


  } catch (error) {
    res.status(500).send({
      message: 'Internal Server Error'
  })
}
})





module.exports = router;