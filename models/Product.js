const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  product_id: {
    type: Number,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  description: mongoose.Schema.Types.Mixed,
  stock: Number,
  category_id: Number,
  image_url: String,
  original_price: Number,
  discount_percentage: Number,
  discounted_price: Number
});

ProductSchema.index({ product_id: 1 });

module.exports = mongoose.model('Product', ProductSchema);