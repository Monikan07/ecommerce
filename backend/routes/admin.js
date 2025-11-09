const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const Product = require('../models/Product');
const Order = require('../models/Order');
const Revenue = require('../models/Revenue');
const auth = require('../middleware/auth');
const isAdmin = require('../middleware/admin');
const { Parser } = require('json2csv');

const upload = multer({ dest: path.join(__dirname, '../uploads/') });

const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden' });
  }
  next();
};

router.post('/products/upload', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
  const fileUrl = `/uploads/${req.file.filename}`;
  res.json({ image: fileUrl });
});

router.post('/login', require('./adminLoginHandler'));

router.get('/profile', auth, isAdmin, (req, res) => {
  res.json(req.user);
});


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

router.post('/products', auth, isAdmin, async (req, res) => {
  try {
    const data = req.body;
    const p = await Product.create(data);
    res.status(201).json(p);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.get('/products/:id', auth, async (req, res) => {
  try {
    const p = await Product.findById(req.params.id);
    if (!p) return res.status(404).json({ message: 'Not found' });
    res.json(p);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/products/:id', auth, isAdmin, async (req, res) => {
  try {
    const p = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(p);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/products/:id', auth, isAdmin, async (req, res) => {
  try {
    const p = await Product.findByIdAndUpdate(req.params.id, { isDeleted: true }, { new: true });
    res.json({ success: true, product: p });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.get('/orders', auth, isAdmin, async (req, res) => {
  try {
    let { page = 1, limit = 12, q = '', status } = req.query;
    page = Number(page);
    limit = Number(limit);
    const filter = {};
    if (q) {
      filter.$or = [
        { 'shippingAddress.address': new RegExp(q, 'i') },
        { 'shippingAddress.city': new RegExp(q, 'i') },
        { 'shippingAddress.postalCode': new RegExp(q, 'i') },
      ];
    }
    if (status) filter.status = status;

    const total = await Order.countDocuments(filter);
    const orders = await Order.find(filter)
      .populate('user', 'email name')
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });
    res.json({ orders, page, totalPages: Math.ceil(total / limit), total });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/orders/:id', auth, isAdmin, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'email name');
    if (!order) return res.status(404).json({ message: 'Not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/orders/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    const prevStatus = order.status;
    order.status = status;
    await order.save();

    if (status.toLowerCase() === 'delivered' && prevStatus.toLowerCase() !== 'delivered') {
      let revenueDoc = await Revenue.findOne();
      if (!revenueDoc) {
        revenueDoc = new Revenue({ totalRevenue: 0 });
      }
      revenueDoc.totalRevenue += order.totalPrice;
      await revenueDoc.save();
    }

    res.json({ message: 'Status updated', order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/revenue', async (req, res) => {
  let revenueDoc = await Revenue.findOne();
  if (!revenueDoc) revenueDoc = { totalRevenue: 0 };
  res.json({ totalRevenue: revenueDoc.totalRevenue });
});

router.get('/orders/export', auth, isAdmin, async (req, res) => {
  try {
    const orders = await Order.find().populate('user', 'name email');

    if (!orders.length) return res.status(404).json({ message: 'No orders found' });

    const data = orders.map(o => ({
      orderId: o._id.toString(),
      userName: o.user?.name || '',
      userEmail: o.user?.email || '',
      totalPrice: o.totalPrice,
      status: o.status,
      createdAt: o.createdAt ? o.createdAt.toISOString() : '',
    }));

    const parser = new Parser();
    const csv = parser.parse(data);

    res.header('Content-Type', 'text/csv');
    res.attachment('orders.csv');
    res.send(csv);

  } catch (err) {
    console.error('Export CSV Error:', err);
    res.status(500).json({ message: 'Failed to export orders' });
  }
});

router.post('/orders/export', auth, isAdmin, async (req, res) => {
  try {
    const { selectedIds } = req.body;

    const orders = selectedIds?.length
      ? await Order.find({ _id: { $in: selectedIds } }).populate('user', 'name email')
      : await Order.find().populate('user', 'name email');

    const csvData = orders.map(order => ({
      OrderID: order._id,
      Customer: order.user?.name || 'N/A',
      Email: order.user?.email || 'N/A',
      Total: order.totalPrice,
      Status: order.status,
      Date: order.createdAt
    }));

    const parser = new Parser({ fields: ['OrderID', 'Customer', 'Email', 'Total', 'Status', 'Date'] });
    const csv = parser.parse(csvData);

    res.header('Content-Type', 'text/csv');
    res.attachment('orders.csv');
    res.send(csv);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to export orders' });
  }
});

module.exports = router;