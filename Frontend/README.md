# AU Campus Trade — Frontend

The React + Vite frontend for **AU Campus Trade**, a university-exclusive student marketplace. Features a premium dark-mode UI with real-time chat, Cloudinary image hosting, and smooth animations.

## 🌐 Deployment

| | Link |
|---|---|
| 🖥️ Live on Vercel | [your-vercel-link-here](#) |

> Replace `#` with your actual Vercel deployment URL.

---

## 🛠️ Tech Stack

| Package | Purpose |
|---|---|
| `react` + `react-dom` | UI framework |
| `vite` | Build tool & dev server |
| `react-router-dom` | Client-side routing |
| `axios` | HTTP requests to backend |
| `socket.io-client` | Real-time chat (WebSocket) |
| `framer-motion` | Animations & transitions |
| `lucide-react` | Icon library |
| `react-hot-toast` | Toast notifications |
| `@react-oauth/google` | Google OAuth login |

---

## 🚀 Local Setup

### Prerequisites
- Node.js `v18+`
- Backend server running (see `../Backend/README.md`)

### Steps

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Create a `.env` file** in this directory:
   ```env
   VITE_BACKEND_URL=http://localhost:4000
   ```

3. **Start the dev server**
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:5173`.

---

## 📜 Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Build for production (`/dist`) |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint checks |

---

## 📁 Project Structure

```
Frontend/
├── public/            # Static assets
├── src/
│   ├── components/    # Reusable UI components
│   ├── pages/         # Page-level components
│   ├── context/       # React context (auth, socket, etc.)
│   ├── assets/        # Images and static files
│   └── main.jsx       # App entry point
├── index.html
└── vite.config.js
```

---

## ☁️ Deploying to Vercel

1. Push your code to GitHub.
2. Go to [vercel.com](https://vercel.com) → **New Project** → Import your repo.
3. Set **Root Directory** to `Frontend`.
4. Add environment variables:
   - `VITE_BACKEND_URL` → your Render backend URL
5. Click **Deploy**.
