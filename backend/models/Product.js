const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: false },
  slug: { type: String, required: true, unique: true },
  category: { type: String },
  weight: { type: String },
  price: { type: Number, required: true },
  stock: { type: Number, default: 0 },
  image: [{ type: String }],
  description: { type: String },
  isDeleted: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
