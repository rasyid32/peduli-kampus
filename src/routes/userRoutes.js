const express = require('express');
const { getMe, getAllUsers } = require('../controllers/userController');
const authenticate = require('../middlewares/authMiddleware');
const authorize = require('../middlewares/roleMiddleware');

const router = express.Router();

/**
 * User Routes - Anggota 2
 * GET /api/users/me - Mengambil profile user yang sedang login
 * GET /api/users    - Mengambil daftar semua user (khusus teknisi_admin)
 */

router.get('/me', authenticate, getMe);
router.get('/', authenticate, authorize('teknisi_admin'), getAllUsers);

module.exports = router;
