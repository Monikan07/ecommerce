require('dotenv').config();
const connectDB = require('./config/db');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Product = require('./models/Product');

async function seed() {
  await connectDB(process.env.MONGO_URI);
  const adminEmail = 'admin@example.com';
  const existing = await User.findOne({ email: adminEmail });
  if (!existing) {
    const hashed = await bcrypt.hash('Admin@12345', 10);
    await User.create({ name: 'Admin', email: adminEmail, password: hashed, role: 'admin' });
    console.log('Admin created:', adminEmail);
  } else {
    console.log('Admin exists');
  }

const sampleProducts = [
  {
    name: 'Red T-Shirt Men',
    slug: 'red-tshirtmen',
    category: 'Clothing',
    price: 99.99,
    stock: 50,
    image: 'https://tse1.explicit.bing.net/th/id/OIP.4ykESxxHfPd39NGTMVRaGgHaE8?cb=ucfimgc2&rs=1&pid=ImgDetMain&o=7&rm=3',
    description: 'Comfortable cotton t-shirt',
  },
  {
    name: 'Blue Jeans Women',
    slug: 'blue-jeans-women',
    category: 'Clothing',
    price: 149.99,
    stock: 30,
    image: 'https://tse1.mm.bing.net/th/id/OIP.J08V2I24Z7GI9prn8rRiBgHaJ4?cb=ucfimgc2&rs=1&pid=ImgDetMain&o=7&rm=3',
    description: 'Stylish blue jeans',
  },
  {
    name: 'Wireless Mouse',
    slug: 'wireless-mouse',
    category: 'Electronics',
    price: 224.99,
    stock: 100,
    image: 'https://mytarget.my/wp-content/uploads/2021/01/LOGITECH-WIRELESS-MOUSE-M185-BLUE-2048x2048.jpg',
    description: 'Ergonomic wireless mouse',
  },
];
 

  for (const p of sampleProducts) {
    const exists = await Product.findOne({ slug: p.slug });
    if (!exists) {
      await Product.create(p);
      console.log('Seeded:', p.name);
    } else {
      console.log('Product exists:', p.slug);
    }
  }
  mongoose.connection.close();
}

seed().catch(err => { console.error(err); process.exit(1); });
