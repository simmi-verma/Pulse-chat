# 🚀 Pulse Chat - Real-Time Chat Application

A high-performance, full-stack real-time chat application built with **React (Vite)** for the frontend and **Node.js + Express + Socket.io** for the backend, with **SQLite** message persistence.

---

## ✨ Features & Highlights

- **⚡ Mandatory Socket.io Real-Time Messaging**: Messages are delivered instantly across all connected clients without requiring a page refresh.
- **💾 Database Persistence**: Messages are saved in a SQLite database (`database.sqlite`) so chat history is retained across application reloads.
- **🌐 REST APIs**: 
  - `GET /api/messages` to fetch historical messages.
  - `POST /api/messages` to send messages via HTTP fallback.
  - `GET /api/health` for backend status verification.
- **🎨 Glassmorphism Dark/Light Mode**: Sleek modern UI design featuring smooth glass overlays, vibrant gradient accents, and dark/light theme toggle.
- **👤 Dummy Authentication & Avatars**: Quick username login screen with custom emoji avatar selection or auto-generated guest profiles.
- **🟢 Online User Status & User List**: Dynamic online user count and sidebar listing active connected sockets.
- **✍️ Real-Time Typing Indicators**: Shows when users are typing with smooth animated dot indicators.
- **✔️ Read/Delivered Ticks**: Single tick for sent/delivered, double blue tick for read status.
- **📅 Smart Date Grouping & Timestamps**: Messages grouped by "Today", "Yesterday", or full dates with clear time badges (`10:42 AM`).

---

## 📁 Project Folder Architecture

```
realtime-chat-app/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js      # SQLite database setup & initialization
│   │   ├── controllers/
│   │   │   └── messageController.js # REST API controllers
│   │   ├── models/
│   │   │   └── messageModel.js  # Database queries
│   │   ├── routes/
│   │   │   └── messageRoutes.js # Express router endpoints
│   │   ├── sockets/
│   │   │   └── chatSocket.js    # Socket.io event handlers
│   │   └── server.js            # Main Express & Socket.io server entry point
│   ├── .env                     # Environment variables
│   ├── .env.example             # Sample environment variables
│   ├── database.sqlite          # SQLite persistent database file
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AuthModal.jsx    # Display name & avatar selection screen
│   │   │   ├── ChatWindow.jsx   # Core chat container
│   │   │   ├── Header.jsx       # App bar with theme & status indicators
│   │   │   ├── MessageBubble.jsx# Message bubble with ticks & timestamps
│   │   │   ├── MessageInput.jsx # Input field with typing triggers & emojis
│   │   │   ├── MessageList.jsx  # Scrollable message area with date badges
│   │   │   ├── Sidebar.jsx      # Online user listing & search
│   │   │   ├── Toast.jsx        # Notification popups
│   │   │   └── TypingIndicator.jsx # Live typing animation
│   │   ├── hooks/
│   │   │   └── useChat.js       # Custom hook managing socket state & APIs
│   │   ├── services/
│   │   │   ├── api.js           # Axios REST API client
│   │   │   └── socket.js        # Socket.io client instance
│   │   ├── App.jsx              # Main App React component
│   │   ├── index.css            # Glassmorphism design system & variables
│   │   └── main.jsx
│   ├── .env                     # Frontend environment configuration
│   ├── .env.example
│   └── package.json
└── README.md
```

---

## 🛠️ Environment Variables

### Backend (`backend/.env`)
```env
PORT=5000
CLIENT_ORIGIN=http://localhost:5173
DATABASE_FILE=./database.sqlite
```

### Frontend (`frontend/.env`)
```env
VITE_API_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
```

---

## 🚀 Setup & Execution Guide

### Prerequisites
- **Node.js** (v18.0.0 or higher)
- **npm** (v9.0.0 or higher)

### 1. Run the Backend Server
```bash
# Navigate to backend directory
cd backend

# Install dependencies (if not already installed)
npm install

# Start the Node.js Express + Socket.io backend server
npm start
```
> The server will start on `http://localhost:5000` and automatically create/seed `database.sqlite`.

---

### 2. Run the Frontend React Application
Open a new terminal window:
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies (if not already installed)
npm install

# Run the Vite React development server
npm run dev
```
> The frontend will run on `http://localhost:5173`. Open two browser windows side by side to test real-time Socket.io messaging!

---

## 📡 REST API & Socket.io Event Documentation

### REST Endpoints
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/messages` | Fetches complete chat history from SQLite. |
| `POST` | `/api/messages` | Sends a message via REST and broadcasts via Socket.io. |
| `PUT` | `/api/messages/read` | Marks messages as read. |
| `GET` | `/api/health` | Returns server uptime & health status. |

### Socket.io Events
| Event Name | Direction | Description |
| :--- | :--- | :--- |
| `user_join` | Client ➔ Server | Registers user session and broadcasts updated user list. |
| `send_message` | Client ➔ Server | Emits new chat message to be persisted & broadcast. |
| `receive_message` | Server ➔ Client | Receives new real-time message payload. |
| `typing_start` | Client ➔ Server | Triggers typing state for specified user. |
| `typing_stop` | Client ➔ Server | Stops typing indicator. |
| `online_users` | Server ➔ Client | Emits array of active connected sockets. |
| `user_status_change`| Server ➔ Client | Emits join/leave user events for toast alerts. |

---

## 💡 Design Decisions & Assumptions

1. **Vite + React Frontend Choice**: Selected Vite React web application to provide a rich glassmorphism UI with instant browser previews, responsive layout, dark mode, and seamless Socket.io connectivity.
2. **SQLite Database Engine**: SQLite via `sqlite3` driver was chosen for zero-config, self-contained file persistence (`database.sqlite`) ensuring messages are kept across reloads without requiring complex database installation.
3. **Resilient Dual Messaging Layer**: Real-time delivery uses Socket.io events (`send_message` / `receive_message`). In the event of socket disconnection, the client gracefully falls back to `POST /api/messages` REST API calls.
4. **Dummy Authentication Assumption**: Simple username and avatar selection is stored in `localStorage` for testing without requiring complex JWT/OAuth authentication overhead.

---

## 📜 License
MIT License. Developed for Real-Time Coding Technical Assessment.
