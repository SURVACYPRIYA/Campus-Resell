const nodemailer = require('nodemailer');

const sendEmail = async ({ to, subject, html }) => {
    console.log('EMAIL_USER in sendEmail:', process.env.EMAIL_USER);
    console.log('EMAIL_PASS in sendEmail length:', process.env.EMAIL_PASS ? process.env.EMAIL_PASS.length : 'undefined/empty');
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: `"Campus ResellPortal" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', info.messageId);
        return info;
    } catch (err) {
        console.error('Detailed Email error:', err);
        throw err;
    }
};

module.exports = sendEmail;
