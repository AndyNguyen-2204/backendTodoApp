const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = 8080;

// Kết nối tới MongoDB
mongoose.connect('mongodb://localhost:27017/mydatabase', {
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

// Kết nối các routes vào ứng dụng Express
const taskRoutes = require('./routes/tasks');
app.use('/api', taskRoutes);
const userRoutes = require('./routes/login');
app.use('/api', userRoutes);

// Lắng nghe các kết nối
app.listen(port, () => {
  console.log(`Server đang chạy tại http://localhost:${port}`);
});