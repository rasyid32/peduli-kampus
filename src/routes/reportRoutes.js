const express = require('express');
const { authenticate } = require('../middlewares/authMiddleware');
const { authorizeRoles } = require('../middlewares/roleMiddleware');
const {
  getAllReports,
  getReportById,
  createReport,
  updateReport,
  deleteReport,
} = require('../controllers/reportController');

const router = express.Router();

/**
 * File ini dikerjakan oleh Anggota 3 untuk CRUD laporan kerusakan.
 *
 * Semua endpoint memerlukan autentikasi (JWT).
 *
 * Endpoint:
 * GET    /api/reports      - Daftar laporan (mahasiswa: miliknya sendiri, teknisi/admin: semua)
 * GET    /api/reports/:id  - Detail laporan (mahasiswa: miliknya sendiri, teknisi/admin: semua)
 * POST   /api/reports      - Buat laporan baru (hanya mahasiswa)
 * PUT    /api/reports/:id  - Edit laporan (mahasiswa: miliknya & status menunggu, teknisi/admin: semua)
 * DELETE /api/reports/:id  - Hapus laporan (mahasiswa: miliknya & status menunggu, teknisi/admin: semua)
 */

// Semua route di bawah ini memerlukan autentikasi
router.use(authenticate);

// GET /api/reports - Daftar laporan
router.get('/', getAllReports);

// GET /api/reports/:id - Detail laporan
router.get('/:id', getReportById);

// POST /api/reports - Buat laporan baru (hanya mahasiswa)
router.post('/', authorizeRoles('mahasiswa'), createReport);

// PUT /api/reports/:id - Edit laporan
router.put('/:id', updateReport);

// DELETE /api/reports/:id - Hapus laporan
router.delete('/:id', deleteReport);

module.exports = router;
