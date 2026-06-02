const { Server } = require('socket.io');
const Message = require('../models/Message');
const Chat = require('../models/Chat');

const setupSocket = (server) => {

  const io = new Server(server, {
    cors: {
      origin: [
        'http://localhost:5174',
        'https://campus-resell-rho.vercel.app'
      ],
      methods: ['GET', 'POST'],
      credentials: true
    }
  });

  io.on('connection', (socket) => {

    console.log('User connected');

    // SETUP USER PERSONAL ROOM
    socket.on('setup', (userId) => {
      socket.join(userId);
      console.log('User setup room:', userId);
    });

    // JOIN CHAT ROOM
    socket.on('join_chat', (chatId) => {
      socket.join(chatId);
      console.log('Joined room:', chatId);
    });

    // SEND MESSAGE
    socket.on('send_message', async (data) => {
      try {
        // SAVE MESSAGE
        const newMessage = await Message.create({
          chat: data.chatId,
          sender: data.senderId,
          content: data.content
        });

        // UPDATE CHAT'S LAST MESSAGE & GET PARTICIPANTS
        const updatedChat = await Chat.findByIdAndUpdate(
          data.chatId,
          { lastMessage: newMessage._id },
          { new: true }
        );

        // GET FULL MESSAGE WITH SENDER POPULATED
        const populatedMessage = await Message.findById(newMessage._id).populate('sender');

        const messagePayload = {
          _id: populatedMessage._id,
          chatId: data.chatId,
          sender: populatedMessage.sender,
          content: populatedMessage.content,
          createdAt: populatedMessage.createdAt
        };

        // SEND TO EVERYONE IN THE CHAT ROOM
        io.to(data.chatId).emit('receive_message', messagePayload);

        // SEND PERSONAL NOTIFICATION TO OTHER PARTICIPANTS
        if (updatedChat && updatedChat.participants) {
          updatedChat.participants.forEach(participantId => {
            if (participantId.toString() !== data.senderId.toString()) {
              io.to(participantId.toString()).emit('new_message_notification', messagePayload);
              console.log('Sent notification to participant:', participantId.toString());
            }
          });
        }

      } catch (err) {
        console.error('socket send_message error:', err);
      }
    });

    socket.on('disconnect', () => {
      console.log('User disconnected');
    });

  });

};

module.exports = setupSocket;
