/**
 * Middleware untuk membatasi akses berdasarkan role user.
 * Menerima daftar role yang diizinkan sebagai parameter.
 * Harus digunakan setelah authMiddleware (req.user sudah tersedia).
 */
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Akses ditolak. User belum terautentikasi.' });
    }

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
