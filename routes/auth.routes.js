const express = require("express");
const router = express.Router();
const controller = require('../controllers/auth.controller');


// Đăng ký
router.post("/register", controller.Register);

// Xác thực email
router.get("/verify-email", controller.VerfiyEmail);

// Đăng nhập
router.post("/login", controller.Login);

module.exports = router;