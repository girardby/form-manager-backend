const express = require('express');
const router = express.Router();
const axios = require('axios');

router.get('/', async (req, res) => {
    try {
        const apiKey = req.header('X-API-Key');
        const wordpressUrl = req.header('X-WordPress-URL') || process.env.WORDPRESS_API_URL;
        
        if (!apiKey || !wordpressUrl) {
            return res.status(400).json({
                success: false,
                message: 'API key and WordPress URL are required.'
            });
        }
        
        const response = await axios.get(`${wordpressUrl}/fmp/v1/forms`, {
            headers: {
                'X-API-Key': apiKey
            }
        });
        
        res.json({
            success: true,
            forms: response.data
        });
    } catch (error) {
        console.error('Forms fetch error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch forms',
            error: error.response?.data?.message || error.message
        });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const apiKey = req.header('X-API-Key');
        const wordpressUrl = req.header('X-WordPress-URL') || process.env.WORDPRESS_API_URL;
        
        if (!apiKey || !wordpressUrl) {
            return res.status(400).json({
                success: false,
                message: 'API key and WordPress URL are required.'
            });
        }
        
        const response = await axios.get(`${wordpressUrl}/fmp/v1/forms/${id}`, {
            headers: {
                'X-API-Key': apiKey
            }
        });
        
        res.json({
            success: true,
            form: response.data
        });
    } catch (error) {
        console.error('Form fetch error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch form',
            error: error.response?.data?.message || error.message
        });
    }
});

module.exports = router;
