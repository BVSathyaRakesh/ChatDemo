# Testing Guide

## Current Status

⚠️ **Testing is currently disabled** in this project.

**Why?**
- This project uses **React 19** with the **New Architecture** (Fabric) enabled
- React Native testing libraries (`@testing-library/react-native`, `jest-expo`) don't yet fully support React 19
- To maintain the new architecture benefits, we've chosen to wait for testing library updates

**Timeline:**
- React 19 support is actively being worked on by the testing library maintainers
- Expected to be fully supported in Q2-Q3 2025

## Current Setup

**React Version:** 19.1.0
**New Architecture:** ✅ Enabled
**React Compiler:** ✅ Enabled

This configuration provides:
- Better performance with the new architecture
- Automatic optimizations from React Compiler
- Full compatibility with Expo Go

## Alternative Testing Approaches (Until React 19 Support)

### 1. Manual Testing
Test your app manually in Expo Go or simulators:
- Form validation
- Navigation flows
- User interactions
- Error handling

### 2. E2E Testing with Maestro
Maestro works with any React Native version:

```bash
# Install Maestro
curl -Ls "https://get.maestro.mobile.dev" | bash

# Create a test flow
maestro test flow.yaml
```

**Example flow.yaml:**
```yaml
appId: com.yourapp.dilmessenger
---
- launchApp
- tapOn: "Email"
- inputText: "test@example.com"
- tapOn: "Password"
- inputText: "password123"
- tapOn: "Login"
- assertVisible: "Messages"
```

### 3. Detox (E2E Testing)
Detox supports React Native apps:

```bash
npm install --save-dev detox
```

### 4. Component Testing in Isolation
Test components visually with Storybook:

```bash
npx -p @storybook/cli sb init --type react_native
```

## When Jest Testing Becomes Available

Once React 19 support is ready, you can add testing back:

### Step 1: Install Dependencies

```bash
npm install --save-dev jest jest-expo @testing-library/react-native react-test-renderer@19.1.0 @types/jest
```

### Step 2: Add Jest Configuration

**jest.config.js:**
```javascript
module.exports = {
  preset: 'jest-expo',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|react-navigation|@react-navigation/.*)'
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^@/src/(.*)$': '<rootDir>/src/$1',
  },
};
```

**jest.setup.js:**
```javascript
// Mock expo-image
jest.mock('expo-image', () => ({
  Image: 'Image',
}));

// Mock expo-router
jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
  useLocalSearchParams: jest.fn(),
}));
```

### Step 3: Add Test Scripts

**package.json:**
```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

### Step 4: Create Test Files

```tsx
// src/screens/__tests__/login.screen.test.tsx
import { render, fireEvent } from '@testing-library/react-native';
import { LoginScreen } from '../login.screen';

describe('LoginScreen', () => {
  it('renders correctly', () => {
    const { getByText } = render(<LoginScreen />);
    expect(getByText('Sign in to Diligent One Platform')).toBeTruthy();
  });
});
```

## Test Examples (For Future Reference)

### Testing Form Validation

```tsx
import { render, fireEvent } from '@testing-library/react-native';
import { LoginScreen } from '../login.screen';
import { useRouter } from 'expo-router';

jest.mock('expo-router');

describe('LoginScreen Validation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows error when username is empty', async () => {
    const { getByText, findByText } = render(<LoginScreen />);

    fireEvent.press(getByText('Login'));

    const error = await findByText('UserName is Required');
    expect(error).toBeTruthy();
  });

  it('navigates on successful login', async () => {
    const mockReplace = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ replace: mockReplace });

    const { getByText, getByPlaceholderText } = render(<LoginScreen />);

    fireEvent.changeText(getByPlaceholderText('Enter email'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('Enter password'), 'password123');
    fireEvent.press(getByText('Login'));

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith('/(tabs)');
    });
  });
});
```

### Testing Navigation

```tsx
import { useRouter } from 'expo-router';

jest.mock('expo-router');

