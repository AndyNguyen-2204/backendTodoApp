const express = require('express');
const router = express.Router();
const Task = require('../models/task');

// API lấy danh sách các công việc
router.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.send(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// API tạo công việc mới
router.post('/tasks', async (req, res) => {
  const task = new Task({
    title: req.body.title,
    description: req.body.description,
  });

  try {
    const newTask = await task.save();
    res.status(201).json(newTask);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// API lấy thông tin công việc theo ID
router.get('/tasks/:id', getTask, (req, res) => {
  res.json(res.task); 
});

// API cập nhật thông tin công việc theo ID
router.put('/tasks/:id', getTask, async (req, res) => {
  if (req.body.title != null) {
    res.task.title = req.body.title;
  }

  if (req.body.description != null) {
    res.task.description = req.body.description;
  }

  try {
    const updatedTask = await res.task.save();
    res.json(updatedTask);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// API xóa công việc theo ID
router.delete('/tasks/:id', getTask, async (req, res) => {
  try {
    // await res.task.remove();
    await  Task.findOneAndDelete(res.task._id)
    res.json({ message: 'Xóa công việc thành công!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Middleware để lấy thông tin công việc theo ID
async function getTask(req, res, next) {
  try {
    const task = await Task.findById(req.params.id);
    if (task == null) {
      return res.status(404).json({ message: 'Không tìm thấy công việc!' });
    }
    res.task = task;
    next();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}


module.exports = router;
