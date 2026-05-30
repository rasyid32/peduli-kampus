const express = require('express');
const cors = require('cors');
require('dotenv').config({ quiet: true });

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// Routes
const reportRoutes = require('./routes/reportRoutes');

app.get('/', (req, res) => {
  res.json({ message: 'API peduli-kampus berjalan' });
});

app.use('/api/reports', reportRoutes);
// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

module.exports = app;
