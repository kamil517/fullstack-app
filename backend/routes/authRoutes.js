const express = require('express');
const router = express.Router();

// Test route
router.get('/test', (req, res) => {
    res.json({ message: 'Auth routes are working!' });
});

// Register route
router.post('/register', (req, res) => {
    console.log('📝 Register request:', req.body);
    
    const { name, email, password, role } = req.body;
    
    // Create a fake token (in real app, use JWT)
    const fakeToken = 'fake-jwt-token-' + Date.now();
    
    res.json({ 
        success: true, 
        message: 'User registered successfully',
        token: fakeToken,
        user: { 
            id: Date.now(),  // Fake ID
            name: name, 
            email: email, 
            role: role || 'student' 
        }
    });
});

// Login route
router.post('/login', (req, res) => {
    console.log('🔐 Login request:', req.body);
    
    const { email, password } = req.body;
    
    const fakeToken = 'fake-jwt-token-' + Date.now();
    
    res.json({ 
        success: true, 
        message: 'Login successful',
        token: fakeToken,
        user: { 
            id: Date.now(),
            name: email.split('@')[0],
            email: email, 
            role: 'student'
        }
    });
});

module.exports = router;