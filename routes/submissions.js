const express = require('express');
const router = express.Router();
const axios = require('axios');

router.get('/', async (req, res) => {
    try {
        const apiKey = req.header('X-API-Key');
        const wordpressUrl = req.header('X-WordPress-URL') || process.env.WORDPRESS_API_URL;
        const { form_id, limit = 50, offset = 0 } = req.query;
        
        if (!apiKey || !wordpressUrl) {
            return res.status(400).json({
                success: false,
                message: 'API key and WordPress URL are required.'
            });
        }
        
        let url = `${wordpressUrl}/fmp/v1/submissions?limit=${limit}&offset=${offset}`;
        if (form_id) {
            url += `&form_id=${form_id}`;
        }
        
        const response = await axios.get(url, {
            headers: {
                'X-API-Key': apiKey
            }
        });
        
        res.json({
            success: true,
            submissions: response.data
        });
    } catch (error) {
        console.error('Submissions fetch error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch submissions',
            error: error.response?.data?.message || error.message
        });
    }
});

router.put('/:id/status', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const apiKey = req.header('X-API-Key');
        const wordpressUrl = req.header('X-WordPress-URL') || process.env.WORDPRESS_API_URL;
        
        if (!apiKey || !wordpressUrl) {
            return res.status(400).json({
                success: false,
                message: 'API key and WordPress URL are required.'
            });
        }
        
        if (!status) {
            return res.status(400).json({
                success: false,
                message: 'Status is required.'
            });
        }
        
        const response = await axios.put(
            `${wordpressUrl}/fmp/v1/submissions/${id}/status`,
            { status },
            {
                headers: {
                    'X-API-Key': apiKey,
                    'Content-Type': 'application/json'
                }
            }
        );
        
        res.json({
            success: true,
            message: 'Submission status updated',
            data: response.data
        });
    } catch (error) {
        console.error('Status update error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Failed to update submission status',
            error: error.response?.data?.message || error.message
        });
    }
});

router.post('/send-email', async (req, res) => {
    try {
        const { submission_id, message } = req.body;
        const apiKey = req.header('X-API-Key');
        const wordpressUrl = req.header('X-WordPress-URL') || process.env.WORDPRESS_API_URL;
        
        if (!apiKey || !wordpressUrl) {
            return res.status(400).json({
                success: false,
                message: 'API key and WordPress URL are required.'
            });
        }
        
        if (!submission_id || !message) {
            return res.status(400).json({
                success: false,
                message: 'Submission ID and message are required.'
            });
        }
        
        const response = await axios.post(
            `${wordpressUrl}/fmp/v1/send-email`,
            { submission_id, message },
            {
                headers: {
                    'X-API-Key': apiKey,
                    'Content-Type': 'application/json'
                }
            }
        );
        
        res.json({
            success: true,
            message: 'Email sent successfully',
            data: response.data
        });
    } catch (error) {
        console.error('Email send error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Failed to send email',
            error: error.response?.data?.message || error.message
        });
    }
});

module.exports = router;
