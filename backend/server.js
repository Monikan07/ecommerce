const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const adminRoutes = require('./routes/admin');
const userRoutes = require('./routes/user');
const orderRoutes = require('./routes/orders')

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:3000'], credentials: true }));

app.use('/api/auth', require('./routes/auth'));

app.use('/api/products', require('./routes/products'));

app.use('/api/orders', require('./routes/orders'));  

app.use('/api/admin', require('./routes/admin'));

app.use('/api/user', require('./routes/user')); 

const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
