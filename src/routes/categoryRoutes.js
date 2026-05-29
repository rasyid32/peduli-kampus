const express = require('express');
const {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers/categoryController');
const authMiddleware = require('../middlewares/authMiddleware');
const { requireAdmin } = require('../middlewares/roleMiddleware');

const router = express.Router();

/**
 * File ini dikerjakan oleh Anggota 4 untuk CRUD kategori fasilitas.
 * 
 * Endpoint yang disediakan:
 * GET /api/categories - Melihat daftar kategori (semua user)
 * GET /api/categories/:id - Melihat detail kategori (semua user)
 * POST /api/categories - Tambah kategori (teknisi/admin only)
 * PUT /api/categories/:id - Edit kategori (teknisi/admin only)
 * DELETE /api/categories/:id - Hapus kategori (teknisi/admin only)
 */

// GET /api/categories - Daftar semua kategori (tanpa authentikasi)
router.get('/', getAllCategories);

// GET /api/categories/:id - Detail kategori (tanpa authentikasi)
router.get('/:id', getCategoryById);

// POST /api/categories - Tambah kategori (authentikasi + admin only)
router.post('/', authMiddleware, requireAdmin, createCategory);

// PUT /api/categories/:id - Edit kategori (authentikasi + admin only)
router.put('/:id', authMiddleware, requireAdmin, updateCategory);

// DELETE /api/categories/:id - Hapus kategori (authentikasi + admin only)
router.delete('/:id', authMiddleware, requireAdmin, deleteCategory);

module.exports = router;
