const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Profil = require('../models/Profil');
const Berita = require('../models/Berita');
const Galeri = require('../models/Galeri');
const Ekskul = require('../models/Ekskul');
const Ppdb = require('../models/Ppdb');
const Slider = require('../models/Slider');
const Kalender = require('../models/Kalender');

// === BERANDA ===
router.get('/', async (req, res) => {
  try {
    const [sambutan, beritaTerbaru, galeriTerbaru, ekskul, sliders, kalender] = await Promise.all([
      Profil.findOne({ tipe: 'sekolah' }).sort({ urutan: 1 }),
      Berita.find().sort({ tanggal: -1 }).limit(6),
      Galeri.find().sort({ tanggal: -1 }).limit(6),
      Ekskul.find().limit(8),
      Slider.find({ aktif: true }).sort({ urutan: 1 }),
      Kalender.find({ tanggal: { $gte: new Date() } }).sort({ tanggal: 1 }).limit(5)
    ]);

    res.render('beranda', {
      title: 'Beranda',
      description: 'MTs Darul Falah - Sekolah Berprestasi Berakhlak Mulia',
      sambutan: sambutan || { nama: 'MTs Darul Falah', deskripsi: 'Selamat Datang' },
      beritaTerbaru,
      galeriTerbaru,
      ekskul,
      sliders,
      kalender,
      csrfToken: req.csrfToken()
    });
  } catch (err) {
    console.error('Beranda Error:', err);
    res.status(500).render('500');
  }
});

// === PPDB SAVE ===
router.post('/ppdb/save', [
  body('nama').trim().notEmpty().withMessage('Nama wajib diisi'),
  body('nisn').isLength({ min: 10, max: 10 }).withMessage('NISN harus 10 digit'),
  body('asal').trim().notEmpty().withMessage('Asal sekolah wajib diisi'),
  body('alamat').trim().notEmpty().withMessage('Alamat wajib diisi'),
  body('telp').isMobilePhone('id-ID').withMessage('No HP tidak valid')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, error: errors.array()[0].msg });
  }

  try {
    await Ppdb.create(req.body);
    res.json({ success: true });
  } catch (err) {
    const errorMsg = err.code === 11000 ? 'NISN sudah terdaftar' : 'Gagal menyimpan';
    res.status(400).json({ success: false, error: errorMsg });
  }
});

// === HALAMAN LAIN ===
const renderPage = (view, title, model, query = {}, description = '') => {
  router.get(`/${view}`, async (req, res) => {
    try {
      const data = await model.findOne(query);
      res.render(view, { title, description, data: data || {} });
    } catch (err) {
      res.status(500).render('500');
    }
  });
};

renderPage('profil-sekolah', 'Profil Sekolah', Profil, { tipe: 'sekolah' }, 'Profil lengkap MTs Darul Falah');
renderPage('profil-visi-misi', 'Visi Misi', Profil, { tipe: 'visi-misi' });
renderPage('profil-sejarah', 'Sejarah', Profil, { tipe: 'sejarah' });

router.get('/profil-staff', async (req, res) => {
  const staff = await Profil.find({ tipe: 'staff' }).sort({ urutan: 1 });
  res.render('profil-staff', { title: 'Staff & Guru', staff });
});

router.get('/profil-fasilitas', async (req, res) => {
  const fasilitas = await Profil.find({ tipe: 'fasilitas' }).sort({ urutan: 1 });
  res.render('profil-fasilitas', { title: 'Fasilitas', fasilitas });
});

router.get('/berita', async (req, res) => {
  const berita = await Berita.find().sort({ tanggal: -1 });
  res.render('berita', { title: 'Berita & Pengumuman', berita });
});

router.get('/galeri', async (req, res) => {
  const galeri = await Galeri.find().sort({ tanggal: -1 });
  res.render('galeri', { title: 'Galeri Kegiatan', galeri });
});

router.get('/ekskul-list', async (req, res) => {
  const ekskul = await Ekskul.find();
  res.render('ekskul-list', { title: 'Ekstrakurikuler', ekskul });
});

router.get('/kalender', async (req, res) => {
  const kalender = await Kalender.find().sort({ tanggal: 1 });
  res.render('kalender', { title: 'Kalender Akademik', kalender });
});

router.get('/kontak', (req, res) => {
  res.render('kontak', { title: 'Kontak Kami' });
});

router.get('/ppdb', (req, res) => {
  res.render('ppdb', { title: 'PPDB Online', csrfToken: req.csrfToken() });
});

module.exports = router;
