# Campus Resell Portal

A secure, internal marketplace for university students.

## Features
- **College-email Authentication**: Secure registration restricted to university domains.
- **Real-time Chat**: "Chat to Buy" functionality using Socket.io.
- **Marketplace**: Browse, search, and filter items by category (Books, Cycles, Electronics).
- **Moderation**: Report and ban system for community safety.

## Tech Stack
- **Frontend**: React, Vite, Framer Motion, Lucide Icons, Vanilla CSS (Glassmorphism).
- **Backend**: Node.js, Express, MongoDB (Mongoose), Socket.io, JWT.

## Getting Started

### Backend
1. `cd Backend`
2. `npm install` (already done)
3. Update `.env` with your `MONGO_URI`.
4. `npm start` (or `node server.js`)

### Frontend
1. `cd Frontend`
2. `npm install` (already done)
3. `npm run dev`

## Default Credentials (Admin)
- You can manually set a user's role to `admin` in the database to access moderation features.
