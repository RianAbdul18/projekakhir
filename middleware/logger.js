// middleware/logger.js
const Log = require('../models/Log');

module.exports = async (req, res, next) => {
  // PENYELAMAT UTAMA: cek req.session ada atau tidak (penting saat akses static file!)
  if (req.session && req.session.adminId && ['POST', 'PUT', 'DELETE'].includes(req.method)) {
    try {
      await Log.create({
        admin: req.session.adminId,
        aksi: `${req.method} ${req.path}`,
        detail: JSON.stringify({
          body: req.body,
          file: req.file ? req.file.filename : null   // lebih aman
        }),
        ip: req.ip || req.connection?.remoteAddress || req.socket?.remoteAddress || 'unknown'
      });
    } catch (err) {
      // Jangan sampai server crash hanya karena log gagal
      console.error('Gagal menyimpan log:', err.message);
    }
  }
  next();
};