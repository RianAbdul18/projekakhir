const mongoose = require('mongoose');

const profilSchema = new mongoose.Schema({
  nama: { type: String, required: true, trim: true },
  deskripsi: { type: String, required: true },
  isi: { type: String },
  foto: { type: String },
  urutan: { type: Number, default: 0, min: 0 },
  tipe: {
    type: String,
    enum: ['sekolah', 'sejarah', 'visi-misi', 'staff', 'fasilitas'],
    required: true
  }
}, { timestamps: true });

profilSchema.index({ tipe: 1, urutan: 1 });
profilSchema.index({ nama: 'text', deskripsi: 'text' });

module.exports = mongoose.model('Profil', profilSchema);
