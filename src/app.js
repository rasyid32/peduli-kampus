const express = require('express');
const cors = require('cors');
require('dotenv').config({ quiet: true });

const app = express();

app.use(cors());
app.use(express.json());

// Routes
const reportRoutes = require('./routes/reportRoutes');

app.get('/', (req, res) => {
  res.json({ message: 'API peduli-kampus berjalan' });
});

app.use('/api/reports', reportRoutes);

module.exports = app;
