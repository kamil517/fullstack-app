require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();

// ── CORS ──
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://127.0.0.1:5173'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

console.log('🚀 SERVER STARTING...');

// ── TEST ROUTE ──
app.get('/test', (req, res) => {
    console.log('✅ Test route hit!');
    res.json({ message: 'Server working on port 8080!' });
});

// ── AUTH ROUTES ──
app.post('/api/auth/register', async (req, res) => {
    console.log('✅ Register route hit!');
    console.log('📝 Request body:', req.body);
    res.json({ 
        success: true, 
        message: 'Register route works!',
        received: req.body 
    });
});

app.post('/api/auth/login', async (req, res) => {
    console.log('✅ Login route hit!');
    console.log('📝 Request body:', req.body);
    res.json({ 
        success: true, 
        message: 'Login route works!',
        received: req.body 
    });
});

app.get('/api/auth/me', (req, res) => {
    console.log('✅ Me route hit!');
    res.json({ 
        success: true, 
        user: { id: '1', name: 'Test User', email: 'test@test.com', role: 'student' }
    });
});

// ── NOTICE ROUTES ──
app.get('/api/notices', (req, res) => {
    console.log('✅ Notices route hit!');
    res.json([
        { id: '1', title: 'Welcome to Digital Notice Board', category: 'Announcement' }
    ]);
});

app.post('/api/notices', (req, res) => {
    console.log('✅ Create notice route hit!');
    res.json({ success: true, notice: req.body });
});

// ── USER ROUTES ──
app.get('/api/users', (req, res) => {
    console.log('✅ Users route hit!');
    res.json([]);
});

// ── CONTACT ROUTE ──
app.post('/api/contact', (req, res) => {
    console.log('✅ Contact route hit!');
    res.json({ success: true, message: 'Message received!' });
});

// ── 404 HANDLER ──
app.use((req, res) => {
    console.log('❌ 404:', req.method, req.url);
    res.status(404).json({ 
        error: 'Route not found', 
        path: req.url 
    });
});

// ── START SERVER ──
const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n✅ Server running on http://localhost:${PORT}`);
    console.log('🔗 Available routes:');
    console.log('  - GET  /test');
    console.log('  - POST /api/auth/register');
    console.log('  - POST /api/auth/login');
    console.log('  - GET  /api/auth/me');
    console.log('  - GET  /api/notices');
    console.log('  - POST /api/notices');
    console.log('  - GET  /api/users');
    console.log('  - POST /api/contact');
});