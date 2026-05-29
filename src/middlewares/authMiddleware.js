/**
 * File ini dikerjakan oleh Anggota 2 untuk validasi JWT authentication.
 */

const jwt = require('jsonwebtoken');

/**
 * Middleware untuk memverifikasi token JWT.
 * Menyimpan data user yang ter-decode ke req.user.
 */
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Akses ditolak. Token tidak ditemukan.',
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Token tidak valid atau sudah kadaluarsa.',
    });
  }
};

module.exports = { authenticate };
