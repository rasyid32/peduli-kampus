/**
 * File ini dikerjakan oleh Anggota 3 untuk CRUD laporan kerusakan.
 */

const prisma = require('../config/prisma');

// ============================================================
// GET /api/reports
// Mahasiswa: hanya melihat laporan miliknya sendiri
// Teknisi/Admin: melihat semua laporan
// ============================================================
const getAllReports = async (req, res) => {
  try {
    const { role, id: userId } = req.user;

    // Filter: mahasiswa hanya bisa lihat laporan miliknya
    const whereClause = role === 'mahasiswa' ? { userId } : {};

    // Query parameter untuk filter opsional
    const { status, categoryId, page = 1, limit = 10 } = req.query;

    if (status) {
      whereClause.status = status;
    }
    if (categoryId) {
      whereClause.categoryId = parseInt(categoryId);
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    const [reports, total] = await Promise.all([
      prisma.report.findMany({
        where: whereClause,
        include: {
          user: {
            select: { id: true, name: true, email: true },
          },
          category: {
            select: { id: true, name: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take,
      }),
      prisma.report.count({ where: whereClause }),
    ]);

    return res.status(200).json({
      success: true,
      message: 'Berhasil mengambil daftar laporan.',
      data: reports,
      meta: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / take),
      },
    });
  } catch (error) {
    console.error('getAllReports error:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan pada server.',
    });
  }
};

// ============================================================
// GET /api/reports/:id
// Mahasiswa: hanya bisa melihat laporan miliknya sendiri
// Teknisi/Admin: bisa melihat semua laporan
// ============================================================
const getReportById = async (req, res) => {
  try {
    const { id } = req.params;
    const { role, id: userId } = req.user;

    const report = await prisma.report.findUnique({
      where: { id: parseInt(id) },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
        category: {
          select: { id: true, name: true },
        },
        updates: {
          include: {
            user: {
              select: { id: true, name: true },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Laporan tidak ditemukan.',
      });
    }

    // Mahasiswa hanya bisa melihat laporan miliknya sendiri
    if (role === 'mahasiswa' && report.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Anda tidak memiliki akses ke laporan ini.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Berhasil mengambil detail laporan.',
      data: report,
    });
  } catch (error) {
    console.error('getReportById error:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan pada server.',
    });
  }
};

// ============================================================
// POST /api/reports
// Hanya mahasiswa yang bisa membuat laporan
// Validasi input: title, description, location, categoryId wajib
// ============================================================
const createReport = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const { title, description, location, categoryId, imageUrl, priority } = req.body;

    // ---- Validasi input ----
    const errors = [];

    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      errors.push('Judul laporan (title) wajib diisi.');
    } else if (title.trim().length > 150) {
      errors.push('Judul laporan maksimal 150 karakter.');
    }

    if (!description || typeof description !== 'string' || description.trim().length === 0) {
      errors.push('Deskripsi laporan (description) wajib diisi.');
    }

    if (!location || typeof location !== 'string' || location.trim().length === 0) {
      errors.push('Lokasi kerusakan (location) wajib diisi.');
    } else if (location.trim().length > 150) {
      errors.push('Lokasi kerusakan maksimal 150 karakter.');
    }

    if (!categoryId) {
      errors.push('Kategori laporan (categoryId) wajib diisi.');
    }

    if (priority && !['rendah', 'sedang', 'tinggi'].includes(priority)) {
      errors.push('Prioritas harus salah satu dari: rendah, sedang, tinggi.');
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validasi gagal.',
        errors,
      });
    }

    // Cek apakah category valid
    const category = await prisma.category.findUnique({
      where: { id: parseInt(categoryId) },
    });

    if (!category) {
      return res.status(400).json({
        success: false,
        message: 'Kategori tidak ditemukan.',
      });
    }

    // Buat laporan baru
    const report = await prisma.report.create({
      data: {
        title: title.trim(),
        description: description.trim(),
        location: location.trim(),
        categoryId: parseInt(categoryId),
        userId,
        imageUrl: imageUrl || null,
        priority: priority || 'sedang',
      },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
        category: {
          select: { id: true, name: true },
        },
      },
    });

    return res.status(201).json({
      success: true,
      message: 'Laporan berhasil dibuat.',
      data: report,
    });
  } catch (error) {
    console.error('createReport error:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan pada server.',
    });
  }
};

