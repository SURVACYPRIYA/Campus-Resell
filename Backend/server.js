const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const dotenv = require('dotenv');
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

dotenv.config();

// CONNECT DB
connectDB();

const app = express();
const server = http.createServer(app);

// =========================
// 🌍 ALLOWED ORIGINS FIX
// =========================
const allowedOrigins = new Set(
  (
    process.env.FRONTEND_URL
      ? process.env.FRONTEND_URL.split(',')
      : [
          'http://localhost:5173',
          'http://127.0.0.1:5173',
          'http://localhost:5174',
          'https://campus-resell-rho.vercel.app'
        ]
  ).map(o => o.trim().replace(/\/$/, ''))
);

// =========================
// 🔥 EXPRESS CORS
// =========================
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // Postman / mobile apps

    const cleanOrigin = origin.replace(/\/$/, '');

    if (allowedOrigins.has(cleanOrigin)) {
      return callback(null, true);
    }

    console.log("❌ Blocked CORS Origin:", origin);
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true
}));

// =========================
// 🔥 SOCKET.IO CORS
// =========================
const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      const cleanOrigin = origin.replace(/\/$/, '');

      if (allowedOrigins.has(cleanOrigin)) {
        return callback(null, true);
      }

      console.log("❌ Blocked Socket Origin:", origin);
      return callback(new Error("Socket CORS blocked"));
    },
    credentials: true
  }
});

// =========================
// 🧠 MIDDLEWARE
// =========================
app.set('trust proxy', 1);
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));
app.use(cookieParser());

// =========================
// 📦 ROUTES
// =========================
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/users', userRoutes);

// =========================
// 🧪 TEST ROUTES
// =========================
app.get('/', (req, res) => {
  res.send('Campus Resell API is running...');
});

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: Date.now() });
});

// =========================
// 🔌 SOCKET LOGIC
// =========================
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // join personal room
  socket.on('setup', (userId) => {
    socket.join(userId);
  });

  // join chat room
  socket.on('join_chat', (chatId) => {
    socket.join(chatId);
  });

  // send message
  socket.on('send_message', async (data) => {
    try {
      const newMessage = await Message.create({
        chat: data.chatId,
        sender: data.senderId,
        content: data.content
      });

      const updatedChat = await Chat.findByIdAndUpdate(
        data.chatId,
        { lastMessage: newMessage._id },
        { new: true }
      );

      const populatedMessage = await Message.findById(newMessage._id)
        .populate('sender');

      // notify other participants
      if (updatedChat?.participants) {
        updatedChat.participants.forEach((participantId) => {
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

      // send to chat room
      io.to(data.chatId).emit('receive_message', {
        _id: populatedMessage._id,
        chatId: data.chatId,
        sender: populatedMessage.sender,
        content: populatedMessage.content,
        read: populatedMessage.read,
        createdAt: populatedMessage.createdAt
      });

    } catch (error) {
      console.error('Socket error:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// =========================
// 🚀 START SERVER
// =========================
const PORT = process.env.PORT || 5001;

server.listen(PORT, () => {
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
  );
});