const mongoose = require('mongoose');

const kurikulumSchema = new mongoose.Schema({
  kelas: { type: String, required: true },
  mataPelajaran: { type: String, required: true },
  fileRPP: { type: String }, // PDF
  semester: { 
    type: String, 
    enum: ['Ganjil', 'Genap'], 
    required: true 
  },
  tahunAjaran: { type: String, required: true }
}, { timestamps: true });

kurikulumSchema.index({ kelas: 1, mataPelajaran: 1, semester: 1 });

module.exports = mongoose.model('Kurikulum', kurikulumSchema);
