# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A React Native messenger app built with Expo Router, React 19, and New Architecture enabled.

**Current State:** Complete authentication flow with splash screen, welcome screen, login, and register screens. Includes reusable component library (ScreenWrapper, Typo, Button) with responsive scaling utilities.

## Development Commands

```bash
# Start development server
npm start

# Platform-specific builds
npm run ios
npm run android
npm run web

# Linting
npm run lint
```

After starting, press `i` for iOS simulator, `a` for Android emulator, or scan QR for physical device.

## Architecture

### Project Structure

The project uses two separate directory structures:

1. **`app/`** - Expo Router file-based routing
   - `app/_layout.tsx` - Root navigation with `screenOptions={{ headerShown: false }}`
   - `app/index.tsx` - Splash screen (auto-navigates to welcome after 2s)
   - `app/(auth)/welcome.tsx` - Welcome screen route
   - `app/(auth)/login.tsx` - Login route
   - `app/(auth)/register.tsx` - Register route

2. **`src/`** - Business logic and components
   - `src/components/` - Reusable UI components (ScreenWrapper, Typo, Button)
   - `src/screens/` - Screen components (login.screen.tsx, register.screen.tsx)
   - `src/types/` - TypeScript interfaces
   - `src/utils/` - Helper functions (responsive scaling utilities)
   - `constants/` - Theme constants (colors, spacing)

### Import Path Convention

- Use `@/src/...` for imports from the `src/` directory
- Use `@/...` for imports from root-level directories (app/, hooks/, constants/)
- Example: `import { ChatListScreen } from '@/src/screens/chat-list.screen'`

### Navigation Pattern

The app uses Expo Router (file-based routing):

**Current Navigation Flow:**
```
Splash (2s auto-delay) → Welcome → Login ⟷ Register
```

**Auth Group (`(auth)`):**
- Groups with parentheses organize routes without affecting URLs
- Automatically detected by Expo Router (no explicit Stack.Screen needed)
- Inherit settings from parent layout (headerShown: false)

**Navigation Hooks:**
```tsx
import { useRouter } from 'expo-router';

const router = useRouter();
router.push('/(auth)/login');     // Navigate to login
router.push('/(auth)/register');  // Navigate to register
router.replace('/(auth)/welcome');// Replace (no back button)
router.back();                    // Go back
```

**Adding New Routes:**
1. Create screen component in `src/screens/` (e.g., `src/screens/home.screen.tsx`)
2. Create route file in `app/` (e.g., `app/home.tsx`)
3. Import and render in route file:
```tsx
// app/home.tsx
import { HomeScreen } from '@/src/screens/home.screen';
export default function HomePage() {
  return <HomeScreen />;
}
```
4. Navigate: `router.push('/home')`

## Current Project State

### ✅ What Exists

**Screens:**
- **Splash screen** (`app/index.tsx`) - Animated logo, auto-navigates to welcome
- **Welcome screen** (`app/(auth)/welcome.tsx`) - Animated welcome with "Get Started" button
- **Login screen** (`src/screens/login.screen.tsx`) - Email/password with validation
- **Register screen** (`src/screens/register.screen.tsx`) - Email/password/confirm with validation

**Reusable Components:**
- **ScreenWrapper** (`src/components/screen-wrapper.tsx`) - Background pattern with SafeAreaView
- **Typo** (`src/components/Typo.tsx`) - Typography component with responsive scaling
- **Button** (`src/components/Button.tsx`) - Custom button with TouchableOpacity

**Utilities:**
- **Responsive scaling** (`src/utils/styling.ts`) - verticalScale, horizontalScale, moderateScale
- **Theme constants** (`constants/theme.ts`) - Colors and spacing

**Tech Stack:**
- React 19.1.0 with New Architecture enabled
- React Compiler enabled
- react-native-reanimated for animations (FadeInDown, springify)
- react-native-safe-area-context for safe area handling
- expo-image for optimized images

### 🔨 Start Building From Here
- Post-authentication screens (home, chat, profile, etc.)
- Backend integration / authentication logic
- State management (Context API or library)
- Chat functionality
- Real-time messaging

## How to Build Features

### 1. Add a new screen
```bash
# Create the screen component
touch src/screens/home.screen.tsx

# Create the route
touch app/home.tsx
```

Screen component pattern:
```tsx
// src/screens/home.screen.tsx
import { ScreenWrapper, Typo, Button } from '@/src/components';
import { colors } from '@/constants/theme';
import { useRouter } from 'expo-router';

export function HomeScreen() {
  const router = useRouter();

  return (
    <ScreenWrapper>
      <Typo color={colors.white} size={24} fontWeight="700">
        Home Screen
      </Typo>
    </ScreenWrapper>
  );
}
```

Route file pattern:
```tsx
// app/home.tsx
import { HomeScreen } from '@/src/screens/home.screen';

export default function HomePage() {
  return <HomeScreen />;
}
```

### 2. Navigate from login to new screen
```tsx
// In src/screens/login.screen.tsx
const handleLogin = () => {
  if(validateForm()){
    router.replace('/home');  // Replace to prevent back navigation
  }
};
```

### 3. Using reusable components

**ScreenWrapper:** Background pattern + safe area handling
```tsx
<ScreenWrapper>
  {/* Your content */}
</ScreenWrapper>
```

**Typo:** Responsive typography
```tsx
<Typo
  size={18}              // Font size (automatically scaled)
  color={colors.white}   // Text color
  fontWeight="600"       // Font weight
>
  Your Text
</Typo>
```

**Button:** Custom styled button
```tsx
<Button
  title="Click Me"
  onPress={handlePress}
  style={customStyle}    // Optional custom styling
  disabled={false}       // Optional disabled state
/>
```

### 4. Responsive scaling
Use utilities from `@/utils/styling`:
```tsx
import { verticalScale, horizontalScale, moderateScale } from '@/utils/styling';

const styles = StyleSheet.create({
  container: {
    paddingVertical: verticalScale(20),
    paddingHorizontal: horizontalScale(16),
    fontSize: moderateScale(14),
  },
});
```

### 5. Important patterns
- **Route files:** Keep minimal, only import and render screen components
- **Screen components:** All logic and UI goes here
- **Import paths:** Use `@/src/...` for src imports, `@/...` for root imports
- **Navigation:** Use `router.push()` for forward nav, `router.replace()` for no-back nav
- **Headers:** Set at root level with `screenOptions={{ headerShown: false }}`
