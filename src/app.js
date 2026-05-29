const express = require('express');
const cors = require('cors');
require('dotenv').config({ quiet: true });

// Import routes
const categoryRoutes = require('./routes/categoryRoutes');
const reportUpdateRoutes = require('./routes/reportUpdateRoutes');
// Routes dari anggota lain (akan diimplementasikan kemudian)
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const reportRoutes = require('./routes/reportRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'API peduli-kampus berjalan' });
});

// Routes
app.use('/api/categories', categoryRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/reports', reportRoutes);

// Nested route untuk report updates
// GET /api/reports/:id/updates
// POST /api/reports/:id/updates
app.use('/api/reports/:id/updates', reportUpdateRoutes);

module.exports = app;
