const express = require('express');
const router = express.Router();
const Kurikulum = require('../models/Kurikulum');

const isAdmin = (req, res, next) => {
  if (!req.session.adminId) return res.redirect('/admin/login');
  next();
};

router.get('/kurikulum', isAdmin, async (req, res) => {
  const kurikulum = await Kurikulum.find();
  res.render('admin/kurikulum', { kurikulum, csrfToken: req.csrfToken() });
});

router.post('/kurikulum/create', isAdmin, app.locals.upload.single('fileRPP'), async (req, res) => {
  const data = req.body;
  if (req.file) data.fileRPP = '/uploads/' + req.file.filename;
  await Kurikulum.create(data);
  res.redirect('/admin/kurikulum');
});

router.post('/kurikulum/delete/:id', isAdmin, async (req, res) => {
  await Kurikulum.findByIdAndDelete(req.params.id);
  res.redirect('/admin/kurikulum');
});

module.exports = router;
