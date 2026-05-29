const express = require('express');
const cors = require('cors');
require('dotenv').config({ quiet: true });

const categoryRoutes = require('./routes/categoryRoutes');
const reportUpdateRoutes = require('./routes/reportUpdateRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'API peduli-kampus berjalan' });
});

app.use('/api/categories', categoryRoutes);
app.use('/api/reports/:id/updates', reportUpdateRoutes);

module.exports = app;
