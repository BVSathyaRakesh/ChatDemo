# Chat Demo - Full Stack Application

A full-stack messenger application with React Native frontend and Node.js backend.

## Project Structure

```
chatdemo/
├── frontend/          # React Native + Expo app
├── backend/           # Node.js backend server
└── README.md         # This file
```

## Getting Started

### Frontend (React Native + Expo)

```bash
cd frontend
npm install
npm start
```

See `frontend/README.md` for detailed frontend documentation.

### Backend (Node.js)

```bash
cd backend
npm install
npm start
```

Create your backend setup manually to understand the architecture.

## Recommended Backend Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Real-time**: Socket.io (for instant messaging)
- **Database**: MongoDB / PostgreSQL
- **Authentication**: JWT (JSON Web Tokens)
- **API Documentation**: Swagger/OpenAPI

## Backend Folder Structure Created

```
backend/
├── src/
│   ├── controllers/   # Request handlers
│   ├── models/        # Database models
│   ├── routes/        # API routes
│   ├── services/      # Business logic
│   ├── middleware/    # Auth, validation, etc.
│   ├── config/        # Configuration files
│   └── utils/         # Helper functions
└── package.json      # (create this)
```

## Development Workflow

1. Start backend server (e.g., `http://localhost:3000`)
2. Update frontend API URLs to point to backend
3. Test authentication flow
4. Implement real-time messaging with WebSockets/Socket.io
5. Deploy both services

## Next Steps

1. **Backend**: Initialize npm, install dependencies, create server.js
2. **Database**: Set up MongoDB/PostgreSQL connection
3. **API**: Create authentication and messaging endpoints
4. **Frontend**: Connect to backend API endpoints
5. **Real-time**: Integrate Socket.io for live messaging

## Environment Variables

### Frontend
- `EXPO_PUBLIC_API_URL` - Backend API URL

### Backend
- `PORT` - Server port (default: 3000)
- `DATABASE_URL` - Database connection string
- `JWT_SECRET` - Secret for JWT tokens
- `NODE_ENV` - Environment (development/production)
