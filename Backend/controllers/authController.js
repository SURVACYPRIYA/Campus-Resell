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

        // Validate university email domain
        if (!email.endsWith('@anurag.edu.in')) {
            return res.status(403).json({ message: 'Only @anurag.edu.in emails are authorized.' });
        }

        const user = await User.create({
            name,
            email,
            password
        });

        const token = signToken(user._id);

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
        });

        res.status(201).json({
            status: 'success',
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

        if (!email.endsWith('@anurag.edu.in')) {
            return res.status(403).json({ message: 'Only @anurag.edu.in emails are authorized.' });
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

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
        });

        res.status(200).json({
            status: 'success',
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
        const { token, accessToken } = req.body;
        if (!token && !accessToken) {
            return res.status(400).json({ message: 'No Google token provided' });
        }

        let email, name, picture;

        if (accessToken) {
            // Validate using Google UserInfo API for Access Token
            const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                headers: { Authorization: `Bearer ${accessToken}` }
            });
            
            if (!response.ok) {
                throw new Error('Failed to fetch user info from Google');
            }
            
            const data = await response.json();
            email = data.email;
            name = data.name;
            picture = data.picture;
        } else {
            // Validate using Google Auth Library for ID Token (Backward compatibility)
            const ticket = await client.verifyIdToken({
                idToken: token,
                audience: process.env.GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID_HERE',
            });
            const payload = ticket.getPayload();
            email = payload.email;
            name = payload.name;
            picture = payload.picture;
        }

        if (!email.endsWith('@anurag.edu.in')) {
            return res.status(403).json({ message: 'Only @anurag.edu.in emails are authorized.' });
        }

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

        res.cookie('token', jwtToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
        });

        res.status(200).json({
            status: 'success',
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

exports.logout = (req, res) => {
    res.cookie('token', 'loggedout', {
        httpOnly: true,
        expires: new Date(Date.now() + 10 * 1000), // expires in 10 seconds
    });
    res.status(200).json({ status: 'success', message: 'Logged out successfully' });
};
