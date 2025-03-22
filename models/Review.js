const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  review_id: {
    type: Number,
    required: true,
    unique: true
  },
  user_id: {
    type: String,
    required: true
  },
  product_id: {
    type: Number,
    required: true,
    index: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
    
  },
  comment: {
    type: String,
    required: true
  },
  date_created: {
    type: Date,
    default: Date.now
  }
});

ReviewSchema.index({ product_id: 1 });
ReviewSchema.index({ date_created: -1 });

module.exports = mongoose.model('Review', ReviewSchema);