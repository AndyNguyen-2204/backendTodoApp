const express = require('express');
const router = express.Router();
const User = require('../models/login');
const jwt = require('jsonwebtoken');
const tokenExpiration = '1h';
const secretKey = 'your-secret-key';
const bodyParser = require('body-parser');
const session = require('express-session');
const bcrypt = require('bcrypt');

// API lấy danh sách các công việc
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Tìm tài khoản người dùng trong MongoDB
    const user = await User.findOne({ username });

    // Kiểm tra mật khẩu hợp lệ
    if (user && await password === user.password) {
      // Tạo mã token
      const token = jwt.sign({ username: user.username }, secretKey, { expiresIn: tokenExpiration });

      res.send({
        messeger:"Đăng nhập thành công",
        token,
        user
      })
    } else {
      return res.status(401).send('Tên đăng nhập hoặc mật khẩu không đúng!');
    }
  } catch (error) {
    console.error('Đăng nhập thất bại:', error);
    res.status(500).send('Đăng nhập thất bại!');
  }
});
//đăng ký 
router.post('/register', async (req, res) => {
  const { username, password} = req.body;

  try {
    // Kiểm tra xem tên đăng nhập đã tồn tại trong MongoDB chưa
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(401).send('Tên đăng nhập đã tồn tại! Vui lòng chọn tên khác.');
    }

    // Tạo người dùng mới và lưu vào MongoDB
    const newUser = new User({
      username,
      password
    });
    await newUser.save();

    res.send('Đăng ký thành công!');

  } catch (error) {
    console.error('Đăng ký thất bại:', error);
    res.status(500).send('Đăng ký thất bại!');
  }
});

router.get('/logout', async (req, res) => {

  try {
    // Kiểm tra xem tên đăng nhập đã tồn tại trong MongoDB chưa
    res.send('Đăng xuất thành công!');

  } catch (error) {
    res.status(500).send('Đăng xuất thất bại!');
  }
});


module.exports = router;
