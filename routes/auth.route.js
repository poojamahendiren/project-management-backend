const express = require('express');
const bcrypt = require('bcrypt');
const User =require('../models/user.model.js') ;
const router = express.Router();
const jwt = require('jsonwebtoken');
const createError = require('../utils/createError')

router.post('/register', async (req,res,next) => {
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
      } catch (err) {
        res.status(500).send({
            message: 'Internal Server Error'
        })
      }
});

router.post('/login', async (req,res,next) => {

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
    const user = await User.findOne({ email: req.body.email }).select(
      'name email password',
    );
    if (!user) {
      
        //return res.status(404).send({message: 'User not found with the email'})
        return next(
          createError({ status: 404, message: 'User not found with the email' }),
        );
    
    }
    const isPasswordCorrect = await bcrypt.compare(
      req.body.password,
      user.password,
    );
    if (!isPasswordCorrect) {
      
        //return res.status(400).send({message: 'Password is incorrect'})
        return next(
          createError({ status: 400, message: 'Password is incorrect' }),
        );
    }
    const payload = {
      id: user._id,
      name: user.name,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });
    return res
      .cookie('access_token', token, {
        httpOnly: true,
      })
      .status(200)
      .send({ name: user.name, email: user.email, message: 'login success' });
  } catch (err) {
    res.status(500).send({
      message: 'Internal Server Error'
  })
}
});

router.get ('/logout' ,async (req, res) => {
  res.clearCookie('access_token');
  return res.status(200).send({ message: 'logout success' });
});

router.get('/is_logged_in' ,async (req, res) => {
  const token = req.cookies.access_token;
  if (!token) {
    return res.json(false);
  }
  return jwt.verify(token, process.env.JWT_SECRET, (err) => {
    if (err) {
      return res.json(false);
    }
    return res.json(true);
  });
});


module.exports = router;