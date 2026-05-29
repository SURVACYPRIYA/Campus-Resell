# AU Campus Trade

A secure, premium, and exclusive internal marketplace built specifically for university students.

## 🌐 Live Demo

| Service | Link |
|---------|------|
| 🖥️ Frontend (Vercel) | [your-vercel-link-here](#) |
| ⚙️ Backend (Render) | [your-render-link-here](#) |


## ✨ Key Features
- **University-Exclusive Access:** Secure registration restricted to `@anurag.edu.in` university email domains to ensure a trusted community.
- **Real-Time Communication:** Instant "Chat to Buy" functionality built on Socket.io for seamless negotiation.
- **Cloud Image Hosting:** High-performance product image uploads powered by **Cloudinary**.
- **Wishlist & Dashboard:** Users can save their favorite items, manage their active listings, and track their past purchases through a personalized dashboard.
- **Secure Authentication:** JWT-based authentication utilizing highly secure `HttpOnly` cookies.
- **Premium UI/UX:** A stunning, modern interface featuring a dark mode aesthetic, vibrant gradients, glass-morphic components, and smooth micro-animations.

## 🛠️ Tech Stack
- **Frontend:** React, Vite, Framer Motion, Lucide Icons, Vanilla CSS (Custom Design System)
- **Backend:** Node.js, Express, MongoDB (Mongoose), Socket.io, JWT
- **Cloud Storage:** Cloudinary (for high-speed image CDN delivery)

## 🚀 Getting Started

### Prerequisites
You will need Node.js and MongoDB installed, along with a free Cloudinary account for image hosting.

### 1. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd Backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `Backend` folder and populate it with the following:
   ```env
   # Server Configuration
   PORT=4000
   
   # Database
   MONGO_URI=your_mongodb_connection_string
   
   # Security
   JWT_SECRET=your_jwt_secret_key
   NODE_ENV=development
   
   # Cloudinary (Image Hosting)
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```
4. Start the backend server:
   ```bash
   npm start
   ```

### 2. Frontend Setup
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd Frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```

## 🛡️Security
- **Reporting System:** Built-in community safety features allow students to report suspicious listings and inappropriate behavior.
