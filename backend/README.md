# Dil Messenger - Backend

Backend server for the Dil Messenger application.

## Setup Instructions

### 1. Initialize Node.js Project

```bash
npm init -y
```

### 2. Install Dependencies

**Core dependencies:**
```bash
npm install express cors dotenv
npm install socket.io              # For real-time messaging
npm install mongoose               # If using MongoDB
# OR
npm install pg pg-hstore           # If using PostgreSQL
npm install jsonwebtoken bcrypt    # For authentication
```

**Dev dependencies:**
```bash
npm install -D nodemon typescript @types/node @types/express
npm install -D @types/cors @types/jsonwebtoken @types/bcrypt
```

### 3. Create Entry Point

Create `src/server.js` or `src/server.ts` as your main entry point.

### 4. Environment Variables

Create `.env` file:
```env
PORT=3000
DATABASE_URL=mongodb://localhost:27017/dil-messenger
JWT_SECRET=your-secret-key-here
NODE_ENV=development
```

### 5. Folder Structure

```
src/
├── controllers/    # Handle HTTP requests
│   ├── auth.controller.js
│   ├── user.controller.js
│   ├── message.controller.js
│   └── conversation.controller.js
├── models/         # Database schemas
│   ├── User.js
│   ├── Message.js
│   └── Conversation.js
├── routes/         # API endpoints
│   ├── auth.routes.js
│   ├── user.routes.js
│   ├── message.routes.js
│   └── conversation.routes.js
├── services/       # Business logic
│   ├── auth.service.js
│   ├── message.service.js
│   └── socket.service.js
├── middleware/     # Custom middleware
│   ├── auth.middleware.js
│   ├── error.middleware.js
│   └── validation.middleware.js
├── config/         # Configuration
│   ├── database.js
│   └── socket.js
└── utils/          # Helper functions
    ├── jwt.utils.js
    └── validation.utils.js
```

## API Endpoints to Implement

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user profile

### Conversations
- `GET /api/conversations` - Get user's conversations
- `GET /api/conversations/:id` - Get conversation by ID
- `POST /api/conversations` - Create new conversation
- `DELETE /api/conversations/:id` - Delete conversation

### Messages
- `GET /api/messages/:conversationId` - Get messages in conversation
- `POST /api/messages` - Send new message
- `PUT /api/messages/:id` - Update message
- `DELETE /api/messages/:id` - Delete message

### WebSocket Events (Socket.io)
- `connection` - User connects
- `disconnect` - User disconnects
- `join-conversation` - Join conversation room
- `send-message` - Send message in real-time
- `typing` - User is typing indicator
- `message-read` - Mark message as read

## Example Server Setup

```javascript
// src/server.js
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Dil Messenger API' });
});

// Socket.io connection
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

## Development

```bash
# Start server with nodemon (auto-restart)
npm run dev

# Start server normally
npm start
```

Add to `package.json`:
```json
{
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js"
  }
}
```

## Database Schema Examples

### User Model
```javascript
{
  _id: ObjectId,
  email: String,
  password: String (hashed),
  username: String,
  avatar: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Conversation Model
```javascript
{
  _id: ObjectId,
  participants: [ObjectId],  // User IDs
  lastMessage: String,
  lastMessageTime: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Message Model
```javascript
{
  _id: ObjectId,
  conversationId: ObjectId,
  senderId: ObjectId,
  content: String,
  timestamp: Date,
  read: Boolean,
  createdAt: Date
}
```

## Security Best Practices

1. Hash passwords with bcrypt
2. Use JWT for authentication
3. Validate all inputs
4. Rate limit API endpoints
5. Use HTTPS in production
6. Sanitize user inputs
7. Implement proper CORS policies
8. Store secrets in environment variables

## Testing

```bash
# Install testing dependencies
npm install -D jest supertest

# Run tests
npm test
```

## Deployment

- **Heroku**: `git push heroku main`
- **Railway**: Connect GitHub repo
- **Render**: Connect GitHub repo
- **AWS EC2**: Manual deployment
- **Docker**: Create Dockerfile and docker-compose.yml

## Resources

- [Express.js Docs](https://expressjs.com/)
- [Socket.io Docs](https://socket.io/)
- [MongoDB Docs](https://docs.mongodb.com/)
- [JWT Docs](https://jwt.io/)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
