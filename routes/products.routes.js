const express = require('express');
const router = express.Router();
const controller = require('../controllers/product.controller')

// GET all products
router.get('/', controller.AllProducts);

// GET single product by product_id
router.get('/:product_id', controller.GetProducById);

module.exports = router;