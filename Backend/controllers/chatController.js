const Chat = require('../models/Chat');
const Message = require('../models/Message');

exports.getChats = async (req, res) => {
    try {
        const chats = await Chat.find({
            participants: { $in: [req.user._id] }
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
            participants: { $all: [req.user._id, sellerId] },
            product: productId
        });

        if (!chat) {
            chat = await Chat.create({
                participants: [req.user._id, sellerId],
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
// Delete chat
exports.deleteChat = async (req, res) => {
  try {
    console.log('DeleteChat endpoint hit with params:', req.params, 'userId:', req.user._id);
    const { chatId } = req.params;
    console.log('DeleteChat request: chatId', chatId, 'userId', req.user._id);
    const chat = await Chat.findById(chatId);
    if (!chat) {
      console.warn('Chat not found for deletion');
      return res.status(404).json({ message: 'Conversation not found' });
    }
    const isParticipant = chat.participants.some(id => id.toString() === req.user._id.toString());
    if (!isParticipant) {
      console.warn('Unauthorized delete attempt by user', req.user._id);
      return res.status(403).json({ message: 'You are not authorized to delete this conversation' });
    }
    await Message.deleteMany({ chat: chatId });
    await Chat.findByIdAndDelete(chatId);
    console.log('Conversation deleted successfully for chatId', chatId);
    res.status(200).json({ status: 'success', message: 'Conversation deleted successfully' });
  } catch (error) {
    console.error('Error in deleteChat:', error);
    res.status(500).json({ message: error.message || 'Server error while deleting conversation' });
  }
};

exports.getInterestedBuyers = async (req, res) => {
    try {
        const { productId } = req.params;
        const chats = await Chat.find({ product: productId }).populate('participants', 'name email avatar');
        
        const buyers = [];
        chats.forEach(chat => {
            chat.participants.forEach(participant => {
                if (participant._id.toString() !== req.user._id.toString()) {
                    buyers.push(participant);
                }
            });
        });

        const uniqueBuyers = Array.from(new Map(buyers.map(b => [b._id.toString(), b])).values());

        res.status(200).json({
            status: 'success',
            data: { buyers: uniqueBuyers }
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
