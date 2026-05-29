const express = require('express');
const cors = require('cors');
require('dotenv').config({ quiet: true });

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'API peduli-kampus berjalan' });
});

module.exports = app;