describe('Navigation', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
      replace: jest.fn(),
      back: jest.fn(),
    });
  });

  it('navigates to chat screen', () => {
    const { getByText } = render(<ChatList />);
    fireEvent.press(getByText('John Doe'));
    expect(mockPush).toHaveBeenCalledWith('/chat/123');
  });
});
```

## Tracking React 19 Testing Support

Monitor these repositories for React 19 support:

- [React Native Testing Library](https://github.com/callstack/react-native-testing-library)
- [jest-expo](https://github.com/expo/expo/tree/main/packages/jest-expo)

When they announce React 19 support, you can follow the steps above to add testing back to this project.

## Benefits of Current Approach

By keeping React 19 and the new architecture:

✅ **Better Performance** - Fabric renderer is faster
✅ **Automatic Optimizations** - React Compiler reduces re-renders
✅ **Future-Proof** - Using the latest React features
✅ **Expo Go Compatible** - No custom builds needed for development
✅ **Production Ready** - New architecture is stable and recommended

The trade-off of waiting for testing support is worth the performance and developer experience improvements.

## Resources

- [React Native New Architecture](https://reactnative.dev/docs/the-new-architecture/landing-page)
- [Expo Go with New Architecture](https://docs.expo.dev/guides/new-architecture/)
- [React Compiler](https://react.dev/learn/react-compiler)
- [Maestro E2E Testing](https://maestro.mobile.dev/)
- [Detox E2E Testing](https://wix.github.io/Detox/)

## Compatible Versions

### ✅ Current Working Setup (React 18)

```json
{
  "dependencies": {
    "react": "18.2.0",
    "react-dom": "18.2.0",
    "react-native": "0.81.5"
  },
  "devDependencies": {
    "@testing-library/react-native": "^12.4.3",
    "@types/jest": "^29.5.12",
    "@types/react": "~18.2.0",
    "jest": "^29.7.0",
    "jest-expo": "~54.0.0",
    "react-test-renderer": "18.2.0"
  }
}
```

**Important:** React and react-test-renderer versions MUST match exactly (both 18.2.0).

### ⚠️ React 19 Note

React 19 is not yet fully supported by React Native testing libraries. The project was downgraded to React 18.2.0 for stable testing. When React Native Testing Library adds full React 19 support, you can upgrade back.

## Setup

### 1. Install Dependencies

```bash
npm install --legacy-peer-deps
```

**Note:** The `--legacy-peer-deps` flag is required due to version conflicts between packages.

Testing dependencies installed:
- `jest` - Testing framework
- `jest-expo` - Jest preset for Expo projects (handles most React Native mocking)
- `@testing-library/react-native` - Testing utilities for React Native
- `react-test-renderer` - React renderer for tests

### 2. Configuration Files

The following files are configured for testing:

- **`jest.config.js`** - Jest configuration (uses `jest-expo` preset)
- **`jest.setup.js`** - Global test setup (mocks expo-router and expo-image)
- **`babel.config.js`** - Babel configuration for transforming JSX/TypeScript

### 3. Jest Configuration

**`jest.config.js`**
```javascript
module.exports = {
  preset: 'jest-expo',  // Handles React Native mocking automatically
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|react-navigation|@react-navigation/.*)'
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^@/src/(.*)$': '<rootDir>/src/$1',
  },
};
```

**`jest.setup.js`**
```javascript
// Mock expo-image
jest.mock('expo-image', () => ({
  Image: 'Image',
}));

// Mock expo-router
jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
  useLocalSearchParams: jest.fn(),
}));
```

## Running Tests

### Run all tests
```bash
npm test
```

**Example output:**
```
PASS src/screens/__tests__/login.screen.test.tsx
  LoginScreen
    ✓ renders correctly (1517 ms)
    ✓ updates username input when text is entered (8 ms)
    ✓ updates password input when text is entered (5 ms)
    ✓ shows error when username is empty (14 ms)
    ✓ shows error when password is empty (4 ms)
    ✓ shows both errors when both fields are empty (3 ms)
    ✓ navigates to tabs when login is successful (3 ms)
    ✓ clears errors when user starts typing (3 ms)
    ✓ has correct input types (2 ms)

