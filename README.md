# ReimaginedAdventure

A React Native **Product Browser + Cart** app powered by a Shopify Storefront API JSON feed. Browse products, select variants, manage a persistent cart — online or offline.

## Setup Instructions

### Prerequisites

- Node.js >= 22.11.0
- Ruby (for CocoaPods)
- Xcode 16+ (iOS)
- Android Studio + Android SDK (Android)
- Watchman (recommended)

Complete the [React Native environment setup](https://reactnative.dev/docs/set-up-your-environment) before proceeding.

### Install

```bash
git clone <repo-url> && cd ReimaginedAdventure
npm install

# iOS native deps
bundle install
bundle exec pod install --project-directory=ios
```

## Environment Variables

Copy the template and adjust as needed:

```bash
cp .env.template .env
# Then fill in the values in .env
```

| Variable | Description |
|----------|-------------|
| `PRODUCTS_API_URL` | Shopify product feed JSON endpoint |

Variables are injected at build time via `react-native-dotenv` and imported from `@env`. TypeScript types are declared in `src/types/env.d.ts`.

> **Note:** After changing `.env`, restart Metro with `--reset-cache`: `npm start -- --reset-cache`

## Running the App

```bash
npm start          # Start Metro bundler

# In a separate terminal:
npm run ios        # Build & run on iOS Simulator
npm run android    # Build & run on Android Emulator

npm test           # Run Jest tests
npm run lint       # Run ESLint
```

## Architecture

```
┌──────────────────────────────────────────────────────────┐
│                        App.tsx                           │
│  GestureHandlerRootView → SafeAreaProvider →             │
│  PersistQueryClientProvider → RootNavigator              │
└──────────────────────┬───────────────────────────────────┘
                       │
          ┌────────────┴────────────┐
          │      RootTabs           │
          │  (Bottom Tab Navigator) │
          └─────┬──────────┬────────┘
                │          │
     ┌──────────┴──┐   ┌──┴──────────┐
     │  HomeStack  │   │  CartScreen  │
     │ (Native     │   │             │
     │  Stack)     │   └─────────────┘
     └──┬─────┬────┘
        │     │
  ┌─────┴┐  ┌┴──────────────┐
  │List  │  │ProductDetail   │
  │Screen│  │Screen (PDP)    │
  └──────┘  └────────────────┘

  Data Flow
  ─────────
  Shopify JSON  ──→  fetch()  ──→  Zod validation  ──→  TanStack Query
       feed          (api/)        (api/schemas.ts)      (cache + offline)
                                                              │
                                            ┌─────────────────┤
                                            ▼                 ▼
                                       useProducts()     useProduct(id)
                                       (catalog list)    (PDP detail)
                                                              │
                                                              ▼
                                                     useVariantSelection()
                                                              │
                                                   ┌──────────┴──────────┐
                                                   ▼                     ▼
                                              Add to Cart           UI Components
                                                   │             (OptionSelector,
                                                   ▼              ImageCarousel,
                                             Zustand Store        StockBadge, etc.)
                                             (cartStore.ts)
                                                   │
                                                   ▼
                                              MMKV Persist
                                          (survives app kill)

  Offline Strategy
  ────────────────
  Query cache  ──→  MMKV (query-client)  ──→  Hydrate on cold start
  Cart state   ──→  MMKV (cart-storage)  ──→  Restore on cold start
```

### Key Layers

| Layer | Tech | Purpose |
|-------|------|---------|
| **Navigation** | React Navigation v7 (native stack + bottom tabs) | Type-safe screen routing |
| **Server state** | TanStack Query v5 + MMKV persister | Fetch, cache, offline hydration |
| **API validation** | Zod v3 (per-item `safeParse`) | Runtime schema validation; drops malformed products gracefully |
| **Client state** | Zustand + MMKV persist middleware | Cart management, survives app restarts |
| **Rendering** | FlashList | Performant list virtualization |
| **Styling** | React Native StyleSheet (no external UI libs) | Custom components throughout |

### Folder Structure

```
src/
  api/           products.ts (fetch + validate), schemas.ts (Zod)
  components/    LoadingView, ErrorView, EmptyView, icons/
  features/
    catalog/     ProductListScreen, ProductDetailScreen, ProductCard, hooks
    pdp/         ImageCarousel, OptionSelector, AddToCartButton, StockBadge,
                 VariantPriceDisplay, useVariantSelection
    cart/        CartScreen, CartLineItem, CartSummary, EmptyCart
  navigation/    RootNavigator, RootTabs, HomeStack
  store/         cartStore.ts (Zustand)
  types/         product.ts (Zod-inferred), cart.ts, navigation.ts
  utils/         constants, currency, mmkvPersister, queryClient, theme
```

## Notable Tradeoffs & Assumptions

### Zod validation: graceful drop vs strict parse
API responses are validated per-product with `safeParse`. Non-conforming products are dropped with a `console.warn` rather than failing the entire request. This prioritizes UX resilience over strictness — appropriate since we don't control the Shopify feed.

### Single endpoint, client-side filtering
The API returns all products in one response. PDP reuses the cached list (`useProduct` selects from the query cache) instead of making a second request. This avoids extra network calls but means the full catalog is always in memory. Acceptable for a small catalog; would need pagination for hundreds of products.

### Negative `quantityAvailable`
Shopify can return negative stock values (overselling). The app trusts `availableForSale` as the source of truth for purchasability, not `quantityAvailable`. Zod allows `z.number()` without `.min(0)` to reflect this.

### MMKV over AsyncStorage
MMKV is synchronous (JSI-based), making it faster for both query cache hydration and cart persistence. Tradeoff: requires native module linking and `pod install`.

### No external UI libraries
Per project constraints. All components (chips, badges, stepper, carousel) are built from scratch using `StyleSheet`, `Pressable`, and `ScrollView`.

### FlashList over FlatList
Better recycling and memory performance. Requires `estimatedItemSize` but worth it for smoother scrolling. Mocked as `FlatList` in tests.

### TanStack Query cache timing
- `staleTime: 5 min` — avoids refetching on every screen focus
- `gcTime: 24 hours` — keeps data available offline for a full day
- `retry: 2` — graceful retry on flaky networks

### Cart persistence
Zustand's `persist` middleware with MMKV storage. Cart survives app kills. No server-side cart — everything is local.

### Variant selection UX
Auto-selects first available variant on PDP mount. Out-of-stock variants are visually distinct but still visible (not hidden) so users can see the full product range.
