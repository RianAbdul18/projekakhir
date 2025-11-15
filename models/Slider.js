const mongoose = require('mongoose');

const sliderSchema = new mongoose.Schema({
  judul: { type: String, required: true },
  subjudul: { type: String },
  gambar: { type: String, required: true },
  link: { type: String },
  aktif: { type: Boolean, default: true },
  urutan: { type: Number, default: 0 }
}, { timestamps: true });

sliderSchema.index({ urutan: 1 });
sliderSchema.index({ aktif: 1 });

module.exports = mongoose.model('Slider', sliderSchema);
