const express = require('express');
const Task = require('../models/task.model')
const router = express.Router();
const createError = require('../utils/createError');


//create task
router.post('/',async (req,res,next)=>{
    const newTask = new Task({
        title: req.body.title,
        user: req.user.id,
        completed: req.body.completed,
      });
      try {
        const savedTask = await newTask.save();
        return res.status(200).send(savedTask);
      } catch (err) {
        return next(err);
      }
})

router.get('/hello',(req,res) => {
    res.send("hello world");
})

//get all task
router.get('/all',async(req,res,next)=>{
    try {
        const tasks = await Task.find({});
        return res.status(200).json(tasks);
      } catch (err) {
        return next(err);
      }
})

//user task
router.get('/myTask',async(req,res,next)=>{
    try {
        const tasks = await Task.find({ user: req.user.id });
        return res.status(200).json(tasks);
      } catch (err) {
        return next(err);
      }
})


//updateTask
router.put('/:taskId',async(req,res,next)=>{
    try {
        const task = await Task.findById(req.params.taskId).exec();
        if (!task) return next(createError({ status: 404, message: 'Task not found' }));
        if (task.user.toString() !== req.user.id) return next(createError({ status: 401, message: "It's not your todo." }));
    
        const updatedTask = await Task.findByIdAndUpdate(req.params.taskId, {
          title: req.body.title,
          completed: req.body.completed,
        }, { new: true });
        return res.status(200).json(updatedTask);
      } catch (err) {
        return next(err);
      }
})

//deleteTask
router.delete('/:taskId',async(req,res,next)=>{
    try {
        const task = await Task.findById(req.params.taskId);
        if (task.user === req.user.id) {
          return next(createError({ status: 401, message: "Task not found." }));
        }
        await Task.findByIdAndDelete(req.params.taskId);
        return res.json('Task Deleted Successfully');
      } catch (err) {
        return next(err);
      }
});


//deleteAllTask
router.delete('/deleteAll',async(req,res,next)=>{
  try {
    await Task.deleteMany({ user: req.user.id });
    return res.json('All Todo Deleted Successfully');
  } catch (err) {
    return next(err);
  }
})









// router.post ('/tasks',async (req, res, next) => {
//     const newTask = new Task({
//       title: req.body.title,
//       user: req.user.id,
//       completed: req.body.completed,
//     });
//     try {
//       const savedTask = await newTask.save();
//       return res.status(200).json(savedTask);
//     } catch (err) {
//       return next(err);
//     }
//   });


// router.get('/all', getAllTasks);
// router.post('/', createTask);
// router.put('/:taskId', updateTask);
// router.get('/myTasks', getCurrentUserTasks);
// router.delete('/deleteAll', deleteAllTasks);
// router.delete('/:taskId', deleteTask);


module.exports = router;