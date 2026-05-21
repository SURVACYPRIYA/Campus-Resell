const Chat = require('../models/Chat');
const Message = require('../models/Message');

exports.getChats = async (req, res) => {
    try {
        const chats = await Chat.find({
            participants: { $in: [req.user.id] }
        })
        .populate('participants', 'name avatar')
        .populate('product', 'title images price')
        .populate('lastMessage')
        .sort('-updatedAt');

        res.status(200).json({
            status: 'success',
            results: chats.length,
            data: { chats }
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getMessages = async (req, res) => {
    try {
        const messages = await Message.find({ chat: req.params.chatId })
            .populate('sender', 'name avatar')
            .sort('createdAt');

        res.status(200).json({
            status: 'success',
            data: { messages }
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.createChat = async (req, res) => {
    try {
        const { sellerId, productId } = req.body;

        // Check if chat already exists
        let chat = await Chat.findOne({
            participants: { $all: [req.user.id, sellerId] },
            product: productId
        });

        if (!chat) {
            chat = await Chat.create({
                participants: [req.user.id, sellerId],
                product: productId
            });
        }

        res.status(201).json({
            status: 'success',
            data: { chat }
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
