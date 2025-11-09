const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  console.log('Authorization header:', authHeader); 
  console.log('Token extracted:', token); 

  if (!token) return res.status(401).json({ message: 'No token' });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    console.log('JWT payload:', payload); 

    const user = await User.findById(payload.id).select('-password');
    console.log('User found:', user);

    if (!user) return res.status(401).json({ message: 'Invalid token' });

    req.user = user;
    next();
  } catch (err) {
    console.error('JWT error:', err); 
    res.status(401).json({ message: 'Token invalid' });
  }
};

module.exports = auth;
