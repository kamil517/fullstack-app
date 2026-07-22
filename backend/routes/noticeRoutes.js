// backend/routes/noticeRoutes.js
const express = require('express');
const router = express.Router();
const Notice = require('../models/Notice');

// Get all notices
router.get('/', async (req, res) => {
    try {
        const notices = await Notice.find().sort({ createdAt: -1 });
        res.json(notices);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get single notice
router.get('/:id', async (req, res) => {
    try {
        const notice = await Notice.findById(req.params.id);
        res.json(notice);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create notice
router.post('/', async (req, res) => {
    try {
        const { title, content, category, author } = req.body;
        const notice = new Notice({ title, content, category, author });
        await notice.save();
        res.status(201).json(notice);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update notice
router.put('/:id', async (req, res) => {
    try {
        const { title, content, category } = req.body;
        const notice = await Notice.findByIdAndUpdate(
            req.params.id,
            { title, content, category },
            { new: true }
        );
        res.json(notice);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete notice
router.delete('/:id', async (req, res) => {
    try {
        await Notice.findByIdAndDelete(req.params.id);
        res.json({ message: 'Notice deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;