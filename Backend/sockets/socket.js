const { Server } = require('socket.io');
const Message = require('./models/Message');

const setupSocket = (server) => {

  const io = new Server(server, {
    cors: {
      origin: 'http://localhost:5174',
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {

    console.log('User connected');

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

        // GET FULL MESSAGE WITH USER
        const populatedMessage =
          await Message.findById(newMessage._id)
            .populate('sender');

        // SEND TO EVERYONE IN ROOM
        io.to(data.chatId).emit(
          'receive_message',
          {
            _id: populatedMessage._id,

            chatId: data.chatId,

            sender: populatedMessage.sender,

            content: populatedMessage.content,

            createdAt:
              populatedMessage.createdAt
          }
        );

      } catch (err) {
        console.log(err);
      }

    });

    socket.on('disconnect', () => {
      console.log('User disconnected');
    });

  });

};

module.exports = setupSocket;