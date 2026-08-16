const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  category: {
    type: String,
    enum: ["book", "electronics", "furniture", "cycle", "notes", "appliance", "clothing", "sports", "other"],
    required: true,
  },
  condition: {
    type: String,
    enum: ["like_new", "good", "fair"],
  },
  price: {
    type: Number,
    default: 0,
  },
  images: [
    {
      type: String,
    },
  ],
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  status: {
    type: String,
    enum: ['available', 'sold'],
    default: 'available',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Item = mongoose.model('Item', itemSchema);
module.exports = Item;
