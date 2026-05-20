# Changelog - May 16, 2026

## 📱 Profile Screen Updates

### Android Back Button
- **Added**: Conditional back button for Android devices only
- **Location**: `frontend/src/screens/profile.screen.tsx`
- **Implementation**: `showBackButton={Platform.OS === 'android'}`

### Keyboard Handling
- **Fixed**: Auto-scroll when tapping input fields
- **Added**: `KeyboardAvoidingView` with proper positioning
- **Added**: Auto-scroll to name field on focus (20px offset)
- **Implementation**: `scrollToField()` function with `measureLayout` and `scrollTo`

### Field Styling
- **Updated**: Name field background color to lighter gray (`colors.neutral200`)
- **Updated**: Email field background color (`colors.neutral300` - disabled state)

### Loading State
- **Added**: Spinner during profile update
- **Replaced**: Inline `ActivityIndicator` with reusable `Loader` component
- **Shows**: Loading spinner in place of buttons during update

---

## 👤 Avatar System Overhaul

### Default Avatar Images
- **Removed**: InitialsAvatar component (replaced with actual images)
- **Added**: Support for default avatar images
- **Implementation**:
  - User avatar: `assets/images/defaultAvatar.png`
  - Group avatar: `assets/images/defaultGroupAvatar.png`
- **Logic**: Uses `getAvatarPath()` and `getGroupAvatarPath()` utilities

### Avatar Component Updates
- **File**: `frontend/src/components/Avatar.tsx`
- **Added**: `isGroup` prop to distinguish user vs group avatars
- **Updated**: Avatar type definitions in `avatar.types.ts`
- **Behavior**:
  - Shows remote image if valid HTTP/HTTPS URL
  - Shows default user avatar if no image
  - Shows default group avatar if group type

### Profile Avatar Upload
- **Status**: Disabled with informative message
- **Message**: Explains cloud storage requirement (AWS S3, Cloudinary, etc.)
- **Note**: Avatar currently generated from user initials until cloud storage implemented

---

## 🔐 Authentication & Backend

### User Response Formatting
- **Created**: `backend/utils/userResponse.ts`
- **Added**: `formatUserResponse()` helper function
- **Added**: `UserResponseProps` type (UserProps without password)
- **Updated**: All auth endpoints to use centralized formatter
  - Login endpoint
  - Register endpoint
  - Profile update (socket)
  - New GET /api/auth/me endpoint

### New API Endpoint
- **Route**: `GET /api/auth/me`
- **Purpose**: Fetch current user data from server
- **Authentication**: Protected with JWT middleware
- **Created**: `backend/middleware/auth.middleware.ts`
- **Returns**: Fresh user data from database

### Auth Context Updates
- **File**: `frontend/src/contexts/AuthContext.tsx`
- **Added**: `refreshUser()` function
- **Purpose**: Sync user data from server (cross-device consistency)
- **Usage**: Called on profile screen mount
- **Added**: `updateAuth()` function for profile updates
- **Updated**: Type definitions in `auth.types.ts`

### Socket Improvements
- **Fixed**: Event name mismatches
  - Frontend emits: `"Update Profile"`
  - Backend listens: `"Update Profile"`
  - Backend emits: `"updateProfile"`
  - Frontend listens: `"updateProfile"`
- **Updated**: `frontend/src/socket/socketEvents.tsx`
- **Improved**: Error handling and logging
- **Added**: Connection timeout (10 seconds)
- **Added**: Transport fallback (websocket → polling)
- **Better**: JWT error messages (expired, invalid, missing)

### Backend Validation
- **Updated**: Avatar field default from `""` to `null`
- **Added**: URL validation for avatar uploads
- **Accepts**: Only HTTP/HTTPS URLs (filters local file paths)
- **Updated**: Mongoose options (deprecated `new: true` → `returnDocument: 'after'`)

---

## 🏠 Home Screen Enhancements

### Import Fix
- **Fixed**: HomeScreen import error
- **Changed**: Default import → Named export
- **File**: `app/(main)/home.tsx`

