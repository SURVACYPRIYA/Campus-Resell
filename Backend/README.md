# AU Campus Trade — Backend

The Node.js + Express REST API and WebSocket server for **AU Campus Trade**. Handles authentication, product listings, real-time chat via Socket.io, and image uploads via Cloudinary.

## 🌐 Deployment

| | Link |
|---|---|
| ⚙️ Live on Render | [your-render-link-here](#) |

> Replace `#` with your actual Render deployment URL.

---

## 🛠️ Tech Stack

| Package | Purpose |
|---|---|
| `express` | Web framework |
| `mongoose` | MongoDB ODM |
| `socket.io` | Real-time WebSocket server |
| `jsonwebtoken` | JWT-based authentication |
| `bcryptjs` | Password hashing |
| `cloudinary` + `multer` | Image upload & CDN hosting |
| `cookie-parser` | HttpOnly cookie support |
| `cors` | Cross-origin request handling |
| `nodemailer` | Email notifications |
| `google-auth-library` | Google OAuth verification |
| `dotenv` | Environment variable management |

---

## 🚀 Local Setup

### Prerequisites
- Node.js `v18+`
- MongoDB (local or Atlas connection string)
- A free [Cloudinary](https://cloudinary.com) account

### Steps

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Create a `.env` file** in this directory:
   ```env
   # Server
   PORT=4000
   NODE_ENV=development

   # Database
   MONGO_URI=your_mongodb_connection_string

   # Security
   JWT_SECRET=your_jwt_secret_key

   # Cloudinary (Image Hosting)
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret

   # Frontend URL (for CORS)
   CLIENT_URL=http://localhost:5173

   # Google OAuth
   GOOGLE_CLIENT_ID=your_google_client_id
   ```

3. **Start the server**
   ```bash
   # Development (with auto-restart via nodemon)
   npx nodemon server.js

   # Production
   node server.js
   ```
   The API will be available at `http://localhost:4000`.

---

## 📁 Project Structure

```
Backend/
├── config/          # DB connection & Cloudinary config
├── controllers/     # Route handler logic
├── middleware/      # Auth middleware, error handlers
├── models/          # Mongoose schemas (User, Product, Chat, etc.)
├── routes/          # Express route definitions
├── sockets/         # Socket.io event handlers
├── utils/           # Helper functions
└── server.js        # App entry point
```

---

## 🔌 API Overview

| Method | Route | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register new user |
| `POST` | `/api/auth/login` | Login & set cookie |
| `POST` | `/api/auth/logout` | Clear auth cookie |
| `GET` | `/api/products` | Get all listings |
| `POST` | `/api/products` | Create new listing |
| `GET` | `/api/products/:id` | Get single listing |
| `DELETE` | `/api/products/:id` | Delete listing |
| `GET` | `/api/chat/:userId` | Get chat history |
| `POST` | `/api/wishlist/:productId` | Toggle wishlist item |

---

## ☁️ Deploying to Render

1. Push your code to GitHub.
2. Go to [render.com](https://render.com) → **New Web Service** → Connect your repo.
3. Set **Root Directory** to `Backend`.
4. Set **Start Command** to `node server.js`.
5. Add all environment variables from `.env` under the **Environment** tab.
6. Click **Deploy**.

> **Important:** Set `NODE_ENV=production` and update `CLIENT_URL` to your Vercel frontend URL on Render.
