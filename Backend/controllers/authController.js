const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID_HERE');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');

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

exports.forgotPassword = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(404).json({ message: 'There is no user with that email address.' });
        }

        const resetToken = user.createPasswordResetToken();
        await user.save({ validateBeforeSave: false });

        const resetURL = `http://localhost:5174/reset-password/${resetToken}`;

        const htmlContent = `
            <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc; padding: 40px 20px;">
                <div style="background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08);">
                    <div style="background: linear-gradient(135deg, #C12632, #e85d6a); padding: 32px; text-align: center;">
                        <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px;">🔑 Reset Your Password</h1>
                        <p style="color: rgba(255,255,255,0.85); margin: 8px 0 0; font-size: 14px;">Campus ResellPortal · Anurag University</p>
                    </div>
                    <div style="padding: 36px 32px;">
                        <p style="color: #334155; font-size: 16px; line-height: 1.6; margin: 0 0 20px;">Hi <strong>${user.name}</strong>,</p>
                        <p style="color: #475569; font-size: 15px; line-height: 1.6; margin: 0 0 28px;">We received a request to reset the password for your account. Click the button below to set a new password. This link is valid for <strong>10 minutes</strong>.</p>
                        <div style="text-align: center; margin: 32px 0;">
                            <a href="${resetURL}" style="display: inline-block; background: linear-gradient(135deg, #C12632, #e85d6a); color: white; text-decoration: none; padding: 14px 36px; border-radius: 12px; font-size: 16px; font-weight: 700; letter-spacing: 0.3px; box-shadow: 0 4px 16px rgba(193, 38, 50, 0.3);">Reset My Password</a>
                        </div>
                        <p style="color: #94a3b8; font-size: 13px; line-height: 1.6; margin: 0 0 8px;">If the button doesn't work, paste this link into your browser:</p>
                        <p style="color: #C12632; font-size: 12px; word-break: break-all; background: #fef2f2; padding: 10px 14px; border-radius: 8px; margin: 0 0 24px;">${resetURL}</p>
                        <hr style="border: none; border-top: 1px solid #f1f5f9; margin: 24px 0;">
                        <p style="color: #94a3b8; font-size: 13px; margin: 0;">If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.</p>
                    </div>
                    <div style="background: #f8fafc; padding: 20px 32px; text-align: center; border-top: 1px solid #f1f5f9;">
                        <p style="color: #94a3b8; font-size: 12px; margin: 0;">© ${new Date().getFullYear()} Campus ResellPortal · Anurag University</p>
                    </div>
                </div>
            </div>
        `;

        await sendEmail({
            to: user.email,
            subject: 'Your Password Reset Link (valid for 10 minutes)',
            html: htmlContent,
        });

        res.status(200).json({
            status: 'success',
            message: 'Password reset link sent to your email!'
        });

    } catch (error) {
        console.error('Forgot password error:', error);
        // If there's an error, clear the reset token
        try {
            const user = await User.findOne({ email: req.body.email });
            if (user) {
                user.resetPasswordToken = undefined;
                user.resetPasswordExpires = undefined;
                await user.save({ validateBeforeSave: false });
            }
        } catch (_) {}
        res.status(500).json({ message: 'Failed to send reset email. Please check email configuration.' });
    }
};

exports.resetPassword = async (req, res) => {
    try {
        // 1) Get user based on the token
        const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: Date.now() }
        });

        // 2) If token has not expired, and there is user, set the new password
        if (!user) {
            return res.status(400).json({ message: 'Token is invalid or has expired' });
        }

        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        // 3) Update changedPasswordAt property for the user (optional, if you track it)
        
        // 4) Log the user in, send JWT
        const token = signToken(user._id);
        
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
        });

        res.status(200).json({
            status: 'success',
            message: 'Password successfully reset.',
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
