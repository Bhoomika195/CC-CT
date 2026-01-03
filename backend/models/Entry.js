const mongoose = require('mongoose');

const entrySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, required: true }, // e.g., 'trip', 'energy', 'diet', 'waste'
    mode: String,
    km: Number,
    vehicle: String,
    flightClass: String,
    longHaul: Boolean,
    co2: { type: Number, required: true },
    tag: String,
    note: String,
    date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Entry', entrySchema);
