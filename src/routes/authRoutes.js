const express = require('express');
const { register, login } = require('../controllers/authController');

const router = express.Router();

/**
 * Auth Routes - Anggota 2
 * POST /api/auth/register - Register user baru
 * POST /api/auth/login    - Login dan mendapatkan JWT token
 */

router.post('/register', register);
router.post('/login', login);

module.exports = router;
