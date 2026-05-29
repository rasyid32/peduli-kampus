const express = require('express');
const {
  getReportUpdates,
  createReportUpdate,
} = require('../controllers/reportUpdateController');
const authMiddleware = require('../middlewares/authMiddleware');
const { requireAdmin } = require('../middlewares/roleMiddleware');

const router = express.Router({ mergeParams: true });

/**
 * File ini dikerjakan oleh Anggota 4 untuk riwayat update laporan
 * dan update status laporan oleh teknisi/admin.
 * 
 * Endpoint yang disediakan:
 * GET /api/reports/:id/updates - Melihat riwayat update laporan
 * POST /api/reports/:id/updates - Menambah update status laporan (teknisi/admin only)
 * 
 * Catatan: Router menggunakan mergeParams: true agar bisa mengakses
 * parameter :id dari parent router
 */

// GET /api/reports/:id/updates - Melihat riwayat update laporan
// Membutuhkan autentikasi
router.get('/', authMiddleware, getReportUpdates);

// POST /api/reports/:id/updates - Menambah update status laporan
// Membutuhkan autentikasi + role teknisi_admin
router.post('/', authMiddleware, requireAdmin, createReportUpdate);

module.exports = router;
