/**
 * File ini dikerjakan oleh Anggota 2 untuk validasi akses berdasarkan role user.
 * Digunakan oleh Anggota 4 untuk mengecek role user (teknisi_admin atau mahasiswa).
 */

/**
 * Factory function untuk membuat middleware role checking
 * Contoh penggunaan: requireRole('teknisi_admin')
 */
const requireRole = (allowedRoles) => {
  return (req, res, next) => {
    try {
      // Pastikan user sudah terautentikasi (dari authMiddleware)
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'User tidak terautentikasi',
        });
      }

      // Konversi allowedRoles ke array jika string
      const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

      // Cek apakah role user termasuk dalam allowedRoles
      if (!roles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: 'Anda tidak memiliki akses untuk melakukan action ini',
        });
      }

      next();
    } catch (error) {
      console.error('Error in roleMiddleware:', error);
      res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan saat memeriksa role',
        error: error.message,
      });
    }
  };
};

/**
 * Middleware khusus untuk memverifikasi role teknisi_admin
 */
const requireAdmin = requireRole('teknisi_admin');

/**
 * Middleware khusus untuk memverifikasi role mahasiswa
 */
const requireStudent = requireRole('mahasiswa');

module.exports = {
  requireRole,
  requireAdmin,
  requireStudent,
};
