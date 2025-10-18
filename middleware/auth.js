const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Access denied. No token provided.'
        });
    }
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({
            success: false,
            message: 'Invalid token.'
        });
    }
}

function verifyApiKey(req, res, next) {
    const apiKey = req.header('X-API-Key');
    
    if (!apiKey) {
        return res.status(401).json({
            success: false,
            message: 'API key required.'
        });
    }
    
    if (apiKey !== process.env.API_KEY) {
        return res.status(401).json({
            success: false,
            message: 'Invalid API key.'
        });
    }
    
    next();
}

function validateRequest(schema) {
    return (req, res, next) => {
        const { error } = schema.validate(req.body);
        
        if (error) {
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                details: error.details.map(d => d.message)
            });
        }
        
        next();
    };
}

module.exports = {
    verifyToken,
    verifyApiKey,
    validateRequest
};
