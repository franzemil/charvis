# Charvis

Department and house registration app built with Expo + Firebase.

## Prerequisites

- Node.js 18+
- Yarn
- Android Studio (for Android build)
- Firebase project with:
  - Authentication → Google Sign-In enabled
  - Cloud Firestore created (test mode)

## Setup

### 1. Install dependencies

```bash
yarn install
```

### 2. Configure Firebase

1. Go to [Firebase Console](https://console.firebase.google.com) → Project Settings → General
2. **Android**: Download `google-services.json` and place it in the project root
3. **iOS** (if building for iOS): Download `GoogleService-Info.plist` and place it in the project root

### 3. Add SHA-1 fingerprint (Android)

Run the signing report to get your debug SHA-1:

```bash
npx expo run:android # generates the debug keystore first time
cd android && ./gradlew signingReport
```

Copy the **SHA-1** from the `debug` variant and add it in:
Firebase Console → Project Settings → General → **Add fingerprint**

### 4. Generate native projects

```bash
npx expo prebuild --clean
```

### 5. Run the app

```bash
npx expo run:android
```

## Scripts

| Command | Description |
|---|---|
| `yarn start` | Start Expo dev server |
| `yarn android` | Build and run on Android |
| `yarn ios` | Build and run on iOS |
| `yarn format` | Format code with Prettier |
| `yarn format:check` | Check formatting without writing |

## Tech Stack

- **Framework**: Expo 55 + React Native 0.83
- **Routing**: Expo Router (file-based)
- **Auth**: Firebase Auth + Google Sign-In
- **Database**: Cloud Firestore
- **State**: TanStack React Query
- **Styling**: NativeWind (Tailwind CSS)
- **Formatting**: Prettier
