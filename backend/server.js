require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sendEmail = require('./config/email'); // ── ADD THIS ──

const app = express();

// ── CORS ──
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://127.0.0.1:5173'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// ── SERVE UPLOADS ──
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ── MULTER ──
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, 'uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, uniqueSuffix + ext);
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Only JPEG, PNG, GIF, and PDF files are allowed'), false);
    }
};

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: fileFilter
});

// ── MONGODB CONNECTION ──
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/digital_notice';

console.log('📡 Connecting to MongoDB...');
console.log(`📡 URI: ${MONGODB_URI}`);

mongoose.connect(MONGODB_URI, {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
})
.then(() => {
    console.log('✅ MongoDB Connected!');
    console.log(`📊 Database: ${mongoose.connection.name}`);
})
.catch(err => {
    console.error('❌ MongoDB Error:', err.message);
    console.log('💡 Make sure MongoDB is running:');
    console.log('   C:\\mongodb\\bin\\mongod.exe --dbpath C:\\data\\db');
    process.exit(1);
});

// ── SCHEMAS ──
const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    role: String,
    createdAt: { type: Date, default: Date.now }
});

const noticeSchema = new mongoose.Schema({
    title: String,
    content: String,
    category: String,
    author: { name: String, role: String },
    isArchived: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    fileUrl: { type: String, default: null },
    fileName: { type: String, default: null },
    fileType: { type: String, default: null }
});

const User = mongoose.model('User', userSchema);
const Notice = mongoose.model('Notice', noticeSchema);

