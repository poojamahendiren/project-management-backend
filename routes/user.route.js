const express = require('express');
const User = require('../models/user.model')
const router = express.Router();

router.get('/hello',(req,res) => {
         res.send("hello world");
     })
//getUserInfo
 router.get('/me',async (req, res, next) => {
    try {
        const data = await User.findById(req.user.id)
          .select('name email');
        return res.status(200).json(data);
      } catch (err) {
        return next(err);
      }

 })

 //updateUserInfo
 router.put('/me',async (req,res,next)=>{
    try {
        const updatedUser = await User.findByIdAndUpdate(
          req.user.id,
          {
            name: req.body.name,
            email: req.body.email,
          },
          {
            new: true,
          },
        ).select('name email');
        return res.status(200).json(updatedUser);
      } catch (err) {
        return next(err);
      }
 })


module.exports = router;





