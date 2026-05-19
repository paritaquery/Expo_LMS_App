# Mini LMS App

A senior-level React Native Expo application that demonstrates a production-minded architecture, persistent state management, optimized course browsing, WebView integration, offline resilience, and notifications.

## 🚀 Features
- **Authentication**: Offline-first session persistence using `expo-secure-store`.
- **Course Catalog**: Highly optimized virtualized list (`@legendapp/list`) with debounced search, fast image caching, and pull-to-refresh.
- **Learning Experience**: Interactive `WebView` component for rendering HTML-based course lessons, complete with robust error handling and header-based payload handoffs.
- **Offline Resilience**: App-wide connectivity monitoring via `expo-network` with offline banners and resilient local caching.
- **Personalization**: User profile with profile picture upload (`expo-image-picker`), bookmarks, and persistent UI preferences (Theme, Notifications).
- **Error Handling**: A custom Expo Router `ErrorBoundary` to elegantly capture and recover from crashes.

---

## 🏗️ Architecture Decisions

The app strictly adheres to a domain-driven architectural structure to separate concerns and maximize scalability:

- **Presentation Layer (`app/` & `src/components/`)**: Thin UI components. Uses Expo Router for file-based navigation.
- **Feature Modules (`src/features/*/`)**: Isolated feature logic (auth, courses, profile). Each module owns its specific components, hooks, and localized state.
- **Service/API Layer (`src/services/`)**: Centralized data-fetching, interceptors, and local storage abstractions.
- **Global State (`src/store/`)**: `Zustand` used for lightweight client-side state (Auth status, Network status) and `React Query` used for async cache management.

### Folder Structure
```text
├── app/               # Expo Router pages (Presentation Layer)
│   ├── (auth)/        # Unauthenticated routes (Login, Register)
│   ├── (app)/         # Authenticated routes (Tabs, Courses, Profile)
│   └── _layout.tsx    # Root layout with Error Boundary & Providers
├── src/               # Application Source
│   ├── components/    # Shared UI building blocks (feedback, layout)
│   ├── features/      # Feature modules (auth, courses, profile)
│   ├── hooks/         # Shared React hooks
│   ├── providers/     # React Context / Query Providers
│   ├── services/      # Storage wrappers and API clients
│   ├── store/         # Zustand global stores
│   ├── types/         # TypeScript interfaces and models
│   └── utils/         # Helper functions
└── package.json
```

---

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v18+)
- npm or yarn
- Expo CLI or Expo Go app on your phone.

### Installation

1. **Clone the repository and install dependencies**:
   ```bash
   npm install --legacy-peer-deps
   ```

2. **Start the Expo Development Server**:
   ```bash
   npm start
   ```

3. **Run on a Device/Emulator**:
   - Press `a` to run on an Android emulator.
   - Press `i` to run on an iOS simulator.
   - Scan the QR code using the **Expo Go** app on your physical device.

---

## ⚙️ Environment Variables
*(If your application connects to a live backend in the future, create a `.env` file at the root. Currently, the app utilizes local dummy APIs to demonstrate functionality.)*

```env
EXPO_PUBLIC_API_URL=https://dummyjson.com/products
```

---

## 📦 Build Instructions

To build the app into a standalone APK (Android) or IPA (iOS) using EAS (Expo Application Services):

1. **Install EAS CLI**:
   ```bash
   npm install -g eas-cli
   ```

2. **Login to your Expo account**:
   ```bash
   eas login
   ```

3. **Build for Android (APK for direct installation)**:
   ```bash
   eas build -p android --profile preview
   ```

4. **Build for iOS**:
   ```bash
   eas build -p ios
   ```

---

## 🧪 Testing

The project includes unit and component tests using `jest` and `@testing-library/react-native`.

To run the test suite:
```bash
npm run test
```

To run TypeScript compiler checks:
```bash
npm run lint
```

---

## ⚠️ Known Limitations
- **Notifications**: Local notifications are configured, but testing them reliably requires an actual development build (`eas build`), as Expo Go restricts certain background push notification features.
- **WebView Caching**: Because the WebView uses local HTML string injection, offline functionality for the *webview content itself* is somewhat limited compared to fully native views.
- **Mock Data**: The app currently mocks backend APIs using placeholder services. Enrolling in courses and saving preferences are strictly persisted on-device.