// ── AUTH ROUTES ──
app.post('/api/auth/register', async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        
        if (role === 'student' && !email.endsWith('@bdu.edu.et')) {
            return res.status(400).json({ success: false, message: 'Students must use @bdu.edu.et' });
        }
        
        const existing = await User.findOne({ email });
        if (existing) {
            return res.status(400).json({ success: false, message: 'Email exists' });
        }
        
        const user = new User({ name, email, password, role });
        await user.save();
        
        res.json({ success: true, message: 'Registered!', token: 'token', user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.post('/api/auth/login', async (req, res) => {
    console.log('🔑 Login attempt:', req.body.email);
    
    try {
        const user = await User.findOne({ email: req.body.email, password: req.body.password });
        if (!user) {
            console.log('❌ User not found:', req.body.email);
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
        
        console.log('✅ Login successful:', user.email);
        res.json({ 
            success: true, 
            message: 'Login successful!', 
            token: 'token', 
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// ── NOTICE ROUTES ──
app.post('/api/notices', upload.single('file'), async (req, res) => {
    try {
        const { title, content, category, author } = req.body;
        
        let authorData;
        try {
            authorData = typeof author === 'string' ? JSON.parse(author) : author;
        } catch (e) {
            authorData = { name: 'Admin', role: 'admin' };
        }

        const noticeData = {
            title,
            content,
            category: category || 'General',
            author: authorData,
            isArchived: false
        };

        if (req.file) {
            noticeData.fileUrl = `/uploads/${req.file.filename}`;
            noticeData.fileName = req.file.originalname;
            noticeData.fileType = req.file.mimetype;
        }

        const notice = new Notice(noticeData);
        await notice.save();
        
        res.json({ success: true, notice });
    } catch (error) {
        console.error('Error creating notice:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

app.get('/api/notices', async (req, res) => {
    try {
        const notices = await Notice.find().sort({ createdAt: -1 });
        res.json(notices);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.get('/api/notices/:id', async (req, res) => {
    try {
        const notice = await Notice.findById(req.params.id);
        if (!notice) {
            return res.status(404).json({ success: false, message: 'Notice not found' });
        }
        res.json(notice);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.put('/api/notices/:id', async (req, res) => {
    try {
        const { title, content, category } = req.body;
        const notice = await Notice.findByIdAndUpdate(
            req.params.id,
            { title, content, category },
            { new: true }
        );
        if (!notice) {
            return res.status(404).json({ success: false, message: 'Notice not found' });
        }
        res.json(notice);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.delete('/api/notices/:id', async (req, res) => {
    try {
        const notice = await Notice.findById(req.params.id);
        if (notice?.fileUrl) {
            const filePath = path.join(__dirname, notice.fileUrl);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
                console.log('🗑️ File deleted:', filePath);
            }
        }
        await Notice.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Notice deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.put('/api/notices/archive/:id', async (req, res) => {
    try {
        const notice = await Notice.findByIdAndUpdate(
            req.params.id, 
            { isArchived: true }, 
            { new: true }
        );
        if (!notice) {
            return res.status(404).json({ success: false, message: 'Notice not found' });
        }
        res.json(notice);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.put('/api/notices/restore/:id', async (req, res) => {
    try {
        const notice = await Notice.findByIdAndUpdate(
            req.params.id, 
            { isArchived: false }, 
            { new: true }
        );
        if (!notice) {
            return res.status(404).json({ success: false, message: 'Notice not found' });
        }
        res.json(notice);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ── USER ROUTES ──
app.get('/api/users', async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.put('/api/users/:id', async (req, res) => {
    try {
        const { name, email, role, password } = req.body;
        const updateData = { name, email, role };
        if (password) {
            updateData.password = password;
        }
        const user = await User.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        ).select('-password');
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.delete('/api/users/:id', async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'User deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ──
// ── NEW: CONTACT FORM WITH EMAIL NOTIFICATION ──
// ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ──

app.post('/api/contact', async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;
        
        // ── VALIDATE ──
        if (!name || !email || !subject || !message) {
            return res.status(400).json({ 
                success: false, 
                message: 'All fields are required' 
            });
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ 
                success: false, 
                message: 'Please enter a valid email address' 
            });
        }
        
        // ── SEND EMAIL TO ADMIN ──
        const adminEmail = process.env.ADMIN_EMAIL || 'admin@bitnoticeboard.edu.et';
        
        const emailHtml = `
            <h2 style="color: #1a1a2e;">📩 New Contact Message</h2>
            <p><strong>From:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Message:</strong></p>
            <p style="background: #f5f5f5; padding: 15px; border-radius: 8px;">
                ${message.replace(/\n/g, '<br>')}
            </p>
            <hr>
            <p style="color: #888; font-size: 12px;">
                Sent from Digital Notice Board Contact Form
            </p>
        `;
        
        await sendEmail(adminEmail, `📩 New Contact: ${subject}`, emailHtml);
        
        // ── SEND AUTO-REPLY TO USER ──
        const replyHtml = `
            <h2 style="color: #1a1a2e;">Thank you for contacting us! 🙏</h2>
            <p>Hi ${name},</p>
            <p>We have received your message and will get back to you within 24 hours.</p>
            <p><strong>Your message:</strong></p>
            <p style="background: #f5f5f5; padding: 15px; border-radius: 8px;">
                ${message.replace(/\n/g, '<br>')}
            </p>
            <br>
            <p>Best regards,</p>
            <p><strong>BIT Digital Notice Board Team</strong></p>
        `;
        
        await sendEmail(email, '✅ We received your message!', replyHtml);
        
        console.log('📩 Contact form processed successfully');
        
        res.json({ 
            success: true, 
            message: 'Message sent successfully! We\'ll get back to you soon.' 
        });
        
    } catch (error) {
        console.error('Contact form error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Something went wrong. Please try again.' 
        });
    }
});

// ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ──

// ── TEST ROUTE ──
app.get('/test', (req, res) => {
    res.json({ message: 'Server working on port 8080!' });
});

// ── 404 HANDLER ──
app.use((req, res) => {
    console.log('❌ 404:', req.method, req.url);
    res.status(404).json({ 
        error: 'Route not found', 
        path: req.url 
    });
});

// ── ERROR HANDLER ──
app.use((err, req, res, next) => {
    console.error('🔥 Error:', err.message);
    res.status(500).json({ error: err.message });
});

// ── START SERVER ──
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`\n✅ Server running on http://localhost:${PORT}`);
    console.log(`📁 Uploads folder: ${path.join(__dirname, 'uploads')}`);
    console.log(`\n🔗 Test: http://localhost:${PORT}/test`);
});