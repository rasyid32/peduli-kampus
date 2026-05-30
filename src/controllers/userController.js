const prisma = require('../config/prisma');

/**
 * Mengambil profile user yang sedang login.
 * GET /api/users/me
 */
const getMe = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'User tidak ditemukan.' });
    }

    return res.status(200).json({
      message: 'Berhasil mengambil data profile.',
      data: user,
    });
  } catch (error) {
    console.error('GetMe error:', error);
    return res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
  }
};

/**
 * Mengambil daftar semua user.
 * Hanya bisa diakses oleh teknisi_admin.
 * GET /api/users
 */
const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return res.status(200).json({
      message: 'Berhasil mengambil daftar user.',
      data: users,
    });
  } catch (error) {
    console.error('GetAllUsers error:', error);
    return res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
  }
};

module.exports = { getMe, getAllUsers };
