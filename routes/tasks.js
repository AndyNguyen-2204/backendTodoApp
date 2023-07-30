const express = require('express');
const router = express.Router();
const Task = require('../models/task');

// API lấy danh sách các công việc
router.get('/tasks/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const tasks = await Task.find({ userId }); // Tìm các công việc của user dựa vào id user
    res.send(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// API tạo công việc mới
router.post('/tasks/:userId', async (req, res) => {
  const userId = req.params.userId;
  const task = new Task({
    title: req.body.title,
    description: req.body.description,
    userId
  });

  try {
    // Tìm các task có cùng userId
    const tasksWithUserId = await Task.find({ userId });

    // Thêm task mới vào mảng tasks của user
    tasksWithUserId.push(task);

    // Lưu lại mảng tasks đã được cập nhật
    const updatedTasks = await Promise.all(tasksWithUserId.map(task => task.save()));

    res.status(201).json(updatedTasks); // Trả về danh sách các task sau khi thêm mới
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// // API lấy thông tin công việc theo ID
// router.get('/tasks/:id', getTask, (req, res) => {
//   res.json(res.task); 
// });

// // API cập nhật thông tin công việc theo ID
// router.put('/tasks/:id', getTask, async (req, res) => {
//   if (req.body.title != null) {
//     res.task.title = req.body.title;
//   }

//   if (req.body.description != null) {
//     res.task.description = req.body.description;
//   }

//   try {
//     const updatedTask = await res.task.save();
//     res.json(updatedTask);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });

// // API xóa công việc theo ID
// router.delete('/tasks/:id', getTask, async (req, res) => {
//   try {
//     // await res.task.remove();
//     await  Task.findOneAndDelete(res.task._id)
//     res.json({ message: 'Xóa công việc thành công!' });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// Middleware để lấy thông tin công việc theo ID

module.exports = router;
