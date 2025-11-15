const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const exceljs = require('exceljs');
const User = require('../models/User');
const Profil = require('../models/Profil');
const Berita = require('../models/Berita');
const Ekskul = require('../models/Ekskul');
const Ppdb = require('../models/Ppdb');
const Slider = require('../models/Slider');
const Kalender = require('../models/Kalender');
const Kurikulum = require('../models/Kurikulum');
const Log = require('../models/Log');

const isAdmin = (req, res, next) => {
  if (!req.session.adminId) return res.redirect('/admin/login');
  next();
};

// === LOGIN ===
router.get('/login', (req, res) => {
  res.render('admin/login', { error: null, csrfToken: req.csrfToken() });
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user || !(await user.comparePassword(password))) {
    return res.render('admin/login', { error: 'Username atau password salah', csrfToken: req.csrfToken() });
  }
  req.session.adminId = user._id;
  await User.findByIdAndUpdate(user._id, { lastLogin: new Date() });
  res.redirect('/admin/dashboard');
});

router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/admin/login');
});

// === DASHBOARD ===
router.get('/dashboard', isAdmin, async (req, res) => {
  const [profils, beritaCount, galeriCount, ppdbCount, kalenderCount, logs] = await Promise.all([
    Profil.find().sort({ tipe: 1, urutan: 1 }),
    Berita.countDocuments(),
    require('../models/Galeri').countDocuments(),
    Ppdb.countDocuments(),
    Kalender.countDocuments(),
    Log.find().sort({ createdAt: -1 }).limit(10).populate('admin', 'username')
  ]);
  res.render('admin/dashboard', { profils, beritaCount, galeriCount, ppdbCount, kalenderCount, logs, csrfToken: req.csrfToken() });
});

// === PROFIL CRUD ===
router.get('/profil/create', isAdmin, (req, res) => {
  res.render('admin/edit-profil', { action: 'create', profil: {}, csrfToken: req.csrfToken() });
});

router.post('/profil/create', isAdmin, app.locals.upload.single('foto'), [
  body('nama').notEmpty(), body('deskripsi').notEmpty(),
  body('tipe').isIn(['sekolah', 'sejarah', 'visi-misi', 'staff', 'fasilitas'])
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render('admin/edit-profil', { action: 'create', profil: req.body, error: errors.array()[0].msg, csrfToken: req.csrfToken() });
  }
  const data = req.body;
  if (req.file) data.foto = '/uploads/' + req.file.filename;
  await Profil.create(data);
  res.redirect('/admin/dashboard');
});

router.get('/profil/edit/:id', isAdmin, async (req, res) => {
  const profil = await Profil.findById(req.params.id);
  res.render('admin/edit-profil', { action: 'edit', profil, csrfToken: req.csrfToken() });
});

router.post('/profil/update/:id', isAdmin, app.locals.upload.single('foto'), async (req, res) => {
  const data = req.body;
  if (req.file) data.foto = '/uploads/' + req.file.filename;
  await Profil.findByIdAndUpdate(req.params.id, data);
  res.redirect('/admin/dashboard');
});

router.post('/profil/delete/:id', isAdmin, async (req, res) => {
  await Profil.findByIdAndDelete(req.params.id);
  res.redirect('/admin/dashboard');
});

// === BERITA ===
router.get('/berita', isAdmin, async (req, res) => {
  const berita = await Berita.find().sort({ tanggal: -1 });
  res.render('admin/edit-berita', { berita, csrfToken: req.csrfToken() });
});

router.post('/berita/create', isAdmin, app.locals.upload.single('gambar'), [
  body('judul').notEmpty(), body('isi').notEmpty()
], async (req, res) => {
  const data = req.body;
  if (req.file) data.gambar = '/uploads/' + req.file.filename;
  await Berita.create(data);
  res.redirect('/admin/berita');
});

router.post('/berita/delete/:id', isAdmin, async (req, res) => {
  await Berita.findByIdAndDelete(req.params.id);
  res.redirect('/admin/berita');
});

