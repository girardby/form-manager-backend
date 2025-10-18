const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const axios = require('axios');

router.post('/login', async (req, res) => {
    try {
        const { username, password, wordpress_url } = req.body;
        
        if (!username || !password || !wordpress_url) {
            return res.status(400).json({
                success: false,
                message: 'Username, password, and WordPress URL are required.'
            });
        }
        
        const wpApiUrl = `${wordpress_url}/wp-json/fmp/v1/auth/login`;
        
        const response = await axios.post(wpApiUrl, {
            username,
            password
        });
        
        if (response.data.success) {
            const user = response.data.user;
            
            const token = jwt.sign(
                { 
                    id: user.id, 
                    username: user.username,
                    email: user.email,
                    api_key: user.api_key
                },
                process.env.JWT_SECRET,
                { expiresIn: '30d' }
            );
            
            res.json({
                success: true,
                message: 'Login successful',
                token: token,
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    name: user.name,
                    api_key: user.api_key
                }
            });
        } else {
            res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }
    } catch (error) {
        console.error('Login error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Login failed',
            error: error.response?.data?.message || error.message
        });
    }
});

router.post('/verify-token', (req, res) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'No token provided'
            });
        }
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        res.json({
            success: true,
            user: decoded
        });
    } catch (error) {
        res.status(401).json({
            success: false,
            message: 'Invalid or expired token'
        });
    }
});

module.exports = router;
