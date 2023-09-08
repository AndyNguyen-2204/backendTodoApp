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
    process.exit(1);
  }
}
// Tạo storage engine để chỉ định nơi lưu trữ file
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const date = Date.now();
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
    if (!req.file) {
      return res.status(400).send('Không có file được upload');
    }
    const file = req.file
    const userId = req.body.userId;
    const serverBaseUrl = 'http://localhost:8000';
    const user = await User.findById(userId)
    let imageUrl = null;
    if (user.avatar) {
      // Trích xuất tên tệp cũ từ URL ảnh đại diện
      const oldFileName = user.avatar.split('/').pop();
      // Xây dựng đường dẫn đầy đủ đến ảnh đại diện cũ
      const oldFilePath = path.join(uploadDir, oldFileName);
      // Kiểm tra xem ảnh đại diện cũ tồn tại và xóa nó
      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
      }
    }
    imageUrl = `${serverBaseUrl}/uploads/avatars/${file.filename}`;
    user.avatar = imageUrl
    await user.save();
    return res.status(200).send(imageUrl);
  } catch (error) {
    console.error('Error while processing the upload:', error);
    return res.status(500).send('Error while processing the upload.');
  }
});

module.exports = router;