### Tab Bar Styling
- **Updated**: Tab shape to pill/capsule design
- **Border radius**: Increased to 25 (rounded pills)
- **Padding**: Increased for better proportions (8 vertical, 20 horizontal)
- **Spacing**: Added gap between tabs (`spacingX._10`)
- **Active tab**:
  - Background: `colors.primaryLight` (softer yellow)
  - Border: `colors.primary`
- **Inactive tab**:
  - Background: `colors.neutral200` (light gray)
  - Border: `colors.neutral300`

### Loading State
- **Added**: `isLoading` state
- **Shows**: `<Loader text="Loading conversations..." />` during data fetch

### Empty States
- **Added**: Friendly messages when no conversations exist
- **Direct Messages empty**:
  - Icon: Chat bubble
  - Message: "No direct messages yet"
  - Subtext: "Start a conversation to see it here"
- **Groups empty**:
  - Icon: Users icon
  - Message: "No groups yet"
  - Subtext: "Create or join a group to get started"

### Floating Action Button
- **Added**: Yellow circular button with plus icon
- **Position**: Bottom-right corner (fixed position)
- **Styling**:
  - Size: 60×60px
  - Background: Primary yellow
  - Shadow/elevation for depth
  - Z-index: 999 (stays on top)
- **Icon**: Plus icon (28px, dark color)
- **Action**: Navigates to new conversation modal
- **Location**: Outside ScrollView, inside content container

### Conversation List Fixes
- **Fixed**: Filter bug (used `=` instead of `===`)
- **Fixed**: Sort bug (used same variable for both dates)
- **Corrected**: Proper filtering for direct vs group conversations

---

## 🎨 UI Components

### Loader Component (NEW)
- **Created**: `frontend/src/components/Loader.tsx`
- **Purpose**: Reusable loading spinner
- **Props**:
  - `size`: 'small' | 'large' (default: 'large')
  - `color`: string (default: `colors.primary`)
  - `text`: optional loading message
  - `style`: custom container styling
- **Usage**: Profile screen, home screen (replacing all ActivityIndicator usage)
- **Exported**: Added to `components/index.ts`

### Button Component Updates
- **Enhanced**: Now supports children (icons, custom content)
- **File**: `frontend/src/components/Button.tsx`
- **Added**: `children?: ReactNode` prop
- **Made**: `title` prop optional
- **Logic**: Renders children if provided, otherwise renders title text
- **Backward compatible**: All existing button usage still works

### ConversationItem Component
- **Added**: Last message preview
- **Added**: "Say hi" placeholder when no messages
- **Added**: Image indicator for attachments
- **Fixed**: Row spacing with `flex: 1` and `space-between`
- **Updated**: Timestamp styling (size 13, gray color)
- **Updated**: Name on left, timestamp on right
- **Added**: Message preview (truncated to 1 line)
- **Updated**: Divider color to lighter gray (`colors.neutral200`)
- **Added**: Proper padding (left: 20, right: 10)

---

## 🛠️ Utilities

### Date Formatting (NEW)
- **Created**: `frontend/src/utils/dateFormat.ts`
- **Function**: `formatMessageTime(dateString: string): string`
- **Smart formatting**:
  - Today: "2:45 PM" (time)
  - Yesterday: "Yesterday"
  - This week: "Mon", "Tue", etc. (day abbreviation)
  - Older: "Jun 20" (month + day, no year)
- **Usage**: Applied to conversation timestamps
- **Exported**: Added to `utils/index.ts`

### Avatar Path Utilities (UPDATED)
- **Updated**: `getAvatarPath()` to handle null values properly
- **Enhanced**: Validation for HTTP/HTTPS URLs
- **Maintains**: Support for local preview during development
- **Returns**: Default avatar for empty/invalid URLs

---

## 🐛 Bug Fixes

### Profile Screen
- ✅ Fixed keyboard not showing input field
- ✅ Fixed scroll position when tapping name field
- ✅ Fixed loading state UI (replaced buttons with spinner)
- ✅ Fixed socket event name mismatches

### Home Screen
- ✅ Fixed conversation filtering (direct vs groups)
- ✅ Fixed sorting by date
- ✅ Fixed floating button positioning
- ✅ Fixed plus icon not showing (Button component children support)
- ✅ Fixed import error (default vs named export)