// ============================================================
// PUT /api/reports/:id
// Mahasiswa: hanya bisa edit laporan miliknya sendiri & hanya saat status "menunggu"
// Teknisi/Admin: bisa edit semua laporan (termasuk update status)
// ============================================================
const updateReport = async (req, res) => {
  try {
    const { id } = req.params;
    const { role, id: userId } = req.user;
    const { title, description, location, categoryId, imageUrl, priority, status } = req.body;

    // Cari laporan yang akan di-update
    const existingReport = await prisma.report.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingReport) {
      return res.status(404).json({
        success: false,
        message: 'Laporan tidak ditemukan.',
      });
    }

    // ---- Aturan akses mahasiswa ----
    if (role === 'mahasiswa') {
      // Mahasiswa hanya bisa edit laporan miliknya
      if (existingReport.userId !== userId) {
        return res.status(403).json({
          success: false,
          message: 'Anda tidak memiliki akses untuk mengedit laporan ini.',
        });
      }

      // Mahasiswa hanya bisa edit saat status "menunggu"
      if (existingReport.status !== 'menunggu') {
        return res.status(403).json({
          success: false,
          message: 'Laporan hanya bisa diedit saat status "menunggu".',
        });
      }

      // Mahasiswa tidak boleh mengubah status
      if (status) {
        return res.status(403).json({
          success: false,
          message: 'Mahasiswa tidak diizinkan mengubah status laporan.',
        });
      }
    }

    // ---- Validasi input ----
    const errors = [];

    if (title !== undefined) {
      if (typeof title !== 'string' || title.trim().length === 0) {
        errors.push('Judul laporan (title) tidak boleh kosong.');
      } else if (title.trim().length > 150) {
        errors.push('Judul laporan maksimal 150 karakter.');
      }
    }

    if (description !== undefined) {
      if (typeof description !== 'string' || description.trim().length === 0) {
        errors.push('Deskripsi laporan (description) tidak boleh kosong.');
      }
    }

    if (location !== undefined) {
      if (typeof location !== 'string' || location.trim().length === 0) {
        errors.push('Lokasi kerusakan (location) tidak boleh kosong.');
      } else if (location.trim().length > 150) {
        errors.push('Lokasi kerusakan maksimal 150 karakter.');
      }
    }

    if (priority && !['rendah', 'sedang', 'tinggi'].includes(priority)) {
      errors.push('Prioritas harus salah satu dari: rendah, sedang, tinggi.');
    }

    if (status && !['menunggu', 'diproses', 'selesai', 'ditolak'].includes(status)) {
      errors.push('Status harus salah satu dari: menunggu, diproses, selesai, ditolak.');
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validasi gagal.',
        errors,
      });
    }

    // Cek kategori jika categoryId di-update
    if (categoryId) {
      const category = await prisma.category.findUnique({
        where: { id: parseInt(categoryId) },
      });

      if (!category) {
        return res.status(400).json({
          success: false,
          message: 'Kategori tidak ditemukan.',
        });
      }
    }

    // Bangun data update (hanya field yang dikirim)
    const updateData = {};
    if (title !== undefined) updateData.title = title.trim();
    if (description !== undefined) updateData.description = description.trim();
    if (location !== undefined) updateData.location = location.trim();
    if (categoryId !== undefined) updateData.categoryId = parseInt(categoryId);
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl || null;
    if (priority !== undefined) updateData.priority = priority;
    if (status !== undefined) updateData.status = status;

    const updatedReport = await prisma.report.update({
      where: { id: parseInt(id) },
      data: updateData,
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
        category: {
          select: { id: true, name: true },
        },
      },
    });

    return res.status(200).json({
      success: true,
      message: 'Laporan berhasil diperbarui.',
      data: updatedReport,
    });
  } catch (error) {
    console.error('updateReport error:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan pada server.',
    });
  }
};

// ============================================================
// DELETE /api/reports/:id
// Mahasiswa: hanya bisa hapus laporan miliknya sendiri & hanya saat status "menunggu"
// Teknisi/Admin: bisa hapus semua laporan
// ============================================================
const deleteReport = async (req, res) => {
  try {
    const { id } = req.params;
    const { role, id: userId } = req.user;

    const existingReport = await prisma.report.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingReport) {
      return res.status(404).json({
        success: false,
        message: 'Laporan tidak ditemukan.',
      });
    }

    // ---- Aturan akses mahasiswa ----
    if (role === 'mahasiswa') {
      // Mahasiswa hanya bisa hapus laporan miliknya
      if (existingReport.userId !== userId) {
        return res.status(403).json({
          success: false,
          message: 'Anda tidak memiliki akses untuk menghapus laporan ini.',
        });
      }

      // Mahasiswa hanya bisa hapus saat status "menunggu"
      if (existingReport.status !== 'menunggu') {
        return res.status(403).json({
          success: false,
          message: 'Laporan hanya bisa dihapus saat status "menunggu".',
        });
      }
    }

    await prisma.report.delete({
      where: { id: parseInt(id) },
    });

    return res.status(200).json({
      success: true,
      message: 'Laporan berhasil dihapus.',
    });
  } catch (error) {
    console.error('deleteReport error:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan pada server.',
    });
  }
};

module.exports = {
  getAllReports,
  getReportById,
  createReport,
  updateReport,
  deleteReport,
};
