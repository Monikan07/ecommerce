const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const auth = require('../middleware/auth');

router.get('/products', auth, async (req, res) => {
  try {
    let { page = 1, limit = 12, q = '' } = req.query;
    page = Number(page);
    limit = Number(limit);
    const filter = q ? { name: new RegExp(q, 'i') } : {};
    const total = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .skip((page - 1) * limit)
      .limit(limit);
    res.json({ products, page, totalPages: Math.ceil(total / limit), total });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/orders/my', auth, async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.json(orders);
});


module.exports = router;