const mongoose = require('mongoose');

const galeriSchema = new mongoose.Schema({
  judul: { type: String, required: true },
  gambar: { type: String, required: true },
  deskripsi: { type: String },
  tanggal: { type: Date, default: Date.now }
}, { timestamps: true });

galeriSchema.index({ tanggal: -1 });

module.exports = mongoose.model('Galeri', galeriSchema);