Test Suites: 1 passed, 1 total
Tests:       9 passed, 9 total
```

### Run tests in watch mode (auto-runs on file changes)
```bash
npm run test:watch
```

### Run tests with coverage report
```bash
npm run test:coverage
```

## Test Structure

Tests are located alongside the components they test in `__tests__` folders:

```
src/
  screens/
    __tests__/
      login.screen.test.tsx
    login.screen.tsx
```

## LoginScreen Test Cases

The login screen test suite (`src/screens/__tests__/login.screen.test.tsx`) covers **9 test cases**:

### 1. **Rendering Tests**
- ✓ Renders all UI elements correctly (title, inputs, buttons)
  - Verifies "Sign in to Diligent One Platform" title
  - Verifies email and password input fields
  - Verifies Login and ForgotPassword buttons

### 2. **Input Handling Tests**
- ✓ Updates username input when text is entered
- ✓ Updates password input when text is entered
- ✓ Correct input types (email keyboard, secure password entry)
  - Email input: `autoCapitalize="none"`, `keyboardType="email-address"`
  - Password input: `secureTextEntry={true}`, `autoCapitalize="none"`

### 3. **Validation Tests**
- ✓ Shows error when username is empty and login is pressed
  - Error message: "UserName is Required"
- ✓ Shows error when password is empty and login is pressed
  - Error message: "Password is Required"
- ✓ Shows both errors when both fields are empty
- ✓ Clears errors when user starts typing
  - Tests that errors disappear after user input

### 4. **Navigation Tests**
- ✓ Navigates to tabs screen on successful login
  - Mocks `useRouter().replace()` and verifies it's called with `'/(tabs)'`

## Writing New Tests

### Basic Test Template

```tsx
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { YourScreen } from '../your.screen';

// Mock expo-router if screen uses navigation
jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
  useLocalSearchParams: jest.fn(),
}));

describe('YourScreen', () => {
  // Clear mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    const { getByText } = render(<YourScreen />);
    expect(getByText('Screen Title')).toBeTruthy();
  });

  it('handles button press', () => {
    const { getByText } = render(<YourScreen />);
    const button = getByText('Click Me');

    fireEvent.press(button);

    expect(getByText('Success Message')).toBeTruthy();
  });

  it('handles async operations', async () => {
    const { getByText, findByText } = render(<YourScreen />);

    fireEvent.press(getByText('Submit'));

    // Wait for async operation
    const successMessage = await findByText('Data Loaded');
    expect(successMessage).toBeTruthy();
  });
});
```

### Example: Testing Form Validation

```tsx
import { render, fireEvent } from '@testing-library/react-native';
import { LoginScreen } from '../login.screen';
import { useRouter } from 'expo-router';

jest.mock('expo-router');

describe('LoginScreen Validation', () => {
  const mockReplace = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      replace: mockReplace,
    });
  });

  it('shows error when username is empty', async () => {
    const { getByText, findByText } = render(<LoginScreen />);

    fireEvent.press(getByText('Login'));

    const error = await findByText('UserName is Required');
    expect(error).toBeTruthy();
  });

  it('navigates on successful validation', async () => {
    const { getByText, getByPlaceholderText } = render(<LoginScreen />);

    fireEvent.changeText(getByPlaceholderText('Enter email'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('Enter password'), 'password123');
    fireEvent.press(getByText('Login'));

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith('/(tabs)');
    });
  });
});
```

### Common Testing Utilities

```tsx
// Rendering
const { getByText, getByPlaceholderText, queryByText } = render(<Component />);

// Finding elements
getByText('Button Text')          // Throws if not found
queryByText('Maybe Text')         // Returns null if not found
await findByText('Async Text')    // Waits for element

// Interacting
fireEvent.changeText(input, 'new value')
fireEvent.press(button)

// Assertions
expect(element).toBeTruthy()
expect(mockFn).toHaveBeenCalledWith(arg)
expect(element.props.value).toBe('expected')
```

## Mocking

### Mock Expo Router (Navigation)

**In jest.setup.js (global mock):**
```tsx
jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
  useLocalSearchParams: jest.fn(),
}));
```

**In test file (with mock implementation):**
```tsx
import { useRouter } from 'expo-router';

