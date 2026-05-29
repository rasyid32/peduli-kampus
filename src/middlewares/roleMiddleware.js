/**
 * File ini dikerjakan oleh Anggota 2 untuk validasi akses berdasarkan role user.
 */

/**
 * Middleware factory untuk membatasi akses berdasarkan role.
 * @param  {...string} allowedRoles - Role yang diizinkan (misalnya 'mahasiswa', 'teknisi_admin')
 * @returns {Function} Express middleware
 */
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Akses ditolak. Silakan login terlebih dahulu.',
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Akses ditolak. Anda tidak memiliki izin untuk mengakses resource ini.',
      });
    }

    next();
  };
};

module.exports = { authorizeRoles };
