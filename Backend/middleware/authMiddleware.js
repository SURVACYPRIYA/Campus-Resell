const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
    try {
        console.log('--- Auth Middleware Start ---');
        console.log('Cookies received:', req.cookies);
        let token;
        if (req.cookies && req.cookies.token) {
            token = req.cookies.token;
            console.log('Token from cookie:', token);
        } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
            console.log('Token from Authorization header:', token);
        }
        if (!token) {
            console.warn('No token provided');
            return res.status(401).json({ message: 'You are not logged in! Please log in to get access.' });
        }
        console.log('JWT_SECRET length:', process.env.JWT_SECRET?.length);
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log('Decoded JWT payload:', decoded);
        } catch (verifyErr) {
            console.error('JWT verification error:', verifyErr);
            return res.status(401).json({ message: 'Invalid token' });
        }
        const currentUser = await User.findById(decoded.id);
        if (!currentUser) {
            console.warn('User not found for ID:', decoded.id);
            return res.status(401).json({ message: 'The user belonging to this token no longer exists.' });
        }
        if (currentUser.isBanned) {
            console.warn('Banned user attempted access, ID:', currentUser._id);
            return res.status(403).json({ message: 'Your account has been banned.' });
        }
        req.user = currentUser;
        console.log('Auth middleware success for user ID:', currentUser._id);
        console.log('--- Auth Middleware End ---');
        next();
    } catch (error) {
        console.error('Unexpected auth middleware error:', error);
        res.status(401).json({ message: 'Invalid token' });
    }
};

exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'You do not have permission to perform this action' });
        }
        next();
    };
};
