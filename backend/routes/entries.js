const express = require('express');
const router = express.Router();
const Entry = require('../models/Entry');
const { protect } = require('../middleware/authMiddleware');

// Get all entries for a user
router.get('/', protect, async (req, res) => {
    try {
        const entries = await Entry.find({ userId: req.user._id }).sort({ date: -1 });
        res.json(entries);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Add a new entry
router.post('/', protect, async (req, res) => {
    try {
        const entry = new Entry({
            ...req.body,
            userId: req.user._id,
        });
        const savedEntry = await entry.save();
        res.status(201).json(savedEntry);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update an entry
router.put('/:id', protect, async (req, res) => {
    try {
        const entry = await Entry.findById(req.params.id);
        if (!entry) return res.status(404).json({ message: 'Entry not found' });
        if (entry.userId.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        const updatedEntry = await Entry.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedEntry);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Delete an entry
router.delete('/:id', protect, async (req, res) => {
    try {
        const entry = await Entry.findById(req.params.id);
        if (!entry) return res.status(404).json({ message: 'Entry not found' });
        if (entry.userId.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        await entry.deleteOne();
        res.json({ message: 'Entry removed' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
