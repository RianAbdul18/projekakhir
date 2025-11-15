const mongoose = require('mongoose');

const beritaSchema = new mongoose.Schema({
  judul: { type: String, required: true, trim: true, maxlength: 200 },
  isi: { type: String, required: true },
  gambar: { type: String },
  penulis: { type: String, default: 'Admin' },
  tanggal: { type: Date, default: Date.now },
  views: { type: Number, default: 0 }
}, { timestamps: true });

beritaSchema.index({ tanggal: -1 });
beritaSchema.index({ judul: 'text' });

module.exports = mongoose.model('Berita', beritaSchema);