jest.mock('expo-router');

describe('MyScreen', () => {
  const mockPush = jest.fn();
  const mockReplace = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
      replace: mockReplace,
      back: jest.fn(),
    });
  });

  it('navigates on button press', () => {
    const { getByText } = render(<MyScreen />);
    fireEvent.press(getByText('Next'));
    expect(mockPush).toHaveBeenCalledWith('/next-screen');
  });
});
```

### Mock Route Parameters

```tsx
import { useLocalSearchParams } from 'expo-router';

jest.mock('expo-router');

beforeEach(() => {
  (useLocalSearchParams as jest.Mock).mockReturnValue({
    id: '123',
    name: 'Test',
  });
});
```

### Mock Expo Image

```tsx
jest.mock('expo-image', () => ({
  Image: 'Image',
}));
```

### Mock Custom Services

```tsx
// Mock a data service
jest.mock('@/src/services/mock-data.service', () => ({
  getConversations: jest.fn(() => [
    { id: '1', name: 'Test User' }
  ]),
  getMessages: jest.fn(() => []),
}));
```

### Mock AsyncStorage

```tsx
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(() => Promise.resolve()),
  getItem: jest.fn(() => Promise.resolve(null)),
  removeItem: jest.fn(() => Promise.resolve()),
  clear: jest.fn(() => Promise.resolve()),
}));
```

## Best Practices

1. **Test user behavior, not implementation**
   - Focus on what users see and do
   - Avoid testing internal state directly

2. **Use meaningful test descriptions**
   - Describe what the test validates
   - Use "should" or action-based naming

3. **Arrange-Act-Assert pattern**
   ```tsx
   // Arrange: Set up test data
   const { getByText } = render(<Component />);

   // Act: Perform actions
   fireEvent.press(getByText('Submit'));

   // Assert: Verify results
   expect(mockFn).toHaveBeenCalled();
   ```

4. **Clean up after tests**
   ```tsx
   beforeEach(() => {
     jest.clearAllMocks();
   });
   ```

5. **Test edge cases**
   - Empty inputs
   - Invalid data
   - Error states
   - Loading states

## Troubleshooting

### Issue: `npm install` fails with peer dependency errors

**Error:**
```
npm error ERESOLVE unable to resolve dependency tree
```

**Solution:** Use `--legacy-peer-deps` flag:
```bash
npm install --legacy-peer-deps
```

This is required due to version conflicts between React 18 and some Expo packages that expect React 19.

### Issue: Tests fail with "Cannot find module 'expo-modules-core'"

**Solution:** Ensure `jest-expo` version matches your Expo SDK version:
- Expo SDK 54 → `jest-expo@~54.0.0`
- Expo SDK 51 → `jest-expo@~51.0.0`

### Issue: Tests fail with "react-test-renderer version mismatch"

**Solution:** Ensure React and react-test-renderer versions match exactly:
```json
{
  "react": "18.2.0",
  "react-test-renderer": "18.2.0"
}
```

### Issue: Module not found for `@/src/...` imports

**Solution:** Check `moduleNameMapper` in `jest.config.js`:
```javascript
moduleNameMapper: {
  '^@/(.*)$': '<rootDir>/$1',
  '^@/src/(.*)$': '<rootDir>/src/$1',
}
```

### Issue: expo-router mock not working

**Solution:** Make sure mocks are set up in `jest.setup.js` (runs before tests) and clear mocks in `beforeEach`:
```tsx
beforeEach(() => {
  jest.clearAllMocks();
  (useRouter as jest.Mock).mockReturnValue({
    replace: jest.fn(),
  });
});
```

### Issue: Timeout errors with async operations

**Solution:** Use `waitFor` or `findBy` queries for async operations:
```tsx
// Option 1: findBy (returns a promise)
const element = await findByText('Success');
expect(element).toBeTruthy();

