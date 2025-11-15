const mongoose = require('mongoose');

const ekskulSchema = new mongoose.Schema({
  nama: { type: String, required: true, trim: true },
  deskripsi: { type: String },
  foto: { type: String },
  pembina: { type: String },
  jadwal: { type: String }
}, { timestamps: true });

ekskulSchema.index({ nama: 1 });

module.exports = mongoose.model('Ekskul', ekskulSchema);
