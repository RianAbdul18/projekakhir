const mongoose = require('mongoose');

const kalenderSchema = new mongoose.Schema({
  judul: { type: String, required: true },
  tanggal: { type: Date, required: true },
  keterangan: { type: String },
  jenis: { 
    type: String, 
    enum: ['ujian', 'libur', 'kegiatan', 'rapat'], 
    default: 'kegiatan' 
  }
}, { timestamps: true });

kalenderSchema.index({ tanggal: 1 });

module.exports = mongoose.model('Kalender', kalenderSchema);
