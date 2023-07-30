const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  userId:{type:String,require:true},
  status:{type:String,require:true},
  time:{type:String}
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