// === EKSKUL ===
router.get('/ekskul', isAdmin, async (req, res) => {
  const ekskul = await Ekskul.find();
  res.render('admin/ekskul', { ekskul, csrfToken: req.csrfToken() });
});

router.post('/ekskul/create', isAdmin, app.locals.upload.single('foto'), async (req, res) => {
  const data = req.body;
  if (req.file) data.foto = '/uploads/' + req.file.filename;
  await Ekskul.create(data);
  res.redirect('/admin/ekskul');
});

router.post('/ekskul/delete/:id', isAdmin, async (req, res) => {
  await Ekskul.findByIdAndDelete(req.params.id);
  res.redirect('/admin/ekskul');
});

// === SLIDER ===
router.get('/slider', isAdmin, async (req, res) => {
  const sliders = await Slider.find().sort({ urutan: 1 });
  res.render('admin/slider', { sliders, csrfToken: req.csrfToken() });
});

router.post('/slider/create', isAdmin, app.locals.upload.single('gambar'), async (req, res) => {
  if (!req.file) return res.redirect('/admin/slider');
  await Slider.create({
    judul: req.body.judul, subjudul: req.body.subjudul,
    gambar: '/uploads/' + req.file.filename, link: req.body.link,
    urutan: req.body.urutan || 0
  });
  res.redirect('/admin/slider');
});

router.post('/slider/delete/:id', isAdmin, async (req, res) => {
  await Slider.findByIdAndDelete(req.params.id);
  res.redirect('/admin/slider');
});

// === KALENDER ===
router.get('/kalender', isAdmin, async (req, res) => {
  const kalender = await Kalender.find().sort({ tanggal: 1 });
  res.render('admin/kalender', { kalender, csrfToken: req.csrfToken() });
});

router.post('/kalender/create', isAdmin, async (req, res) => {
  await Kalender.create(req.body);
  res.redirect('/admin/kalender');
});

router.post('/kalender/delete/:id', isAdmin, async (req, res) => {
  await Kalender.findByIdAndDelete(req.params.id);
  res.redirect('/admin/kalender');
});

// === KURIKULUM ===
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

// === PPDB ===
router.get('/ppdb', isAdmin, async (req, res) => {
  const ppdb = await Ppdb.find().sort({ createdAt: -1 });
  res.render('admin/ppdb', { ppdb, csrfToken: req.csrfToken() });
});

router.post('/ppdb/status/:id', isAdmin, async (req, res) => {
  await Ppdb.findByIdAndUpdate(req.params.id, { status: req.body.status, catatan: req.body.catatan });
  res.redirect('/admin/ppdb');
});

router.get('/ppdb/export', isAdmin, async (req, res) => {
  const ppdb = await Ppdb.find();
  const workbook = new exceljs.Workbook();
  const sheet = workbook.addWorksheet('PPDB');
  sheet.addRow(['Nama', 'NISN', 'Asal', 'Alamat', 'Telp', 'Status', 'Catatan', 'Tanggal']);
  ppdb.forEach(p => sheet.addRow([p.nama, p.nisn, p.asal, p.alamat, p.telp, p.status, p.catatan || '', new Date(p.createdAt).toLocaleDateString('id-ID')]));
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', 'attachment; filename=ppdb-mts-darulfalah.xlsx');
  await workbook.xlsx.write(res);
  res.end();
});

// === GANTI PASSWORD ===
router.get('/profile', isAdmin, async (req, res) => {
  res.render('admin/profile', { error: null, success: null, csrfToken: req.csrfToken() });
});

router.post('/profile', isAdmin, [
  body('password').isLength({ min: 6 })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render('admin/profile', { error: errors.array()[0].msg, csrfToken: req.csrfToken() });
  }
  await User.findByIdAndUpdate(req.session.adminId, { password: req.body.password });
  res.render('admin/profile', { success: 'Password berhasil diubah', csrfToken: req.csrfToken() });
});

module.exports = router;
