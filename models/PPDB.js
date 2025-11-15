const mongoose = require('mongoose');

const ppdbSchema = new mongoose.Schema({
  nama: { type: String, required: true, trim: true },
  nisn: { 
    type: String, 
    required: true, 
    unique: true,
    validate: {
      validator: v => /^\d{10}$/.test(v),
      message: 'NISN harus 10 digit angka'
    }
  },
  asal: { type: String, required: true },
  alamat: { type: String, required: true },
  telp: { 
    type: String, 
    required: true,
    validate: {
      validator: v => /^\d{10,13}$/.test(v),
      message: 'No HP harus 10-13 digit'
    }
  },
  status: { 
    type: String, 
    enum: ['pending', 'contacted', 'registered'], 
    default: 'pending' 
  },
  catatan: { type: String }
}, { timestamps: true });

ppdbSchema.index({ nisn: 1 });
ppdbSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Ppdb', ppdbSchema);
