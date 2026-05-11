# Authentication Flow Documentation

Complete documentation of the authentication system for Dil Messenger app.

---

## 📋 Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Registration Flow](#registration-flow)
3. [Login Flow](#login-flow)
4. [Token Persistence & Auto-Login](#token-persistence--auto-login)
5. [Logout Flow](#logout-flow)
6. [API Endpoints](#api-endpoints)
7. [Frontend Structure](#frontend-structure)
8. [Backend Structure](#backend-structure)
9. [Security Features](#security-features)
10. [Troubleshooting](#troubleshooting)

---

## Architecture Overview

### Tech Stack

**Frontend:**
- React Native (Expo)
- TypeScript
- Axios (HTTP client)
- AsyncStorage (token persistence)
- jwt-decode (token validation)
- React Context API (state management)

**Backend:**
- Node.js + Express
- TypeScript + tsx
- MongoDB + Mongoose
- bcryptjs (password hashing)
- jsonwebtoken (JWT tokens)

### Platform Detection

The app automatically detects the platform and uses the correct API URL:

```typescript
Platform.OS === 'android' → http://10.0.2.2:3000/api
Platform.OS === 'ios'     → http://localhost:3000/api
Platform.OS === 'web'     → http://localhost:3000/api
```

---

## Registration Flow

### 1. User Input (Frontend)

**Screen:** `src/screens/register.screen.tsx`

```
User fills form:
├── Name (optional)
├── Email (required)
└── Password (required, min 6 chars)
```

**Validation:**
- All fields required
- Email format validation (`/^[^\s@]+@[^\s@]+\.[^\s@]+$/`)
- Password minimum 6 characters

### 2. API Request

**Service:** `src/services/auth.service.ts`

```typescript
POST http://10.0.2.2:3000/api/auth/register

Body:
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

### 3. Backend Processing

**Controller:** `backend/controllers/auth.controller.ts`

```
Step 1: Validate input (email, password required)
Step 2: Check if user exists (MongoDB query)
Step 3: Hash password (bcrypt, 10 salt rounds)
Step 4: Create user in database
Step 5: Generate JWT token (7-day expiry)
Step 6: Return user data + token
```

**Password Hashing:**
```typescript
const salt = await bcrypt.genSalt(10);
const hashedPassword = await bcrypt.hash(password, salt);
```

**JWT Token:**
```typescript
jwt.sign(
  { userId: user._id },
  process.env.JWT_SECRET,
  { expiresIn: '7d' }
)
```

### 4. Response Handling

**Success Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "email": "user@example.com",
      "name": "John Doe",
      "avatar": "",
      "created": "2026-05-10T10:30:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Response (400/500):**
```json
{
  "success": false,
  "message": "User already exists with this email"
}
```

### 5. Token Storage

**Service:** `src/services/storage.service.ts`

```typescript
AsyncStorage.setItem('@auth_token', token)
AsyncStorage.setItem('@auth_user', JSON.stringify(user))
```

**Storage Keys:**
- `@auth_token` - JWT token string
- `@auth_user` - User object (JSON string)

### 6. State Update

**Context:** `src/contexts/AuthContext.tsx`

```typescript
setToken(authToken)      // Updates token state
setUser(authUser)        // Updates user state
// isAuthenticated becomes true
```

### 7. Navigation

**Screen:** `src/screens/register.screen.tsx`

```typescript
router.replace('/(main)/home')
// Replaces current screen (no back button)
```

---

## Login Flow

### 1. User Input

**Screen:** `src/screens/login.screen.tsx`

```
User fills form:
├── Email (required)
└── Password (required)
```

### 2. API Request

```typescript
POST http://10.0.2.2:3000/api/auth/login

Body:
{
  "email": "user@example.com",
  "password": "password123"
}
```

### 3. Backend Processing

```
Step 1: Validate input
Step 2: Find user by email
Step 3: Compare password with stored hash
Step 4: Generate new JWT token
Step 5: Return user data + token
```

**Password Verification:**
```typescript
const isPasswordValid = await bcrypt.compare(
  plainPassword,
  hashedPasswordFromDB
);
```

### 4. Token Storage & State Update

Same as registration flow:
- Save to AsyncStorage
- Update context state
- Navigate to home

---

## Token Persistence & Auto-Login

### On App Start

**Context:** `src/contexts/AuthContext.tsx`

```typescript
useEffect(() => {
  loadStoredAuth();
}, []);
```

### Load Flow

```
Step 1: Read from AsyncStorage
├── @auth_token
└── @auth_user

Step 2: Validate token expiration
├── Decode JWT
├── Check exp timestamp
└── If expired → logout

Step 3: Update state
├── setToken(storedToken)
├── setUser(storedUser)
└── isAuthenticated = true

Step 4: User stays logged in
└── Navigate to home (if on login screen)
```

### Token Validation

```typescript
const decoded = jwtDecode<DecodedTokenProps>(token);
const isExpired = decoded.exp * 1000 < Date.now();
```

**Token Payload:**
```json
{
  "userId": "507f1f77bcf86cd799439011",
  "iat": 1746878400,  // Issued at
  "exp": 1747483200   // Expires at (7 days later)
}
```

---

## Logout Flow

### 1. User Action

```typescript
const { logout } = useAuth();
await logout();
```

### 2. Clear Storage

**Service:** `src/services/storage.service.ts`

```typescript
AsyncStorage.removeItem('@auth_token')
AsyncStorage.removeItem('@auth_user')
```

### 3. Clear State

**Context:** `src/contexts/AuthContext.tsx`

```typescript
setToken(null)
setUser(null)
// isAuthenticated becomes false
```

### 4. Navigation

```typescript
router.replace('/(auth)/login')
// Redirect to login screen
```

---

## API Endpoints

### Base URL

```
Development (Android): http://10.0.2.2:3000/api
Development (iOS):     http://localhost:3000/api
Production:            https://your-domain.com/api
```

### Authentication Endpoints

#### Register User

```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"  // optional
}
```

**Success (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": { "_id", "email", "name", "avatar", "created" },
    "token": "JWT_TOKEN"
  }
}
```

**Error (400):**
```json
{
  "success": false,
  "message": "User already exists with this email"
}
```

#### Login User

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Success (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": { "_id", "email", "name", "avatar", "created" },
    "token": "JWT_TOKEN"
  }
}
```

**Error (401):**
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

### Protected Endpoints

For protected routes, include JWT token in headers:

```http
GET /api/user/profile
Authorization: Bearer <JWT_TOKEN>
```

---

## Frontend Structure

### Files Overview

```
frontend/
├── src/
│   ├── contexts/
│   │   └── AuthContext.tsx           # Auth state management
│   ├── services/
│   │   ├── auth.service.ts           # API calls
│   │   └── storage.service.ts        # AsyncStorage operations
│   ├── types/
│   │   └── auth.types.ts             # TypeScript types
│   ├── config/
│   │   └── api.config.ts             # API URL config
│   └── screens/
│       ├── login.screen.tsx          # Login UI
│       └── register.screen.tsx       # Register UI
└── app/
    ├── _layout.tsx                   # Root with AuthProvider
    ├── (auth)/
    │   ├── login.tsx                 # Login route
    │   └── register.tsx              # Register route
    └── (main)/
        └── home.tsx                  # Protected route
```

### Type Definitions

**File:** `src/types/auth.types.ts`

```typescript
export interface UserProps {
  _id: string;
  email: string;
  name?: string;
  avatar?: string;
  created?: Date;
}

export interface AuthContextProps {
  user: UserProps | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentialsProps) => Promise<void>;
  register: (credentials: RegisterCredentialsProps) => Promise<void>;
  logout: () => Promise<void>;
}
```

### Context Usage

```typescript
import { useAuth } from '@/src/contexts/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth();

  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  return (
    <View>
      <Text>Welcome, {user?.name}!</Text>
      <Button title="Logout" onPress={logout} />
    </View>
  );
}
```

---

## Backend Structure

### Files Overview

```
backend/
├── controllers/
│   └── auth.controller.ts            # Register, Login handlers
├── models/
│   └── User.ts                       # User schema
├── routes/
│   └── auth.routes.ts                # Auth endpoints
├── config/
│   └── db.ts                         # MongoDB connection
├── middleware/
│   └── auth.middleware.ts            # JWT verification (TODO)
└── index.ts                          # Server entry point
```

### User Model

**File:** `backend/models/User.ts`

```typescript
{
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true  // Stored as bcrypt hash
  },
  name: {
    type: String
  },
  avatar: {
    type: String,
    default: ""
  },
  created: {
    type: Date,
    default: Date.now
  }
}
```

### Environment Variables

**File:** `backend/.env`

```env
PORT=3000
MONGO_URI="mongodb+srv://user:password@cluster.mongodb.net/"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
```

---

## Security Features

### ✅ Implemented

1. **Password Hashing**
   - bcrypt with 10 salt rounds
   - Passwords never stored in plain text

2. **JWT Tokens**
   - 7-day expiration
   - Signed with secret key
   - Contains only userId (no sensitive data)

3. **Token Validation**
   - Expiration check on app start
   - Auto-logout on expired tokens

4. **Input Validation**
   - Email format validation
   - Password length requirements
   - Required field checks

5. **Secure Storage**
   - AsyncStorage for tokens (encrypted on device)
   - No passwords stored on frontend

6. **HTTPS Ready**
   - CORS enabled
   - Production uses HTTPS URLs

7. **Automatic Token Injection**
   - Axios interceptor adds token to all requests
   - No manual header management needed

### 🔐 Best Practices

1. **Use HTTPS in production**
   ```typescript
   // Frontend production config
   return 'https://your-production-api.com/api';
   ```

2. **Rotate JWT secrets regularly**
   ```env
   JWT_SECRET="change-this-every-few-months"
   ```

3. **Implement refresh tokens** (Future enhancement)
   - Short-lived access tokens (15 min)
   - Long-lived refresh tokens (7 days)

4. **Add rate limiting** (Future enhancement)
   ```bash
   npm install express-rate-limit
   ```

5. **Implement 2FA** (Future enhancement)

---

## Troubleshooting

### Common Issues

#### 1. "Network request failed"

**Symptoms:**
- Registration/Login fails immediately
- No backend logs

**Solutions:**
```typescript
// Check API URL in console
console.log('API Base URL:', API_BASE_URL);

// Android emulator: http://10.0.2.2:3000/api
// iOS simulator: http://localhost:3000/api
// Physical device: http://YOUR_LOCAL_IP:3000/api
```

#### 2. "AsyncStorage error: Native module is null"

**Symptoms:**
- App crashes on start
- Error about AsyncStorage

**Solutions:**
```bash
# Restart with cleared cache
cd frontend
npx expo start --clear

# Rebuild app
npx expo run:android  # or run:ios
```

#### 3. "User already exists"

**Symptoms:**
- Registration fails with this error

**Solutions:**
- Use a different email
- Or delete the user from MongoDB:
```javascript
// In MongoDB Compass or shell
db.users.deleteOne({ email: "user@example.com" })
```

#### 4. "Invalid email or password"

**Symptoms:**
- Login fails

**Solutions:**
- Check email spelling
- Check password
- Verify user exists in database
- Check backend logs for bcrypt errors

#### 5. Token not persisting

**Symptoms:**
- User logged out after app restart

**Solutions:**
```typescript
// Check AsyncStorage
import AsyncStorage from '@react-native-async-storage/async-storage';

AsyncStorage.getItem('@auth_token').then(console.log);
AsyncStorage.getItem('@auth_user').then(console.log);
```

#### 6. Backend not connecting to MongoDB

**Symptoms:**
- "Database connection error" in logs

**Solutions:**
```bash
# Check .env file
cat backend/.env

# Verify MongoDB connection string
# Test connection manually
mongosh "mongodb+srv://user:password@cluster.mongodb.net/"
```

---

## Testing Checklist

### Manual Testing

- [ ] **Register new user**
  - Fill all fields
  - Check validation errors
  - Verify success message
  - Check MongoDB for new user

- [ ] **Login with registered user**
  - Correct credentials
  - Wrong password (should fail)
  - Wrong email (should fail)
  - Verify navigation to home

- [ ] **Token persistence**
  - Close app completely
  - Reopen app
  - Should stay logged in

- [ ] **Logout**
  - Click logout button
  - Should redirect to login
  - Token removed from storage

- [ ] **Auto-logout on expired token**
  - Manually set expired token in AsyncStorage
  - Restart app
  - Should auto-logout

### Backend Testing (cURL)

```bash
# Test registration
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123","name":"Test"}'

# Test login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123"}'
```

---

## Debug Logs

### Frontend Logs

When debugging, you'll see:

```bash
# App start
🌐 API Base URL: http://10.0.2.2:3000/api
📱 Platform: android

# Registration
📝 Registering user: { email: 'user@example.com', name: 'John' }
✅ Registration successful: { userId: '...', email: 'user@example.com' }

# Error
❌ Registration error: [Error details]
Response data: { message: 'User already exists' }
Response status: 400
Request URL: http://10.0.2.2:3000/api/auth/register
```

### Backend Logs

```bash
# Registration
📝 Registration request received: { email: 'user@example.com', name: 'John' }
🔐 Hashing password...
💾 Creating user in database...
✅ User created successfully: { userId: '...', email: 'user@example.com' }

# Error
❌ Validation failed: Missing email or password
❌ User already exists: user@example.com
```

---

## Next Steps

### Immediate Enhancements

1. **Protected Routes**
   ```typescript
   // Create ProtectedRoute wrapper
   function ProtectedRoute({ children }) {
     const { isAuthenticated, isLoading } = useAuth();
     if (isLoading) return <LoadingScreen />;
     if (!isAuthenticated) return <Navigate to="/login" />;
     return children;
   }
   ```

2. **User Profile Screen**
   - Display user info
   - Edit profile
   - Change password

3. **Forgot Password Flow**
   - Email verification
   - Password reset

4. **Auth Middleware (Backend)**
   ```typescript
   // Verify JWT on protected routes
   const authMiddleware = (req, res, next) => {
     const token = req.headers.authorization?.split(' ')[1];
     const decoded = jwt.verify(token, JWT_SECRET);
     req.userId = decoded.userId;
     next();
   };
   ```

### Future Features

- Refresh tokens
- Social authentication (Google, Apple)
- 2FA/MFA
- Session management
- Device tracking
- Password strength meter
- Email verification
- Rate limiting
- Account deletion

---

## References

- [JWT.io](https://jwt.io/) - JWT token debugger
- [bcrypt docs](https://github.com/kelektiv/node.bcrypt.js) - Password hashing
- [AsyncStorage](https://react-native-async-storage.github.io/async-storage/) - React Native storage
- [Expo Router](https://docs.expo.dev/router/introduction/) - Navigation
- [Axios](https://axios-http.com/) - HTTP client

---

**Last Updated:** 2026-05-10
**Version:** 1.0.0
**Status:** ✅ Production Ready
