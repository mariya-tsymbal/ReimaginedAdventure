- In all interactions and commit messages, be extremely concise and sacrifice grammar for the same of concision.

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Purpose

Take-home interview exercise: a mobile **Product Browser + Cart** app powered by a hosted JSON feed derived from the Shopify Storefront API. The evaluator cares about judgment, production-level thinking, and communication of tradeoffs — not just working code.

## Core Requirements

### 1. Product Catalog
- List all available products
- Tap to navigate to product details

### 2. Product Details & Variant Selection
- Show all product details
- Support variant selection (size, color, etc.)
- Add selected variant to cart

### 3. Cart Management
- Display line items
- Increase quantity of existing variants
- Show subtotal, total price, and total item count

### 4. Offline / Caching / Resilience
- Browse most recently loaded catalog when offline
- Cart persists across app restarts
- Handle slow/unavailable network gracefully

### UX Quality Bar
Loading, empty, and error states on every screen. Touch-friendly, accessible (VoiceOver/TalkBack), adapts to common device sizes. Reference: the Shop app.

## Technical Constraints (non-negotiable)
- Pure React Native — no Expo
- TypeScript required throughout
- Type-safe navigation
- Predictable, testable state management
- Local persistence required
- **No external UI component libraries**
- Basic unit tests required

## Deliverables (alongside code)
- README with setup instructions, env vars, architecture diagram, tradeoffs
- Decision Log (1–2 pages): how AI was used, what was changed/rejected, key tradeoffs, what would be improved with more time

## Commands

```bash
npm start              # Start Metro bundler
npm run ios            # Build and run on iOS simulator
npm run android        # Build and run on Android emulator
npm test               # Run Jest tests
npm run lint           # Run ESLint
```

Run a single test file:
```bash
npx jest __tests__/App.test.tsx
```

### iOS Setup (first time or after adding native deps)
```bash
bundle install
bundle exec pod install --project-directory=ios
```

## Architecture

This is a React Native 0.85.3 app using the **New Architecture** (Fabric renderer) with TypeScript.

**Entry points:**
- `index.js` — registers the root component via `AppRegistry`
- `App.tsx` — root React component
- `ios/ReimaginedAdventure/AppDelegate.swift` — iOS native entry; loads JS from Metro in dev, `main.jsbundle` in release
- `android/app/src/main/java/com/reimaginedadventure/MainApplication.kt` — Android native entry with `ReactHost` setup

**Platform native code** lives under `ios/` (Swift/CocoaPods) and `android/` (Kotlin/Gradle). Native dependencies added via npm must be followed by `pod install` on iOS and a Gradle sync on Android.

**Styling** uses React Native's `StyleSheet` API (no CSS). Dark mode detected via `useColorScheme()`.

**Testing** uses Jest with `@react-native/jest-preset`.

## Plans

- At the end of each plan, give me a list of unresolved questions to answer, if any. Make the questions extremely concise.Sacrifice grammar for the sake of concision.
