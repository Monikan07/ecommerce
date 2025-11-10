const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const auth = require('../middleware/auth');

const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') next();
  else res.status(403).json({ message: 'Access denied' });
};


router.post('/', auth, async (req, res) => {
  try {
    const { items, shippingAddress } = req.body;
    if (!items || items.length === 0) return res.status(400).json({ message: 'No items' });
    let total = 0;
    const processedItems = [];
    for (const it of items) {
      const prod = await Product.findById(it.product);
      if (!prod) return res.status(400).json({ message: 'Product not found' });
      if (prod.stock < it.qty) return res.status(400).json({ message: `Insufficient stock for ${prod.name}` });
      processedItems.push({
        product: prod._id,
        name: prod.name,
        price: prod.price,
        qty: it.qty
      });
      total += prod.price * it.qty;
    }
    const order = await Order.create({
      user: req.user._id,
      items: processedItems,
      shippingAddress,
      totalPrice: total
    });
    for (const it of processedItems) {
      await Product.findByIdAndUpdate(it.product, { $inc: { stock: -it.qty } });
    }
    res.status(201).json(order);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/my', auth, async (req, res) => {
  const orders = await Order.find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .populate('items.product');
  res.json(orders);
});


router.get('/:id', auth, async (req, res) => {
  const order = await Order.findById(req.params.id).populate('items.product').populate('user', 'email name');
  if (!order) return res.status(404).json({ message: 'Not found' });
  if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden' });
  }
  res.json(order);
});

router.put('/:id/cancel', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (['Delivered', 'Cancelled', 'Shipped'].includes(order.status)) {
      return res.status(400).json({ message: `Cannot cancel order with status ${order.status}` });
    }

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    order.status = 'Cancelled';
    await order.save();

    res.json({ message: 'Order cancelled', order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

router.put('/:id/status', auth, isAdmin, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    order.status = req.body.status;
    await order.save();

    res.json({ message: 'Order status updated successfully', order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.patch('/:id/status', auth, isAdmin, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    order.status = req.body.status;
    await order.save();

    res.json({ message: 'Order status updated successfully', order });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/orders/export', auth, isAdmin, async (req, res) => {
  try {
    const { selectedIds } = req.body;
    const filter = selectedIds?.length ? { _id: { $in: selectedIds } } : {};
    const orders = await Order.find(filter).populate('user', 'name email');

    if (!orders.length) return res.status(404).json({ message: 'No orders found' });

    const data = orders.map(o => ({
      orderId: o._id.toString(),
      userName: o.user?.name || '',
      userEmail: o.user?.email || '',
      totalPrice: o.totalPrice || 0,
      status: o.status || '',
      createdAt: o.createdAt?.toISOString() || '',
    }));

    const parser = new Parser();
    const csv = parser.parse(data);

    res.header('Content-Type', 'text/csv');
    res.attachment('orders.csv');
    res.send(csv);
  } catch (err) {
    console.error('Export CSV Error:', err.message);
    res.status(500).json({ message: 'Failed to export orders' });
  }
});


module.exports = router;
