const mongoose = require('mongoose');
const { Schema } = mongoose;

//Schema definition
const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
      },
      completed: {
        type: Boolean,
        required: true,
        default: false,
      },
      user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
    }, { timestamps: true });


//Model creation
module.exports = mongoose.model('task', taskSchema);

//here task in module refers to collection
//employees in env file refers to db