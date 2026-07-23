const express = require('express');
const cors = require('cors');

const app = express();

// ── CORS ──
app.use(cors({
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// ── ROOT ROUTE ──
app.get('/', (req, res) => {
    res.json({ message: '✅ API is running on Vercel!' });
});

// ── TEST ROUTE ──
app.get('/test', (req, res) => {
    res.json({ message: '✅ Server working on Vercel!' });
});

// ── AUTH ROUTES ──
app.post('/api/auth/register', (req, res) => {
    res.json({ success: true, message: 'Register works!' });
});

app.post('/api/auth/login', (req, res) => {
    res.json({ success: true, message: 'Login works!' });
});

// ── NOTICE ROUTES ──
app.get('/api/notices', (req, res) => {
    res.json([
        { id: 1, title: 'Welcome to Digital Notice Board', category: 'Announcement' },
        { id: 2, title: 'Exam Schedule Released', category: 'Exam' }
    ]);
});

// ── 404 HANDLER ──
app.use((req, res) => {
    console.log('❌ 404:', req.method, req.url);
    res.status(404).json({ error: 'Route not found', path: req.url });
});

// ── EXPORT FOR VERCEL ──
module.exports = app;