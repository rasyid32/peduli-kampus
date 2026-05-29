/**
 * File ini dikerjakan oleh Anggota 4 untuk riwayat update laporan
 * dan update status laporan oleh teknisi/admin.
 * 
 * Fitur:
 * - GET /api/reports/:id/updates - Melihat riwayat update laporan
 * - POST /api/reports/:id/updates - Menambah update status laporan
 * 
 * Aturan:
 * - Mahasiswa hanya bisa melihat update laporan miliknya
 * - Teknisi/admin bisa melihat semua update laporan
 * - Hanya teknisi/admin yang bisa membuat update status laporan
 * - Ketika membuat update, status laporan juga ikut berubah
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * GET /api/reports/:id/updates
 * Mengambil riwayat update status laporan
 * 
 * Akses:
 * - Mahasiswa: Hanya bisa melihat update laporan miliknya
 * - Teknisi/Admin: Bisa melihat semua update laporan
 * 
 * Parameter:
 * - id (reportId)
 * 
 * Query string (opsional):
 * - page: Halaman (default: 1)
 * - limit: Jumlah per halaman (default: 10)
 */
const getReportUpdates = async (req, res) => {
  try {
    const { id: reportId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Validasi reportId
    const reportIdInt = parseInt(reportId);
    if (isNaN(reportIdInt)) {
      return res.status(400).json({
        success: false,
        message: 'ID laporan tidak valid',
      });
    }

    // Cek apakah laporan ada
    const report = await prisma.report.findUnique({
      where: { id: reportIdInt },
      select: {
        id: true,
        userId: true,
        title: true,
        status: true,
      },
    });

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Laporan tidak ditemukan',
      });
    }

    // Role checking
    // Jika mahasiswa, pastikan laporan miliknya sendiri
    if (req.user.role === 'mahasiswa' && report.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Anda hanya bisa melihat update laporan milik Anda sendiri',
      });
    }

    // Ambil total jumlah updates
    const totalUpdates = await prisma.reportUpdate.count({
      where: { reportId: reportIdInt },
    });

    // Ambil updates dengan pagination
    const updates = await prisma.reportUpdate.findMany({
      where: { reportId: reportIdInt },
      select: {
        id: true,
        reportId: true,
        userId: true,
        status: true,
        note: true,
        createdAt: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take: limit,
    });

    const totalPages = Math.ceil(totalUpdates / limit);

    res.status(200).json({
      success: true,
      message: 'Riwayat update laporan berhasil diambil',
      data: {
        report: {
          id: report.id,
          title: report.title,
          currentStatus: report.status,
        },
        updates,
        pagination: {
          page,
          limit,
          total: totalUpdates,
          totalPages,
        },
      },
    });
  } catch (error) {
    console.error('Error in getReportUpdates:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil riwayat update laporan',
      error: error.message,
    });
  }
};

/**
 * POST /api/reports/:id/updates
 * Membuat update status laporan baru
 * 
 * Akses: Teknisi/Admin only
 * 
 * Parameter:
 * - id (reportId)
 * 
 * Request body:
 * {
 *   "status": "diproses",
 *   "note": "Masalah sudah diidentifikasi, sedang dalam proses perbaikan"
 * }
 * 
 * Catatan:
 * - Status harus sesuai enum ReportStatus (menunggu, diproses, selesai, ditolak)
 * - note opsional
 * - Ketika update dibuat, kolom status di tabel reports juga akan berubah
 */
const createReportUpdate = async (req, res) => {
  try {
    const { id: reportId } = req.params;
    const { status, note } = req.body;

    // Validasi reportId
    const reportIdInt = parseInt(reportId);
    if (isNaN(reportIdInt)) {
      return res.status(400).json({
        success: false,
        message: 'ID laporan tidak valid',
      });
    }

    // Validasi status
    const validStatuses = ['menunggu', 'diproses', 'selesai', 'ditolak'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status tidak valid. Status harus: menunggu, diproses, selesai, atau ditolak',
      });
    }

    // Cek apakah laporan ada
    const report = await prisma.report.findUnique({
      where: { id: reportIdInt },
      select: {
        id: true,
        status: true,
        userId: true,
      },
    });

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Laporan tidak ditemukan',
      });
    }

    // Buat update dalam satu transaksi
    // 1. Buat ReportUpdate
    // 2. Update status di Report
    const result = await prisma.$transaction(async (tx) => {
      // Buat report update
      const newUpdate = await tx.reportUpdate.create({
        data: {
          reportId: reportIdInt,
          userId: req.user.id,
          status: status,
          note: note ? note.trim() : null,
        },
        select: {
          id: true,
          reportId: true,
          userId: true,
          status: true,
          note: true,
          createdAt: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
        },
      });

      // Update status di tabel reports
      const updatedReport = await tx.report.update({
        where: { id: reportIdInt },
        data: { status: status },
        select: {
          id: true,
          status: true,
          updatedAt: true,
        },
      });

      return {
        update: newUpdate,
        report: updatedReport,
      };
    });

    res.status(201).json({
      success: true,
      message: 'Update status laporan berhasil dibuat',
      data: {
        update: result.update,
        updatedReport: result.report,
      },
    });
  } catch (error) {
    console.error('Error in createReportUpdate:', error);

    // Handle Prisma validation error
    if (error.code === 'P2025') {
      return res.status(404).json({
        success: false,
        message: 'Laporan tidak ditemukan',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Gagal membuat update status laporan',
      error: error.message,
    });
  }
};

module.exports = {
  getReportUpdates,
  createReportUpdate,
};
