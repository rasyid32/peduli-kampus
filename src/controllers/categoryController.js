/**
 * File ini dikerjakan oleh Anggota 4 untuk CRUD kategori fasilitas.
 * Fitur:
 * - GET /api/categories - Melihat daftar kategori (semua user)
 * - POST /api/categories - Tambah kategori (teknisi/admin only)
 * - PUT /api/categories/:id - Edit kategori (teknisi/admin only)
 * - DELETE /api/categories/:id - Hapus kategori (teknisi/admin only)
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * GET /api/categories
 * Mengambil daftar semua kategori
 * Akses: Semua user (mahasiswa dan teknisi/admin)
 */
const getAllCategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    res.status(200).json({
      success: true,
      message: 'Daftar kategori berhasil diambil',
      data: categories,
    });
  } catch (error) {
    console.error('Error in getAllCategories:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil daftar kategori',
      error: error.message,
    });
  }
};

/**
 * GET /api/categories/:id
 * Mengambil detail kategori berdasarkan ID
 * Akses: Semua user
 */
const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await prisma.category.findUnique({
      where: { id: parseInt(id) },
      select: {
        id: true,
        name: true,
        description: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Kategori tidak ditemukan',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Detail kategori berhasil diambil',
      data: category,
    });
  } catch (error) {
    console.error('Error in getCategoryById:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil detail kategori',
      error: error.message,
    });
  }
};

/**
 * POST /api/categories
 * Membuat kategori baru
 * Akses: Teknisi/Admin only
 * Request body:
 * {
 *   "name": "Kerusakan Pintu",
 *   "description": "Kategori untuk kerusakan pintu dan jendela"
 * }
 */
const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    // Validasi input
    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Nama kategori harus diisi',
      });
    }

    if (name.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Nama kategori tidak boleh kosong',
      });
    }

    // Cek apakah nama kategori sudah ada
    const existingCategory = await prisma.category.findUnique({
      where: { name: name.trim() },
    });

    if (existingCategory) {
      return res.status(409).json({
        success: false,
        message: 'Kategori dengan nama tersebut sudah ada',
      });
    }

    // Buat kategori baru
    const newCategory = await prisma.category.create({
      data: {
        name: name.trim(),
        description: description ? description.trim() : null,
      },
      select: {
        id: true,
        name: true,
        description: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Kategori berhasil dibuat',
      data: newCategory,
    });
  } catch (error) {
    console.error('Error in createCategory:', error);

    // Jika error karena unique constraint
    if (error.code === 'P2002') {
      return res.status(409).json({
        success: false,
        message: 'Kategori dengan nama tersebut sudah ada',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Gagal membuat kategori',
      error: error.message,
    });
  }
};

/**
 * PUT /api/categories/:id
 * Mengubah kategori berdasarkan ID
 * Akses: Teknisi/Admin only
 * Request body:
 * {
 *   "name": "Kerusakan Pintu Baru",
 *   "description": "Deskripsi baru"
 * }
 */
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    // Validasi ID
    const categoryId = parseInt(id);
    if (isNaN(categoryId)) {
      return res.status(400).json({
        success: false,
        message: 'ID kategori tidak valid',
      });
    }

    // Cek apakah kategori ada
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Kategori tidak ditemukan',
      });
    }

    // Jika nama diubah, cek apakah nama baru sudah ada
    if (name && name.trim() !== category.name) {
      const existingCategory = await prisma.category.findUnique({
        where: { name: name.trim() },
      });

      if (existingCategory) {
        return res.status(409).json({
          success: false,
          message: 'Kategori dengan nama tersebut sudah ada',
        });
      }
    }

    // Update kategori
    const updateData = {};
    if (name !== undefined) updateData.name = name.trim();
    if (description !== undefined) updateData.description = description ? description.trim() : null;

    const updatedCategory = await prisma.category.update({
      where: { id: categoryId },
      data: updateData,
      select: {
        id: true,
        name: true,
        description: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.status(200).json({
      success: true,
      message: 'Kategori berhasil diubah',
      data: updatedCategory,
    });
  } catch (error) {
    console.error('Error in updateCategory:', error);

    // Jika error karena unique constraint
    if (error.code === 'P2002') {
      return res.status(409).json({
        success: false,
        message: 'Kategori dengan nama tersebut sudah ada',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Gagal mengubah kategori',
      error: error.message,
    });
  }
};

/**
 * DELETE /api/categories/:id
 * Menghapus kategori berdasarkan ID
 * Akses: Teknisi/Admin only
 * CATATAN: Jika ada laporan yang menggunakan kategori ini,
 * penghapusan akan ditolak karena foreign key constraint (onDelete: Restrict)
 */
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    // Validasi ID
    const categoryId = parseInt(id);
    if (isNaN(categoryId)) {
      return res.status(400).json({
        success: false,
        message: 'ID kategori tidak valid',
      });
    }

    // Cek apakah kategori ada
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Kategori tidak ditemukan',
      });
    }

    // Cek apakah ada laporan yang menggunakan kategori ini
    const reportsWithCategory = await prisma.report.count({
      where: { categoryId: categoryId },
    });

    if (reportsWithCategory > 0) {
      return res.status(409).json({
        success: false,
        message: `Kategori tidak bisa dihapus karena masih digunakan oleh ${reportsWithCategory} laporan. Hapus atau ubah kategori laporan terlebih dahulu.`,
      });
    }

    // Hapus kategori
    await prisma.category.delete({
      where: { id: categoryId },
    });

    res.status(200).json({
      success: true,
      message: 'Kategori berhasil dihapus',
    });
  } catch (error) {
    console.error('Error in deleteCategory:', error);

    // Jika error karena foreign key constraint
    if (error.code === 'P2014') {
      return res.status(409).json({
        success: false,
        message: 'Kategori tidak bisa dihapus karena masih digunakan oleh laporan lain',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Gagal menghapus kategori',
      error: error.message,
    });
  }
};

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
