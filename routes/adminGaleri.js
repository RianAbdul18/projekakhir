const express = require('express');
const router = express.Router();
const Galeri = require('../models/Galeri');

const isAdmin = (req, res, next) => {
  if (!req.session.adminId) return res.redirect('/admin/login');
  next();
};

router.get('/galeri', isAdmin, async (req, res) => {
  const galeri = await Galeri.find().sort({ tanggal: -1 });
  res.render('admin/galeri', { galeri, csrfToken: req.csrfToken() });
});

router.post('/galeri/create', isAdmin, app.locals.upload.single('gambar'), async (req, res) => {
  if (!req.file) return res.redirect('/admin/galeri');
  await Galeri.create({
    judul: req.body.judul || 'Kegiatan Sekolah',
    gambar: '/uploads/' + req.file.filename,
    deskripsi: req.body.deskripsi
  });
  res.redirect('/admin/galeri');
});

router.post('/galeri/delete/:id', isAdmin, async (req, res) => {
  await Galeri.findByIdAndDelete(req.params.id);
  res.redirect('/admin/galeri');
});

module.exports = router;
