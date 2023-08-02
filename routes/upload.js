const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const User = require('../models/login');

const uploadDir = path.join(__dirname, '../uploads/avatars');
if (!fs.existsSync(uploadDir)) {
  try {
    fs.mkdirSync(uploadDir, { recursive: true });
  } catch (err) {
    console.error('Error while creating the upload directory:', err);
    return res.status(500).send('Error while creating the upload directory.');
  }
}
// Tạo storage engine để chỉ định nơi lưu trữ file
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const date = new Date().toString() 
    const ext = path.extname(file.originalname)
    let name = path.basename(file.originalname, ext)
    // Xóa các ký tự không hợp lệ khỏi tên tệp
    name = name.replace(/[^a-z0-9]/gi, '_');
    cb(null, name + "_" + date + ext);
  }
});

// Khởi tạo multer với storage engine đã tạo
const upload = multer({ storage: storage });

// Định nghĩa route cho trang upload
router.post('/upload', upload.single('image'), async (req, res) => {
  try {
    // Nếu bạn muốn thực hiện một số xử lý sau khi đã upload thành công, bạn có thể sử dụng req.file
    const file = req.file
    const serverBaseUrl = 'http://localhost:8080'; // Replace with your server's base URL
    const imageUrl = `${serverBaseUrl}/uploads/avatars/${file.filename}`;
    return res.status(200).send(imageUrl);
  } catch (error) {
    console.error('Error while processing the upload:', error);
    return res.status(500).send('Error while processing the upload.');
  }
});

module.exports = router;
