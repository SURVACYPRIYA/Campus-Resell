const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const dotenv = require('dotenv');

// LOAD ENV
dotenv.config();

const cors = require('cors');
const cookieParser = require('cookie-parser');

const connectDB = require('./config/db');

const Chat = require('./models/Chat');
const Message = require('./models/Message');

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const chatRoutes = require('./routes/chatRoutes');
const reportRoutes = require('./routes/reportRoutes');
const userRoutes = require('./routes/userRoutes');

// CONNECT DATABASE
connectDB();

const app = express();

const server = http.createServer(app);

// SOCKET.IO
const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL || [
            'http://localhost:5173',
            'http://localhost:5174'
        ],

        methods: ['GET', 'POST']
    }
});

// MIDDLEWARE
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ limit: '20mb', extended: true }));
app.use(cookieParser());

app.use(cors({
    origin: process.env.FRONTEND_URL || [
        'http://localhost:5173',
        'http://localhost:5174'
    ],

    credentials: true
}));

// ROUTES
app.use('/api/auth', authRoutes);

app.use('/api/products', productRoutes);

app.use('/api/chats', chatRoutes);

app.use('/api/reports', reportRoutes);

app.use('/api/users', userRoutes);

// TEST ROUTE
app.get('/', (req, res) => {
    res.send('Campus Resell API is running...');
});

// SOCKET CONNECTION
io.on('connection', (socket) => {

    console.log(
        'User connected:',
        socket.id
    );

    // SETUP PERSONAL ROOM
    socket.on('setup', (userId) => {
        socket.join(userId);
        console.log(`User ${userId} joined personal room`);
    });

    // JOIN CHAT ROOM
    socket.on('join_chat', (chatId) => {

        socket.join(chatId);

        console.log(
            `User joined chat: ${chatId}`
        );
    });

    // SEND MESSAGE
    socket.on(
        'send_message',
        async (data) => {

            try {

                // CREATE MESSAGE
                const newMessage =
                    await Message.create({
                        chat: data.chatId,

                        sender:
                            data.senderId,

                        content:
                            data.content
                    });

                // UPDATE LAST MESSAGE
                const updatedChat = await Chat.findByIdAndUpdate(
                    data.chatId,
                    {
                        lastMessage:
                            newMessage._id
                    },
                    { new: true }
                );

                // POPULATE SENDER
                const populatedMessage =
                    await Message.findById(
                        newMessage._id
                    ).populate('sender');

                // NOTIFY OTHER PARTICIPANTS IN THEIR PERSONAL ROOMS
                if (updatedChat && updatedChat.participants) {
                    updatedChat.participants.forEach(participantId => {
                        if (participantId.toString() !== data.senderId.toString()) {
                            io.to(participantId.toString()).emit('new_message_notification', {
                                _id: populatedMessage._id,
                                chatId: data.chatId,
                                sender: populatedMessage.sender,
                                content: populatedMessage.content,
                                read: populatedMessage.read,
                                createdAt: populatedMessage.createdAt
                            });
                        }
                    });
                }

                // SEND TO EVERYONE
                io.to(data.chatId).emit(
                    'receive_message',
                    {
                        _id:
                            populatedMessage._id,

                        chatId:
                            data.chatId,

                        sender:
                            populatedMessage.sender,

                        content:
                            populatedMessage.content,

                        read:
                            populatedMessage.read,

                        createdAt:
                            populatedMessage.createdAt
                    }
                );

            } catch (error) {

                console.error(
                    'Socket error:',
                    error
                );
            }
        }
    );

    // DISCONNECT
    socket.on('disconnect', () => {

        console.log(
            'User disconnected'
        );
    });

});

// PORT
const PORT =
    process.env.PORT || 5000;

// START SERVER
server.listen(PORT, () => {

    console.log(
        `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
    );
});