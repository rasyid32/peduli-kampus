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

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Akses ditolak. Anda tidak memiliki izin untuk mengakses resource ini.' });
    }

    next();
  };
};

module.exports = authorize;
