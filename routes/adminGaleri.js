// routes/adminGaleri.js
const express = require('express');
const router = express.Router();
const Galeri = require('../models/Galeri');
const multer = require('multer');
const path = require('path');

// === MIDDLEWARE ADMIN ===
const isAdmin = (req, res, next) => {
  if (!req.session.adminId) return res.redirect('/admin/login');
  next();
};

// === KONFIGURASI MULTER LOKAL (ini yang penting!) ===
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // max 10MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const ext = path.extname(file.originalname).toLowerCase();
    const mimetype = allowedTypes.test(file.mimetype);
    if (mimetype && allowedTypes.test(ext)) {
      return cb(null, true);
    } else {
      cb(new Error('Hanya file gambar yang diizinkan!'));
    }
  }
});

// === ROUTES GALERI ===
router.get('/galeri', isAdmin, async (req, res) => {
  const galeri = await Galeri.find().sort({ createdAt: -1 });
  res.render('admin/galeri', { galeri, csrfToken: req.csrfToken() });
});

router.post('/galeri/create', isAdmin, upload.single('gambar'), async (req, res) => {
  if (!req.file) {
    return res.redirect('/admin/galeri?error=NoFile');
  }
  await Galeri.create({
    judul: req.body.judul || 'Tanpa Judul',
    deskripsi: req.body.deskripsi || '',
    gambar: '/uploads/' + req.file.filename
  });
  res.redirect('/admin/galeri');
});

router.post('/galeri/delete/:id', isAdmin, async (req, res) => {
  await Galeri.findByIdAndDelete(req.params.id);
  res.redirect('/admin/galeri');
});

module.exports = router;