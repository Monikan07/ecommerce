const mongoose = require('mongoose');

const RevenueSchema = new mongoose.Schema({
  totalRevenue: { type: Number, default: 0 }
});

module.exports = mongoose.model('Revenue', RevenueSchema);
