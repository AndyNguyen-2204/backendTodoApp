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
    res.status(500).send("Láy danh sách công việc thất bại");
  }
});

// API tạo công việc mới
router.post('/tasks/:userId', async (req, res) => {
  const userId = req.params.userId;
  const task = new Task({
    title: req.body.title,
    description: req.body.description,
    userId,
    status:req.body.status,
    time:req.body.time
  });

  try {
    // Tìm các task có cùng userId
    const tasksWithUserId = await Task.find({ userId });

    // Thêm task mới vào mảng tasks của user
    tasksWithUserId.push(task);

    // Lưu lại mảng tasks đã được cập nhật
    const updatedTasks = await Promise.all(tasksWithUserId.map(task => task.save()));

    res.status(201).send("Thêm công việc thành công"); // Trả về danh sách các task sau khi thêm mới
  } catch (error) {
    res.status(400).send("Thêm công việc thất bại");
  }
});

// // API lấy thông tin công việc theo ID
// router.get('/tasks/:id', getTask, (req, res) => {
//   res.json(res.task); 
// });

// API cập nhật thông tin công việc theo ID
router.put('/tasks/:id', async (req, res) => {
  const taskId = req.params.id;

  try {
    // Find the task by ID
    const task = await Task.findById(taskId);

    if (!task) {
      // Task with the provided ID not found
      return res.status(404).send('Công việc không tồn tại');
    }

    // Update the task properties if they exist in the request body
    task.title = req.body.title;
    task.description = req.body.description;
    task.time = req.body.time;
    task.status = req.body.status;
    // Save the updated task
    const updatedTask = await task.save();
    res.send("Cập nhật công việc thành công");
  } catch (error) {
    res.status(400).send("Cập nhật công việc không thành công");
  }
});

// API xóa công việc theo ID
router.delete('/tasks/:id', async (req, res) => {
  try {
    const taskId = req.params.id;

    // Find the task by its ID and delete it
    const deletedTask = await Task.findByIdAndDelete(taskId);

    // Check if the task was found and deleted successfully
    if (!deletedTask) {
      return res.status(404).send('Công việc không tồn tại');
    }

    res.send('Xóa công việc thành công!' );
  } catch (error) {
    res.status(500).send('Xóa công việc thất bại');
  }
});

module.exports = router;