// Option 2: waitFor
await waitFor(() => {
  expect(getByText('Success')).toBeTruthy();
});
```

### Issue: "Invariant Violation" or native module errors

**Solution:** `jest-expo` preset handles most React Native mocking automatically. If you encounter specific native module errors, add explicit mocks in `jest.setup.js`.

### Issue: Tests pass but you want to see console.logs

**Solution:** Run tests with `--verbose` flag:
```bash
npm test -- --verbose
```

### Issue: Watchman warnings

**Warning:**
```
watchman warning: Recrawled this watch
```

**Solution:** Clear watchman cache:
```bash
watchman watch-del '/path/to/project'
watchman watch-project '/path/to/project'
```

## Coverage

View coverage report after running `npm run test:coverage`:

```
coverage/
  lcov-report/
    index.html  # Open in browser for detailed report
```

**View in browser:**
```bash
open coverage/lcov-report/index.html
```

Target coverage goals:
- Statements: > 80%
- Branches: > 75%
- Functions: > 80%
- Lines: > 80%

## Testing Specific Components

### Testing Screens with Navigation

Screens using `useRouter()` need the expo-router mock:

```tsx
import { useRouter } from 'expo-router';

jest.mock('expo-router');

describe('MyScreen', () => {
  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: jest.fn(),
      replace: jest.fn(),
      back: jest.fn(),
    });
  });

  // tests...
});
```

### Testing Screens with Route Parameters

Screens using `useLocalSearchParams()`:

```tsx
import { useLocalSearchParams } from 'expo-router';

jest.mock('expo-router');

beforeEach(() => {
  (useLocalSearchParams as jest.Mock).mockReturnValue({
    id: '123',
  });
});
```

### Testing Components with Images

The `expo-image` component is globally mocked in `jest.setup.js`. For components using images from `require()`, no additional setup is needed.

### Testing Form Validation

See `src/screens/__tests__/login.screen.test.tsx` for a complete example of testing:
- Empty field validation
- Error message display
- Form submission
- Input clearing

## Quick Reference

### Common Test Commands

```bash
# Run all tests
npm test

# Run specific test file
npm test login.screen.test

# Run tests in watch mode
npm run test:watch

# Run with coverage
npm run test:coverage

# Update snapshots (if using snapshot testing)
npm test -- -u

# Run tests with verbose output
npm test -- --verbose
```

### Common Test Patterns

**Testing a button press:**
```tsx
const button = getByText('Submit');
fireEvent.press(button);
```

**Testing input change:**
```tsx
const input = getByPlaceholderText('Enter text');
fireEvent.changeText(input, 'new value');
expect(input.props.value).toBe('new value');
```

**Testing async state changes:**
```tsx
fireEvent.press(getByText('Load Data'));
const result = await findByText('Data Loaded');
expect(result).toBeTruthy();
```

**Testing navigation:**
```tsx
const mockReplace = jest.fn();
(useRouter as jest.Mock).mockReturnValue({ replace: mockReplace });

fireEvent.press(getByText('Next'));
expect(mockReplace).toHaveBeenCalledWith('/next-screen');
```

**Testing error messages:**
```tsx
fireEvent.press(getByText('Submit'));
const error = await findByText('Error message');
expect(error).toBeTruthy();
```

## Project-Specific Notes

### Current Test Status

✅ **All tests passing** (9/9)
- LoginScreen: 9 test cases covering rendering, validation, and navigation

### Test Files Location

```
src/
  screens/
    __tests__/
      login.screen.test.tsx    ✅ 9 tests passing
    login.screen.tsx
```

### Adding Tests for New Screens

1. Create `__tests__` folder in the same directory as your screen
2. Create `your-screen.test.tsx`
3. Follow the pattern from `login.screen.test.tsx`
4. Mock any dependencies (expo-router, services, etc.)
5. Run `npm test` to verify

### React Version Note

This project uses **React 18.2.0** (downgraded from React 19) for testing stability. React 19 support in React Native Testing Library is still maturing. The app runs normally with React 18, and you can upgrade to React 19 when testing libraries catch up.

## Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Native Testing Library](https://callstack.github.io/react-native-testing-library/)
- [jest-expo Documentation](https://docs.expo.dev/develop/unit-testing/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
