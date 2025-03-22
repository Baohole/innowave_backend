const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json()); // Use JSON parser


// Load biến môi trường
dotenv.config();

const connectDB = require("./config/database");
connectDB(); // Gọi hàm connectDB đã được export

const router = require('./routes/index.routes');
router(app);

// Middleware
app.use(cors());
app.use(express.json());

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));

// Khởi động server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));