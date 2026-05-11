# Dil Messenger

A React Native messenger app built with Expo Router. Minimal starting point ready for development.

## Current State

**✅ Implemented:**
- Splash screen with animated logo
- Welcome screen with animations
- Login screen with form validation
- Register screen with form validation
- Auth flow navigation
- Reusable components (ScreenWrapper, Typo, Button)
- React 19 with New Architecture enabled
- Safe area handling
- Responsive scaling utilities

**🔨 Ready to Build:**
- Post-authentication screens (home, chat, etc.)
- Backend integration
- State management

## Project Structure

```
app/
├── _layout.tsx           # Root navigation setup (screenOptions: headerShown: false)
├── index.tsx             # Splash screen (auto-navigates to welcome after 2s)
└── (auth)/               # Auth group (no _layout needed, inherits from root)
    ├── welcome.tsx       # Welcome screen route
    ├── login.tsx         # Login route
    └── register.tsx      # Register route

src/
├── components/
│   ├── screen-wrapper.tsx  # Background wrapper with SafeAreaView
│   ├── Typo.tsx            # Typography component with responsive scaling
│   ├── Button.tsx          # Custom button with TouchableOpacity
│   └── index.ts            # Component exports
├── screens/
│   ├── login.screen.tsx    # Login screen logic
│   └── register.screen.tsx # Register screen logic
├── types/
│   └── index.ts            # TypeScript interfaces
└── utils/
    └── styling.ts          # Responsive scaling utilities (verticalScale, horizontalScale, moderateScale)

constants/
└── theme.ts              # Colors and spacing constants

assets/
└── images/
    ├── splashImage.png   # Splash screen logo
    ├── welcome.png       # Welcome screen image
    └── bgPattern.png     # Background pattern for screens
```

## Navigation

### Current Flow
```
Splash (2s auto-delay)
  ↓
Welcome (Get Started button)
  ↓
Login ⟷ Register
```

### Navigation Patterns

**File-based routing with Expo Router:**

1. **Route files** in `app/` directory define the navigation structure
2. **Screen components** in `src/screens/` contain the actual logic
3. **Route files import and render screen components**

**Example:**
```tsx
// app/(auth)/login.tsx
import { LoginScreen } from '@/src/screens/login.screen';

export default function LoginPage() {
  return <LoginScreen />;
}
```

### Navigation Usage

**Navigate between screens:**
```tsx
import { useRouter } from 'expo-router';

const router = useRouter();

// Navigate forward
router.push('/(auth)/login');
router.push('/(auth)/register');

// Replace (no back button)
router.replace('/(auth)/welcome');

// Go back
router.back();
```

### Auth Group Routes

All authentication-related screens are in the `(auth)` group:
- `/(auth)/welcome` - Welcome screen
- `/(auth)/login` - Login screen
- `/(auth)/register` - Register screen

**Groups (folders with parentheses):**
- Organize routes without affecting the URL structure
- Automatically detected by Expo Router
- No need for explicit Stack.Screen declarations in root layout
- Inherit screenOptions from parent layout (in this case: `headerShown: false`)

### Adding New Routes

1. Create screen component: `src/screens/home.screen.tsx`
2. Create route file: `app/home.tsx`
3. Import and render:
```tsx
import { HomeScreen } from '@/src/screens/home.screen';
export default function HomePage() {
  return <HomeScreen />;
}
```
4. Navigate: `router.push('/home')`

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Development Tips

- Use `@/src/...` for imports from the `src/` directory
- Use `@/...` for imports from root-level directories
- Keep route files minimal - they should only import and render screen components
- All business logic and UI should be in `src/screens/` and `src/components/`
- Use responsive scaling utilities from `@/utils/styling` for consistent sizing across devices
- Set `screenOptions={{ headerShown: false }}` at root Stack level to hide headers globally
- Groups with parentheses `(group)` don't need explicit Stack.Screen declarations

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
