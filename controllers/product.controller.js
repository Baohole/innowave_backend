
const Product = require('../models/Product');

// GET all products
module.exports.AllProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .select('-__v -_id')
      .lean();

    res.json({
      success: true,
      count: products.length,
      products: products
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
}

// GET single product by product_id
module.exports.GetProducById = async (req, res) => {
  try {
    const productId = parseInt(req.params.product_id);
    
    if (isNaN(productId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid product ID format'
      });
    }

    const product = await Product.findOne({ product_id: productId })
      .select('-__v -_id')
      .lean();

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }

    res.json({
      success: true,
      product: product
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};