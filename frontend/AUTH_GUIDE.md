# Authentication Implementation Guide

## ✅ What's Been Set Up

Your app now has a complete authentication system with:
- JWT token handling
- Local storage persistence (AsyncStorage)
- Token expiration checking
- Automatic token injection in API requests
- Login/Register/Logout functionality

## 📁 Files Created

1. **`src/contexts/AuthContext.tsx`** - Main authentication context
2. **`src/types/auth.types.ts`** - TypeScript types for auth
3. **`src/config/api.config.ts`** - API configuration
4. **`app/_layout.tsx`** - Updated with AuthProvider wrapper
5. **`src/screens/login.screen.tsx`** - Updated with auth integration

## 🔧 Configuration

### Update API URL for Android/Physical Device

Edit `src/config/api.config.ts`:

```typescript
// For iOS Simulator: http://localhost:3000
// For Android Emulator: http://10.0.2.2:3000
// For Physical Device: http://YOUR_LOCAL_IP:3000

export const API_BASE_URL = __DEV__
  ? 'http://10.0.2.2:3000/api'  // Android emulator
  : 'https://your-production-api.com/api';
```

### Get Your Local IP (for testing on physical device):
```bash
# macOS/Linux
ifconfig | grep "inet " | grep -v 127.0.0.1

# Windows
ipconfig | findstr IPv4
```

## 🚀 How to Use

### 1. Use Auth Hook in Any Component

```tsx
import { useAuth } from '@/src/contexts/AuthContext';

export function MyScreen() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  return (
    <View>
      {isAuthenticated ? (
        <>
          <Text>Welcome, {user?.name || user?.email}!</Text>
          <Button title="Logout" onPress={logout} />
        </>
      ) : (
        <Text>Please login</Text>
      )}
    </View>
  );
}
```

### 2. Protected Routes Example

Create a protected route wrapper:

```tsx
// src/components/ProtectedRoute.tsx
import { useAuth } from '@/src/contexts/AuthContext';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/(auth)/login');
    }
  }, [isAuthenticated, isLoading]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return isAuthenticated ? children : null;
}
```

Use it in your screens:

```tsx
// app/(tabs)/_layout.tsx or any protected screen
import { ProtectedRoute } from '@/src/components/ProtectedRoute';

export default function TabsLayout() {
  return (
    <ProtectedRoute>
      <Tabs>
        {/* Your tabs */}
      </Tabs>
    </ProtectedRoute>
  );
}
```

### 3. Register Screen Example

Update your register screen similarly:

```tsx
import { useAuth } from '@/src/contexts/AuthContext';
import { useState } from 'react';

export function RegisterScreen() {
  const { register } = useAuth();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async () => {
    setLoading(true);
    try {
      await register({
        email: email.current,
        password: password.current,
        name: name.current,
      });
      router.replace('/(tabs)'); // Navigate to main app
    } catch (error) {
      Alert.alert('Registration Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      title={loading ? "Creating account..." : "Sign Up"}
      onPress={handleRegister}
      disabled={loading}
    />
  );
}
```

### 4. Making Authenticated API Calls

The token is automatically added to all axios requests:

```tsx
import axios from 'axios';
import { API_BASE_URL } from '@/src/config/api.config';

// Just make the request - token is automatically included!
const getMessages = async () => {
  const response = await axios.get(`${API_BASE_URL}/messages`);
  return response.data;
};
```

### 5. Accessing User Data

```tsx
import { useAuth } from '@/src/contexts/AuthContext';

export function ProfileScreen() {
  const { user, logout } = useAuth();

  return (
    <View>
      <Text>Email: {user?.email}</Text>
      <Text>Name: {user?.name}</Text>
      <Image source={{ uri: user?.avatar || 'default-avatar.png' }} />
      <Button title="Logout" onPress={logout} />
    </View>
  );
}
```

## 🔐 Auth Context API

### Properties:
- `user: User | null` - Current user data
- `token: string | null` - JWT token
- `isLoading: boolean` - Loading state (checking stored auth)
- `isAuthenticated: boolean` - True if user is logged in

### Methods:
- `login(credentials: LoginCredentials): Promise<void>`
- `register(credentials: RegisterCredentials): Promise<void>`
- `logout(): Promise<void>`

## 🧪 Testing

### Test Login:
1. Start your backend: `cd backend && npm run dev`
2. Start your frontend: `cd frontend && npm start`
3. Register a new user
4. Login with credentials
5. Token is stored automatically

### Check AsyncStorage (React Native Debugger):
```javascript
import AsyncStorage from '@react-native-async-storage/async-storage';

// Check stored data
AsyncStorage.getItem('@auth_token').then(console.log);
AsyncStorage.getItem('@auth_user').then(console.log);
```

## 🛡️ Security Features

✅ **JWT token decoding** - User data extracted from token
✅ **Token expiration checking** - Auto-logout on expired tokens
✅ **Secure storage** - AsyncStorage for persistence
✅ **Password hashing** - Bcrypt on backend
✅ **Automatic token injection** - Axios interceptor
✅ **Error handling** - Proper error messages

## 🚨 Common Issues

### Android: Network Request Failed
- Change API URL to `http://10.0.2.2:3000/api` in `api.config.ts`
- Enable clear text traffic in `android/app/src/main/AndroidManifest.xml`:
```xml
<application
  android:usesCleartextTraffic="true"
  ...>
```

### iOS: Network Request Failed
- Use `http://localhost:3000/api` for simulator
- For physical device, use your computer's local IP

### Token Not Persisting
- Check AsyncStorage permissions
- Verify token is being saved in AuthContext
- Check React Native Debugger console for errors

## 📝 Next Steps

1. ✅ Update register screen to use `register()` function
2. ✅ Create protected routes for authenticated screens
3. ✅ Add loading states during authentication
4. ✅ Implement forgot password flow
5. ✅ Add user profile update functionality
6. ✅ Connect to Socket.io for real-time features

## 🔗 Backend Endpoints

Your backend is already configured with:
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

Token format in headers: `Authorization: Bearer <token>`

## 💡 Tips

- Always check `isLoading` before checking `isAuthenticated`
- Use `router.replace()` instead of `router.push()` after login to prevent back navigation
- Handle errors gracefully with try-catch blocks
- Store minimal user data - fetch full profile when needed
- Logout automatically redirects to login screen
