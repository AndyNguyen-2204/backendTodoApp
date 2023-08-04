const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 8080;

// Kết nối tới MongoDB
mongoose.connect('mongodb+srv://nguyenanhtu:anhtu1999@cluster0.mbwchdw.mongodb.net/mydataBase', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Lỗi kết nối MongoDB:'));
db.once('open', function () {
  console.log('Đã kết nối thành công tới MongoDB.');
});

// Cấu hình body-parser để phân tích nội dung yêu cầu
app.use(bodyParser.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

// Kết nối các routes vào ứng dụng Express
const taskRoutes = require('./routes/tasks');
app.use('/api', taskRoutes);
const userRoutes = require('./routes/login');
app.use('/api', userRoutes);
const uploadRoutes = require('./routes/upload');
app.use('/api', uploadRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Lắng nghe các kết nối
app.listen(port, () => {
  console.log(`Server đang chạy tại http://localhost:${port}`);
});