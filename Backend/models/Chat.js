const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    participants: [{
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    }],
    product: {
        type: mongoose.Schema.ObjectId,
        ref: 'Product'
    },
    lastMessage: {
        type: mongoose.Schema.ObjectId,
        ref: 'Message'
    }
}, {
    timestamps: true
});

const Chat = mongoose.model('Chat', chatSchema);
module.exports = Chat;
