const express = require('express');
//import checkAuth from '../utils/checkAuth.js';
//import authRoutes from './auth.js';
//import usersRoutes from './task.route.js';
//import tasksRoutes from './user.route.js';
const usersRoutes = require('./user.route.js');
const tasksRoutes = require('./task.route.js');
const authRoutes = require('./auth.route.js');
const  checkAuth  = require('../utils/checkAuth.js');
const router = express.Router();


router.use('/auth', authRoutes);
router.use('/users',checkAuth,  usersRoutes);
router.use('/tasks',checkAuth,  tasksRoutes);


module.exports = router;