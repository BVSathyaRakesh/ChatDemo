# Socket.IO Connection Documentation

Complete guide for the WebSocket implementation using Socket.IO in the Dil Messenger app.

---

## Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [Authentication Flow](#authentication-flow)
3. [Backend Setup](#backend-setup)
4. [Frontend Setup](#frontend-setup)
5. [Common Issues & Fixes](#common-issues--fixes)
6. [Debugging Guide](#debugging-guide)
7. [Testing Checklist](#testing-checklist)

---

## Architecture Overview

### Stack
- **Backend**: Socket.IO server with JWT authentication
- **Frontend**: socket.io-client with React Native
- **Auth**: JWT tokens stored in AsyncStorage

### Connection Flow
```
1. User logs in → JWT token saved to AsyncStorage (@auth_token)
2. AuthContext triggers connectSocket()
3. Frontend retrieves token from storage
4. Socket.IO client connects with token in auth payload
5. Backend middleware verifies JWT
6. Backend fetches user from database
7. User data attached to socket.data
8. Connection established
```

---

## Authentication Flow

### JWT Structure
```typescript
// Token payload (auth.controller.ts)
{
  userId: "507f1f77bcf86cd799439011",
  iat: 1234567890,
  exp: 1234999999
}
```

### Socket Authentication Middleware
The backend validates every socket connection before allowing it:

```typescript
// backend/socket/socket.ts
io.use(async (socket, next) => {
  // 1. Extract token from handshake
  const token = socket.handshake.auth.token;

  // 2. Verify JWT
  const decoded = jwt.verify(token, JWT_SECRET);

  // 3. Fetch user from database
  const user = await User.findById(decoded.userId);

  // 4. Attach to socket
  socket.data.userId = user._id;
  socket.data.name = user.name;
  socket.data.email = user.email;
  socket.data.avatar = user.avatar;

  next();
});
```

---

## Backend Setup

### File Structure
```
backend/
├── socket/
│   ├── socket.ts          # Socket.IO initialization & auth
│   └── userEvents.ts      # Event handlers
├── index.ts               # Server entry point
└── controllers/
    └── auth.controller.ts # JWT generation
```

### Socket Initialization

**Location**: `backend/index.ts`

```typescript
import { initializeSocket } from './socket/socket.js';

const server = http.createServer(app);
initializeSocket(server);  // Initialize Socket.IO with HTTP server

connectDB().then(() => {
  server.listen(PORT);
});
```

### CORS Configuration

**Location**: `backend/socket/socket.ts`

```typescript
const io = new SocketIOServer(server, {
  cors: {
    origin: '*',  // Allow all origins (adjust for production)
  }
});
```

### Event Registration

**Location**: `backend/socket/userEvents.ts`

```typescript
export function registerUserEvents(io: SocketIOServer, socket: Socket) {
  socket.on('testSocket', (data) => {
    socket.emit('testSocket', { msg: "It's working!!!" });
  });

  // Add more event handlers here
}
```

---

## Frontend Setup

### File Structure
```
frontend/
├── src/
│   ├── socket/
│   │   └── socket.tsx          # Socket connection logic
│   ├── contexts/
│   │   └── AuthContext.tsx     # Triggers socket connection
│   └── constants/
│       └── index.ts            # API_URL configuration
```

### API URL Configuration

**Location**: `frontend/constants/index.ts`

```typescript
import { Platform } from 'react-native';

export const API_URL = Platform.OS === 'android'
  ? 'http://10.0.2.2:3000'      // Android emulator localhost
  : 'http://localhost:3000';     // iOS simulator/web
```

**Important**:
- Use `http://` not `https://` for local development
- Android emulator requires `10.0.2.2` to access host machine

### Socket Connection

**Location**: `frontend/src/socket/socket.tsx`

```typescript
let socket: Socket | null = null;

export async function connectSocket(): Promise<Socket> {
  // 1. Retrieve token from AsyncStorage
  const token = await AsyncStorage.getItem('@auth_token');

  if (!token) {
    throw new Error("no token found. User must login first");
  }

  // 2. Initialize socket if not already connected
  if (!socket) {
    socket = io(API_URL, {
      auth: { token }  // Send token in handshake
    });

    // 3. Wait for connection
    await new Promise((resolve, reject) => {
      socket?.on("connect", () => resolve(true));
      socket?.on("connect_error", (error) => reject(error));
    });
  }

  return socket;
}
```

### Storage Keys

**CRITICAL**: Storage keys must match exactly

**Location**: `frontend/src/services/storage.service.ts`

```typescript
const TOKEN_KEY = '@auth_token';  // Note the @ prefix
const USER_KEY = '@auth_user';
```

**Socket.tsx must use the same key**:
```typescript
const token = await AsyncStorage.getItem('@auth_token');  // Must include @
```

### Integration with Auth Context

**Location**: `frontend/src/contexts/AuthContext.tsx`

Socket connection is triggered after:
1. **Login** - `handleLogin()`
2. **Registration** - `handleRegister()`
3. **App Load** - `loadStoredAuth()` (if token exists)

```typescript
try {
  console.log('🔌 Attempting to connect socket...');
  await connectSocket();
  console.log('✅ Socket connected successfully');
} catch (socketError) {
  console.error('❌ Socket connection failed:', socketError);
  // Don't fail auth on socket error
}
```

---

## Common Issues & Fixes

### Issue 1: "no token found. User must login first"

**Cause**: Storage key mismatch

**Solution**: Ensure both files use `@auth_token`:
- `storage.service.ts`: `const TOKEN_KEY = '@auth_token'`
- `socket.tsx`: `AsyncStorage.getItem('@auth_token')`

---

### Issue 2: "Cannot read properties of undefined (reading 'id')"

**Cause**: JWT structure mismatch

**Problem**:
```typescript
// JWT payload is:
{ userId: "..." }

// But code expected:
decoded.user.id  // ❌ Wrong structure
```

**Solution**: Use correct JWT structure
```typescript
const decoded = jwt.verify(token) as { userId: string };
const user = await User.findById(decoded.userId);
socket.data.userId = user._id.toString();
```

---

### Issue 3: "Could not connect to any servers in your MongoDB Atlas cluster"

**Cause**: IP address not whitelisted in MongoDB Atlas

**Solution**:
1. Get your IP: `curl -4 ifconfig.me`
2. Go to MongoDB Atlas → Network Access
3. Add IP address or allow all (`0.0.0.0/0` for development)

---

### Issue 4: Connection error on Android

**Cause**: Wrong URL protocol or localhost address

**Solution**:
```typescript
// ❌ Wrong
const API_URL = 'https://10.0.2.2:3000';  // HTTPS not supported locally
const API_URL = 'http://localhost:3000';  // Doesn't work on Android

// ✅ Correct
const API_URL = Platform.OS === 'android'
  ? 'http://10.0.2.2:3000'   // Android emulator
  : 'http://localhost:3000';  // iOS/web
```

---

### Issue 5: Missing `await` on AsyncStorage

**Cause**: `AsyncStorage.getItem()` returns a Promise

**Solution**:
```typescript
// ❌ Wrong
const token = AsyncStorage.getItem('@auth_token');  // Returns Promise

// ✅ Correct
const token = await AsyncStorage.getItem('@auth_token');  // Returns string
```

---

## Debugging Guide

### Enable Detailed Logging

All logging is already implemented. Look for these emojis:

**Frontend logs**:
- 🔌 Attempting connection
- 🔑 Token retrieval
- 🌐 Server URL
- ✅ Success
- ❌ Errors

**Backend logs**:
- ✅ Server initialized
- 🔐 Auth attempt
- ✅ Auth success
- ❌ Auth failure
- 👤 User connected/disconnected

### Expected Log Sequence

#### Successful Connection

**Frontend Console**:
```
🔌 Attempting to connect socket after login...
🔑 Token retrieved from storage: Token found ✅
🌐 Connecting to socket server: http://localhost:3000
Socket connected: xAbCd1234
✅ Socket connected successfully
```

**Backend Console**:
```
✅ Socket.IO server initialized
Database Connected
Server is running on port 3000
🔐 Socket authentication attempt...
✅ Socket authenticated for user: John Doe ( john@example.com )
user connected 507f1f77bcf86cd799439011, username:John Doe
```

#### Failed Connection

**Frontend**:
```
🔌 Attempting to connect socket after login...
🔑 Token retrieved from storage: No token ❌
❌ Socket connection failed: Error: no token found
```

**Backend**:
```
🔐 Socket authentication attempt...
❌ Authentication failed: no token provided
```

### Testing Socket Events

Use the test event to verify bidirectional communication:

**Frontend**:
```typescript
const socket = getSocket();
socket?.emit('testSocket', { message: 'ping' });

socket?.on('testSocket', (data) => {
  console.log('Received:', data);  // { msg: "It's working!!!" }
});
```

---

## Testing Checklist

### Pre-flight Checks
- [ ] MongoDB Atlas IP whitelisted
- [ ] Backend `.env` has `JWT_SECRET`
- [ ] Backend running on correct port (3000)
- [ ] Frontend `API_URL` configured correctly

### Connection Tests
- [ ] New user registration → socket connects
- [ ] Existing user login → socket connects
- [ ] App reload with stored token → socket connects
- [ ] Invalid token → socket fails gracefully
- [ ] No token → socket fails gracefully

### Platform Tests
- [ ] iOS simulator connection works
- [ ] Android emulator connection works
- [ ] Physical device connection works (update API_URL to machine IP)

### Event Tests
- [ ] Send `testSocket` event → receive response
- [ ] Disconnect → backend logs user disconnection
- [ ] Reconnect → backend logs new connection

---

## Connection States

### Socket Lifecycle

```
Initialized → Connecting → Connected → Disconnected
                  ↓            ↓
              Error      Reconnecting
```

### Handling States in Frontend

```typescript
socket.on('connect', () => {
  console.log('Connected:', socket.id);
});

socket.on('disconnect', (reason) => {
  console.log('Disconnected:', reason);
});

socket.on('connect_error', (error) => {
  console.error('Connection error:', error.message);
});
```

---

## Production Considerations

### Security

1. **CORS Configuration**
```typescript
// Development
cors: { origin: '*' }

// Production
cors: {
  origin: ['https://yourdomain.com', 'https://app.yourdomain.com'],
  credentials: true
}
```

2. **Token Expiration**
- Current: 7 days
- Production: Consider shorter expiry + refresh tokens

3. **Rate Limiting**
- Add rate limiting middleware for socket connections
- Prevent abuse and DDoS attacks

### Monitoring

1. **Connection Metrics**
- Track concurrent connections
- Monitor authentication failures
- Log unusual disconnection patterns

2. **Error Tracking**
- Integrate Sentry or similar for error reporting
- Track socket errors separately from HTTP errors

### Scaling

1. **Redis Adapter**
```typescript
import { createAdapter } from '@socket.io/redis-adapter';
const io = new SocketIOServer(server, {
  adapter: createAdapter(pubClient, subClient)
});
```

2. **Load Balancing**
- Use sticky sessions for Socket.IO
- Configure load balancer for WebSocket support

---

## Quick Reference

### Storage Keys
- Token: `@auth_token`
- User: `@auth_user`

### API Endpoints
- Login: `POST /api/auth/login`
- Register: `POST /api/auth/register`

### Socket Events (Current)
- `testSocket`: Test event for verification
- `disconnect`: User disconnection

### Socket Data Available
```typescript
socket.data.userId  // MongoDB ObjectId as string
socket.data.name    // User's display name
socket.data.email   // User's email
socket.data.avatar  // User's avatar URL
```

---

## Need Help?

### Common Commands

**Check IP address**:
```bash
curl -4 ifconfig.me  # IPv4
```

**Restart backend**:
```bash
cd backend && npm start
```

**Restart frontend**:
```bash
cd frontend && npm start
```

**Clear AsyncStorage** (for testing):
```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';
await AsyncStorage.clear();
```

---

**Last Updated**: 2026-05-11
**Version**: 1.0.0
