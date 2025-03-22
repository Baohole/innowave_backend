const express = require('express');
const router = express.Router(); // <-- Thêm dòng này

const controller = require('../controllers/reviews.controller')

router.get('/product/:product_id', controller.Review);

module.exports = router; 