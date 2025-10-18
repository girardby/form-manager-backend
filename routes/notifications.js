const express = require('express');
const router = express.Router();
const { verifyApiKey } = require('../middleware/auth');
const { sendPushNotification, sendMulticastNotification } = require('../config/firebase');

router.post('/send', verifyApiKey, async (req, res) => {
    try {
        const { fcm_token, title, body, data } = req.body;
        
        if (!fcm_token || !title || !body) {
            return res.status(400).json({
                success: false,
                message: 'FCM token, title, and body are required.'
            });
        }
        
        const dataToSend = {};
        if (data) {
            Object.keys(data).forEach(key => {
                dataToSend[key] = String(data[key]);
            });
        }
        
        const result = await sendPushNotification(fcm_token, title, body, dataToSend);
        
        res.json({
            success: true,
            message: 'Notification sent successfully',
            messageId: result
        });
    } catch (error) {
        console.error('Notification send error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to send notification',
            error: error.message
        });
    }
});

router.post('/send-multicast', verifyApiKey, async (req, res) => {
    try {
        const { fcm_tokens, title, body, data } = req.body;
        
        if (!fcm_tokens || !Array.isArray(fcm_tokens) || !title || !body) {
            return res.status(400).json({
                success: false,
                message: 'FCM tokens array, title, and body are required.'
            });
        }
        
        const dataToSend = {};
        if (data) {
            Object.keys(data).forEach(key => {
                dataToSend[key] = String(data[key]);
            });
        }
        
        const result = await sendMulticastNotification(fcm_tokens, title, body, dataToSend);
        
        res.json({
            success: true,
            message: 'Multicast notification sent',
            successCount: result.successCount,
            failureCount: result.failureCount,
            responses: result.responses
        });
    } catch (error) {
        console.error('Multicast notification error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to send multicast notification',
            error: error.message
        });
    }
});

router.post('/test', verifyApiKey, async (req, res) => {
    try {
        res.json({
            success: true,
            message: 'Notification API is working',
            firebase_initialized: true
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Notification test failed',
            error: error.message
        });
    }
});

module.exports = router;
