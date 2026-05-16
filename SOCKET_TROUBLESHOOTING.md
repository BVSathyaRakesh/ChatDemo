# Socket Connection Troubleshooting

Quick reference for debugging Socket.IO connection issues.

---

## Quick Diagnostics

### 1. Check Logs

**Frontend should show:**
```
🔌 Attempting to connect socket...
🔑 Token retrieved from storage: Token found ✅
🌐 Connecting to socket server: http://localhost:3000
Socket connected: <id>
✅ Socket connected successfully
```

**Backend should show:**
```
✅ Socket.IO server initialized
🔐 Socket authentication attempt...
✅ Socket authenticated for user: <name> ( <email> )
user connected <userId>, username:<name>
```

---

## Common Errors & Solutions

### Error: "no token found. User must login first"

**Cause**: Storage key mismatch

**Check**:
```bash
# Search for storage key usage
grep -r "@auth_token" frontend/src/
```

**Fix**: Ensure both use `@auth_token`:
- `frontend/src/services/storage.service.ts:4`
- `frontend/src/socket/socket.tsx:9`

---

### Error: "Cannot read properties of undefined (reading 'id')"

**Cause**: JWT structure mismatch

**Check JWT payload** in `backend/controllers/auth.controller.ts:8`:
```typescript
jwt.sign({ userId }, ...)  // Correct structure
```

**Fix socket.ts** to match:
```typescript
const decoded = jwt.verify(token) as { userId: string };
const user = await User.findById(decoded.userId);  // Use decoded.userId
socket.data.userId = user._id.toString();          // Not userData.id
```

---

### Error: "Could not connect to any servers in MongoDB Atlas"

**Cause**: IP not whitelisted

**Get your IP**:
```bash
curl -4 ifconfig.me
```

**Fix**:
1. Go to MongoDB Atlas → Network Access
2. Add IP or use `0.0.0.0/0` for development

---

### Error: Connection timeout (Android)

**Cause**: Wrong API URL

**Check** `frontend/constants/index.ts`:
```typescript
// ❌ Wrong
'http://localhost:3000'  // Doesn't work on Android
'https://10.0.2.2:3000'  // Wrong protocol

// ✅ Correct
Platform.OS === 'android'
  ? 'http://10.0.2.2:3000'
  : 'http://localhost:3000'
```

---

### Error: "invalid token" or "jwt malformed"

**Possible causes**:
1. Token expired (check expiry: 7 days)
2. Wrong JWT_SECRET between frontend/backend
3. Token not stored properly

**Debug**:
```typescript
// Add to socket.tsx after token retrieval
console.log('Token length:', token?.length);
console.log('Token starts with:', token?.substring(0, 20));
```

**Fix**:
1. Logout and login again (fresh token)
2. Verify JWT_SECRET in backend `.env`
3. Check AsyncStorage is working

---

## Pre-flight Checklist

### Backend
- [ ] MongoDB Atlas connected (IP whitelisted)
- [ ] `.env` file has `JWT_SECRET`
- [ ] Server running on port 3000
- [ ] See "Socket.IO server initialized" log

### Frontend
- [ ] Logged in successfully
- [ ] Token stored in AsyncStorage (`@auth_token`)
- [ ] API_URL configured for your platform
- [ ] No HTTPS in development URLs

---

## Testing Commands

### Get your IP
```bash
curl -4 ifconfig.me
```

### Check backend is running
```bash
curl http://localhost:3000
# Should return: "Server is running"
```

### Restart backend
```bash
cd backend && npm start
```

### Restart frontend
```bash
cd frontend && npm start
```

### Clear AsyncStorage (for testing)
```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';
await AsyncStorage.clear();
```

---

## Verification Steps

### 1. Verify Storage Keys Match
```bash
# Check storage service
grep "TOKEN_KEY" frontend/src/services/storage.service.ts
# Should show: const TOKEN_KEY = '@auth_token';

# Check socket usage
grep "getItem" frontend/src/socket/socket.tsx
# Should show: AsyncStorage.getItem('@auth_token')
```

### 2. Verify JWT Structure
```bash
# Check token generation
grep -A 2 "generateToken" backend/controllers/auth.controller.ts
# Should show: jwt.sign({ userId }, ...)

# Check socket auth
grep -A 5 "jwt.verify" backend/socket/socket.ts
# Should show: as { userId: string }
```

### 3. Test Socket Event
```typescript
// In your frontend code
const socket = getSocket();
socket?.emit('testSocket', { test: true });

socket?.on('testSocket', (data) => {
  console.log('Test response:', data);
  // Should log: { msg: "It's working!!!" }
});
```

---

## Environment Check

### Backend .env
```env
PORT=3000
JWT_SECRET=your-secret-key-here
MONGODB_URI=mongodb+srv://...
```

### Frontend Constants
```typescript
// constants/index.ts
export const API_URL = Platform.OS === 'android'
  ? 'http://10.0.2.2:3000'
  : 'http://localhost:3000';
```

---

## Log Patterns to Look For

### Success Pattern
```
Frontend:
🔌 → 🔑 Token found ✅ → 🌐 Connecting → Socket connected → ✅

Backend:
🔐 Authentication → ✅ Socket authenticated → user connected
```

### Failure Pattern - No Token
```
Frontend:
🔌 → 🔑 No token ❌ → ❌ Socket connection failed

Backend:
(no logs - connection rejected before reaching server)
```

### Failure Pattern - Invalid Token
```
Frontend:
🔌 → 🔑 Token found ✅ → 🌐 Connecting → ❌ Socket connection failed

Backend:
🔐 Authentication → ❌ Authentication failed: invalid token
```

### Failure Pattern - DB Error
```
Frontend:
🔌 → 🔑 Token found ✅ → 🌐 Connecting → ❌ Socket connection failed

Backend:
🔐 Authentication → ❌ Authentication failed: user not found
```

---

## File Reference

| Issue | File to Check |
|-------|---------------|
| Storage keys | `frontend/src/services/storage.service.ts:4` |
| Socket token retrieval | `frontend/src/socket/socket.tsx:9` |
| API URL | `frontend/constants/index.ts:4` |
| JWT generation | `backend/controllers/auth.controller.ts:7-10` |
| Socket auth | `backend/socket/socket.ts:18-50` |
| User model | `backend/modals/User.ts` |

---

## Still Not Working?

1. **Check all logs** - Frontend AND Backend
2. **Restart both servers** - Changes may not hot-reload
3. **Clear AsyncStorage** - Old token might be invalid
4. **Check MongoDB connection** - Backend must connect to DB
5. **Verify platform** - Android needs special URL
6. **Read full docs** - See `SOCKET_CONNECTION.md`

---

**Last Updated**: 2026-05-11
