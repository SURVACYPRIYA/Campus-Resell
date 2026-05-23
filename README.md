# Campus Resell Portal

A secure campus-only marketplace where students can list, discover, and buy/sell pre-owned items.

## Features
- College email and Google-based authentication
- Product listings with categories and images
- Real-time buyer/seller chat using Socket.IO
- Report and moderation flow for safer community trading

## Tech Stack
- **Frontend:** React, Vite, Framer Motion, Lucide, Axios
- **Backend:** Node.js, Express, MongoDB (Mongoose), Socket.IO, JWT

## Project Structure
- `/Frontend` - React client
- `/Backend` - Express API + Socket.IO server

## Getting Started

### 1) Install dependencies
```bash
cd Backend && npm install
cd ../Frontend && npm install
```

### 2) Configure environment variables

Create `Backend/.env`:
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
FRONTEND_URL=http://localhost:5173
PORT=5000
```

Create `Frontend/.env`:
```env
VITE_API_URL=http://localhost:5000
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

### 3) Run the app

Start backend:
```bash
cd Backend
node server.js
```

Start frontend:
```bash
cd Frontend
npm run dev
```

## Admin Access
Set a user's `role` to `admin` in MongoDB to access moderation features.
