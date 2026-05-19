# Mini LMS App Roadmap

## Goal
Build a senior-level React Native Expo Mini LMS app that demonstrates authentication, persistent state, optimized course browsing, WebView integration, notifications, offline resilience, and production-minded architecture.

## Delivery Strategy
We will build the app in clear phases so each stage leaves the project in a runnable, reviewable state.

## Phase 1: Project Foundation
1. Create a new Expo app with TypeScript.
2. Enable strict TypeScript settings.
3. Set up Expo Router folder structure.
4. Install core dependencies:
   - NativeWind
   - AsyncStorage
   - Expo SecureStore
   - React Query or equivalent async state layer
   - Zustand or equivalent global state solution
   - React Native WebView
   - Expo Notifications
   - Expo Network
   - Expo Image
   - Form and validation libraries
5. Configure NativeWind, Babel, Tailwind, path aliases, and environment variable handling.
6. Create a scalable folder structure for app, features, components, services, store, hooks, utils, types, and constants.
7. Status: Done

## Phase 2: App Architecture
1. Define the application architecture:
   - Presentation layer
   - Feature modules
   - Service/API layer
   - Persistent storage layer
   - Global state layer
2. Create shared TypeScript types for auth, user, course, bookmarks, preferences, and API responses.
3. Build a central API client with:
   - Base URL config
   - Request timeout
   - Retry logic
   - Error normalization
   - Auth header injection
4. Add storage wrappers:
   - SecureStore for tokens and sensitive auth state
   - AsyncStorage for bookmarks, preferences, and non-sensitive cache
5. Status: Done

## Phase 3: Authentication Flow
1. Create login screen.
2. Create register screen.
3. Integrate `/api/v1/users` endpoints.
4. Save tokens securely using Expo SecureStore.
5. Implement auto-login from persisted token.
6. Add logout flow and session cleanup.
7. Add basic token refresh handling.
8. Add loading, error, and empty states for auth screens.
9. Protect app routes based on authentication state.
10. Status: Done

## Phase 4: Main Navigation Shell
1. Create authenticated tab layout.
2. Add screens for:
   - Home/Courses
   - Bookmarks
   - Profile
3. Create shared header patterns, loaders, banners, and feedback components.
4. Add tab bar icons.
5. Prepare portrait and landscape friendly layouts.
6. Status: Done

## Phase 5: Course Catalog
1. Fetch instructors from `/api/v1/public/randomusers`.
2. Fetch courses from `/api/v1/public/randomproducts`.
3. Transform API data into LMS-friendly view models.
4. Create optimized course list using LegendList.
5. Add course card UI with:
   - Thumbnail
   - Title
   - Description
   - Instructor name
   - Bookmark toggle
6. Add pull-to-refresh.
7. Add debounced search/filter.
8. Memoize list items and expensive selectors.
9. Add loading skeletons and retry UI.
10. Status: Done

## Phase 6: Course Details and Enrollment
1. Build course details screen.
2. Show full course information and instructor info.
3. Implement bookmark toggle with persistent storage.
4. Implement enroll action with visual feedback.
5. Persist enrolled course state locally if backend support is limited.
6. Add user-facing confirmation and optimistic updates.
7. Status: Done

## Phase 7: WebView Content Viewer
1. Create a local HTML template for course content.
2. Build WebView screen to render course details/content.
3. Pass initial course data from native app to WebView.
4. Inject headers or script-based payload for native-to-web communication.
5. Handle WebView loading and failure states.
6. Add safe message handling if web-to-native communication is extended.
7. Persist enough state so the screen restores gracefully.
8. Status: Done

## Phase 8: Native Features
1. Request notification permissions responsibly.
2. Trigger a local notification when bookmarks reach 5 or more.
3. Add a reminder notification when the app has not been opened for 24 hours.
4. Add network status monitoring using Expo Network.
5. Show offline banner and disable/retry sensitive operations gracefully.
6. Prepare image handling and caching for smoother performance.
7. Status: Implemented
8. Remaining:
   - Validate notifications on development build (Expo Go limitation)

## Phase 9: Profile and User Management
1. Build profile screen using authenticated user data.
2. Display user details and computed stats:
   - Courses enrolled
   - Bookmarks count
   - Progress summary
3. Add profile picture update flow.
4. Add preferences section for local app settings.
5. Status: Done

## Phase 10: Error Handling and Resilience
1. Add app-level error boundary.
2. Normalize API errors into user-friendly messages.
3. Add retry actions for failed queries.
4. Add timeout handling for slow networks.
5. Build empty states and fallback states.
6. Ensure WebView failures surface clear recovery actions.
7. Status: Done

## Phase 11: Performance and Polish
1. Audit unnecessary re-renders.
2. Confirm proper key extraction and stable item identity.
3. Cache derived data where helpful.
4. Tune refresh behavior to avoid jank.
5. Improve accessibility labels, tap targets, and contrast.
6. Verify responsive behavior in portrait and landscape.
7. Status: Done

## Phase 12: Testing and Quality
1. Add unit tests for core utilities and state logic.
2. Add component tests for critical screens.
3. Test auth persistence, bookmarks, notifications, and offline behavior.
4. Run linting and type checks.
5. Remove debug logs and commented code.
6. Status: Done

## Phase 13: Documentation and Delivery
1. Write README with:
   - Setup steps
   - Environment variables
   - Architecture decisions
   - Folder structure
   - Build instructions
   - Known limitations
2. Capture screenshots of key screens.
3. Record demo video.
4. Prepare APK/dev build instructions.
5. Clean commit history and final QA pass.
6. Status: Done

## Suggested Build Order for Us
1. Foundation and architecture
2. Authentication flow
3. Navigation and shared shell
4. Course catalog and bookmarking
5. Course details and enrollment
6. WebView content viewer
7. Notifications and offline resilience
8. Profile completion (picture + preferences)
9. Error boundary and polish
10. Tests, docs, screenshots, demo, APK

## Definition of Done
The project is done when it:
- Runs on Expo with TypeScript strict mode
- Supports login/register/logout with persisted auth
- Shows optimized course browsing and search
- Persists bookmarks, enrollment, and preferences
- Includes WebView-based course content with failure handling
- Handles offline/error cases gracefully
- Supports notifications and profile management
- Includes documentation, screenshots, demo video, and build instructions
