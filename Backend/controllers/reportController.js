const Report = require('../models/Report');
const User = require('../models/User');
const Product = require('../models/Product');

exports.createReport = async (req, res) => {
    try {
        const { reportedUserId, reportedProductId, reason } = req.body;
        
        const report = await Report.create({
            reporter: req.user._id,
            reportedUser: reportedUserId,
            reportedProduct: reportedProductId,
            reason
        });

        res.status(201).json({
            status: 'success',
            data: { report }
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getAllReports = async (req, res) => {
    try {
        const reports = await Report.find()
            .populate('reporter', 'name email')
            .populate('reportedUser', 'name email isBanned')
            .populate('reportedProduct', 'title price')
            .sort('-createdAt');

        res.status(200).json({
            status: 'success',
            data: { reports }
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.resolveReport = async (req, res) => {
    try {
        const { status, banUser } = req.body;
        const report = await Report.findById(req.params.id);

        if (!report) {
            return res.status(404).json({ message: 'Report not found' });
        }

        report.status = status;
        await report.save();

        if (banUser && report.reportedUser) {
            await User.findByIdAndUpdate(report.reportedUser, { isBanned: true });
        }

        res.status(200).json({
            status: 'success',
            data: { report }
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
