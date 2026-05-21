const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID_HERE');
const crypto = require('crypto');

const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};

exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Validate university email domain (example check)
        const emailDomain = email.split('@')[1];
        // In a real scenario, you'd check against a list of allowed domains
        // For now, let's just ensure it's a valid domain format
        if (!emailDomain.includes('.')) {
            return res.status(400).json({ message: 'Please use a valid university email' });
        }

        const user = await User.create({
            name,
            email,
            password
        });

        const token = signToken(user._id);

        res.status(201).json({
            status: 'success',
            token,
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            }
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1) Check if email and password exist
        if (!email || !password) {
            return res.status(400).json({ message: 'Please provide email and password' });
        }

        // 2) Check if user exists && password is correct
        const user = await User.findOne({ email }).select('+password');

        if (!user || !(await user.comparePassword(password, user.password))) {
            return res.status(401).json({ message: 'Incorrect email or password' });
        }

        // 3) Check if user is banned
        if (user.isBanned) {
            return res.status(403).json({ message: 'Your account has been banned' });
        }

        // 4) If everything ok, send token to client
        const token = signToken(user._id);

        res.status(200).json({
            status: 'success',
            token,
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            }
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        res.status(200).json({
            status: 'success',
            data: { user }
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.googleLogin = async (req, res) => {
    try {
        const { token } = req.body;
        if (!token) {
            return res.status(400).json({ message: 'No Google token provided' });
        }

        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID_HERE',
        });
        
        const payload = ticket.getPayload();
        const { email, name, picture } = payload;

        // Check if user exists
        let user = await User.findOne({ email });

        if (!user) {
            // Generate a random secure password for Google-authenticated users
            const randomPassword = crypto.randomBytes(16).toString('hex');
            
            user = await User.create({
                name,
                email,
                password: randomPassword,
                avatar: picture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`
            });
        }

        if (user.isBanned) {
            return res.status(403).json({ message: 'Your account has been banned' });
        }

        const jwtToken = signToken(user._id);

        res.status(200).json({
            status: 'success',
            token: jwtToken,
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    avatar: user.avatar
                }
            }
        });
    } catch (error) {
        console.error('Google login error:', error);
        res.status(400).json({ message: error.message || 'Google authentication failed' });
    }
};
