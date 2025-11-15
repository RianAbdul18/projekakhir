const Log = require('../models/Log');

module.exports = async (req, res, next) => {
  if (req.session.adminId && ['POST', 'PUT', 'DELETE'].includes(req.method)) {
    try {
      await Log.create({
        admin: req.session.adminId,
        aksi: `${req.method} ${req.path}`,
        detail: JSON.stringify({ body: req.body, file: req.file?.filename }),
        ip: req.ip || req.connection.remoteAddress
      });
    } catch (err) {
      console.error('Log error:', err);
    }
  }
  next();
};
