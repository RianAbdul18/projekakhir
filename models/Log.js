const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  admin: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  aksi: { type: String, required: true },
  detail: { type: String },
  ip: { type: String }
}, { timestamps: true });

logSchema.index({ createdAt: -1 });
logSchema.index({ admin: 1 });

module.exports = mongoose.model('Log', logSchema);
