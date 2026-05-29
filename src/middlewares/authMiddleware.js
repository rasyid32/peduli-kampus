/**
 * File ini dikerjakan oleh Anggota 2 untuk validasi JWT authentication.
 * Digunakan oleh Anggota 4 untuk mengecek token JWT.
 */

const jwt = require('jsonwebtoken');
require('dotenv').config({ quiet: true });

/**
 * Middleware untuk memverifikasi JWT token
 * Mengekstrak data user dari token dan menyimpannya di req.user
 */
const authMiddleware = (req, res, next) => {
  try {
    // Ambil token dari header Authorization
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: 'Token tidak ditemukan',
      });
    }

    // Format: Bearer <token>
    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Format token tidak valid',
      });
    }

    // Verifikasi token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Simpan user data ke req.user
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Error in authMiddleware:', error);

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token sudah kadaluarsa',
      });
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Token tidak valid',
      });
    }

    res.status(401).json({
      success: false,
      message: 'Autentikasi gagal',
      error: error.message,
    });
  }
};

module.exports = authMiddleware;