### Avatar System
- ✅ Fixed empty string avatars showing blank
- ✅ Fixed simulator file paths not working cross-device
- ✅ Fixed missing default avatars

### Backend
- ✅ Fixed deprecated Mongoose options warning
- ✅ Fixed socket authentication error messages
- ✅ Fixed user response including password field

---

## 📦 New Files Created

### Frontend
- `src/components/Loader.tsx` - Reusable loading spinner
- `src/components/InitialsAvatar.tsx` - (Created then removed, replaced with images)
- `src/utils/dateFormat.ts` - Date formatting utilities

### Backend
- `backend/utils/jwt.ts` - JWT token generation
- `backend/utils/userResponse.ts` - User response formatting
- `backend/middleware/auth.middleware.ts` - JWT authentication middleware
- `backend/controllers/auth.controller.ts` - Added getCurrentUser function
- `backend/routes/auth.routes.ts` - Added GET /api/auth/me route

---

## 🔄 Modified Files

### Frontend
- `src/screens/profile.screen.tsx` - Major updates (back button, keyboard, loading, scroll)
- `src/screens/home.screen.tsx` - Tab styling, empty states, floating button, loader
- `src/components/Avatar.tsx` - Complete rewrite (default images, group support)
- `src/components/Button.tsx` - Added children support
- `src/components/ConversationItem.tsx` - Layout fixes, date formatting, divider color
- `src/components/InputField.tsx` - Added containerStyle prop
- `src/contexts/AuthContext.tsx` - Added refreshUser and updateAuth functions
- `src/socket/socketEvents.tsx` - Fixed event names
- `src/socket/socket.tsx` - Improved error handling
- `src/types/avatar.types.ts` - Added isGroup prop
- `src/types/auth.types.ts` - Added updateAuth and refreshUser to context
- `src/utils/getAvatarPath.ts` - Enhanced validation
- `src/utils/index.ts` - Exported new utilities
- `src/components/index.ts` - Exported Loader component
- `app/(main)/home.tsx` - Fixed import (default → named)

### Backend
- `socket/userEvents.ts` - Fixed event names, added user response, URL validation
- `socket/socket.ts` - Improved error messages
- `controllers/auth.controller.ts` - Added getCurrentUser, using formatUserResponse
- `routes/auth.routes.ts` - Added GET /me route
- `modals/User.ts` - Changed avatar default to null
- `types.ts` - Added UserResponseProps type

---

## 📊 Summary Statistics

- **New Components**: 1 (Loader)
- **Enhanced Components**: 4 (Avatar, Button, ConversationItem, InputField)
- **New API Endpoints**: 1 (GET /api/auth/me)
- **New Utilities**: 2 (dateFormat, userResponse)
- **New Middleware**: 1 (auth.middleware)
- **Bug Fixes**: 12
- **Files Created**: 6
- **Files Modified**: 20+

---

## 🎯 Key Improvements

1. **Better UX**: Loading states, empty states, smooth scrolling
2. **Code Reusability**: Loader component, formatUserResponse utility
3. **Cross-Device Sync**: refreshUser functionality, proper avatar handling
4. **Better Design**: Modern tabs, proper spacing, lighter colors
5. **Error Handling**: Improved socket errors, better validation
6. **Type Safety**: Better TypeScript types throughout
7. **Performance**: Optimized rendering, proper event cleanup
8. **Maintainability**: Centralized utilities, cleaner code structure

---

## 🚀 Ready for Next Steps

1. **Cloud Storage**: Avatar upload with AWS S3/Cloudinary/Firebase
2. **Conversations**: Implement actual chat functionality
3. **Real-time Updates**: Socket events for new messages
4. **Notifications**: Push notifications for new messages
5. **User Search**: Find and add contacts
6. **Group Management**: Create, edit, delete groups

---

## 📝 Notes

- All changes tested on iOS and Android
- Maintained backward compatibility where possible
- Followed existing code patterns and conventions
- Used TypeScript for type safety
- Responsive design with proper scaling utilities
- Clean code with proper separation of concerns

---

**Date**: May 16, 2026
**Session Duration**: Full day development session
**Focus Areas**: Profile management, Avatar system, Home screen, Authentication flow, UI/UX improvements
