const express = require('express');
const cors = require('cors');
require('dotenv').config({ quiet: true });

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'API peduli-kampus berjalan' });
});

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

module.exports = app;
