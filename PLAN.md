# Plan: Product Browser + Cart App

## Context

Take-home interview exercise: implement a React Native product catalog + cart app
against a hosted Shopify-like JSON feed. User has pre-decided the tech stack. Goal
is production-quality code demonstrating judgment, testing, and offline resilience.

Each phase exits with: `npm test` passes, iOS + Android simulators build and run
with new functionality, `npx tsc --noEmit` = zero errors.

---

## Folder Layout

```
src/
  api/products.ts
  components/          # shared: LoadingView, ErrorView, EmptyView
  features/
    catalog/
      components/ProductCard.tsx
      hooks/useProducts.ts, useProduct.ts
      screens/ProductListScreen.tsx, ProductDetailScreen.tsx
    pdp/
      components/ImageCarousel, OptionSelector, AddToCartButton,
                 VariantPriceDisplay, StockBadge
      hooks/useVariantSelection.ts
    cart/
      components/CartLineItem, CartSummary, EmptyCart
      hooks/useCart.ts, useCartActions.ts
      screens/CartScreen.tsx
  navigation/HomeStack.tsx, RootTabs.tsx, RootNavigator.tsx
  store/cartStore.ts
  types/cart.ts, navigation.ts, product.ts
  utils/constants.ts, currency.ts, mmkvPersister.ts, queryClient.ts, theme.ts
__mocks__/
  react-native-mmkv.ts          # in-memory Map mock for Jest
  @shopify/flash-list.tsx       # re-export FlatList as FlashList for Jest
__tests__/
  utils/renderWithProviders.tsx
  features/catalog/, cart/, pdp/
  store/, utils/
```

---

## Phase 1 — Foundation + Navigation Skeleton

**Goal:** All deps installed, navigation wired (bottom tabs + native stack), both
simulators boot with empty screen stubs. No feature logic.

### Packages to install

```bash
npm install \
  @tanstack/react-query @tanstack/react-query-persist-client \
  @react-navigation/native @react-navigation/native-stack @react-navigation/bottom-tabs \
  react-native-gesture-handler react-native-screens \
  @shopify/flash-list \
  react-native-mmkv \
  zustand

npm install --save-dev \
  @testing-library/react-native

bundle exec pod install --project-directory=ios
```

Note: `@react-navigation/*`, `react-native-gesture-handler`, `react-native-screens`,
and `@shopify/flash-list` may already be in node_modules but not package.json —
install explicitly to record deps.

`react-native-mmkv` uses JSI/C++ TurboModule → must run `pod install` after install.
All packages have `codegenConfig` and are New Architecture compatible.

### Files to create/modify

| File | Action |
|------|--------|
| `App.tsx` | Replace boilerplate. Provider order: `GestureHandlerRootView` (flex:1) → `SafeAreaProvider` → `QueryClientProvider` → `RootNavigator` |
| `src/utils/queryClient.ts` | `new QueryClient({ defaultOptions: { queries: { staleTime: 5min, gcTime: 24h } } })` |
| `src/utils/mmkvPersister.ts` | MMKV instance + `Persister` interface impl + `persistQueryClient()` call |
| `src/types/product.ts` | Full interfaces: `ProductImage`, `MoneyV2`, `SelectedOption`, `ProductVariant`, `ProductOption`, `Product` |
| `src/types/cart.ts` | `CartLineItem`, `CartState` |
| `src/types/navigation.ts` | `RootTabParamList`, `HomeStackParamList` + global type augmentation |
| `src/navigation/HomeStack.tsx` | `createNativeStackNavigator<HomeStackParamList>` with `ProductList` + `ProductDetail` |
| `src/navigation/RootTabs.tsx` | `createBottomTabNavigator<RootTabParamList>` with Home (HomeStack) + Cart tabs |
| `src/navigation/RootNavigator.tsx` | `NavigationContainer` wrapping `RootTabs` |
| `src/features/catalog/screens/ProductListScreen.tsx` | Stub: `<Text>Product List</Text>` |
| `src/features/catalog/screens/ProductDetailScreen.tsx` | Stub: reads `route.params.productId` |
| `src/features/cart/screens/CartScreen.tsx` | Stub: `<Text>Cart</Text>` |
| `__mocks__/react-native-mmkv.ts` | In-memory Map mock |
| `jest.config.js` | Add `moduleNameMapper` + `transformIgnorePatterns` |

### Key gotchas

- `GestureHandlerRootView` is **required** outermost wrapper on New Architecture — missing it crashes Android.
- Global nav type: add `declare global { namespace ReactNavigation { interface RootParamList extends RootTabParamList {} } }` in `navigation.ts`.
- `persistQueryClient` must be called after `QueryClient` instantiation, before first query fires — call it inside `mmkvPersister.ts` export.
- MMKV cannot be required in Jest without mock → `moduleNameMapper: { 'react-native-mmkv': '<rootDir>/__mocks__/react-native-mmkv.ts' }`.
- `transformIgnorePatterns`: must include `react-navigation`, `flash-list`, `react-native-screens`, `react-native-safe-area-context`, `react-native-gesture-handler` for Jest transpilation.

### Verify

- `npm run ios` / `npm run android` → two tabs, tapping switches stubs, no red screen.
- `npm test` → passes.
- `npx tsc --noEmit` → 0 errors.

---

## Phase 2 — Product Catalog (API + List)

**Goal:** `ProductListScreen` fetches real data, renders with `FlashList`, handles
loading/error/empty, caches for offline, navigates to PDP.

### Files to create/modify

| File | Action |
|------|--------|
| `src/utils/constants.ts` | `PRODUCTS_API_URL` constant |
| `src/api/products.ts` | `fetchProducts(): Promise<Product[]>` using `fetch`; throws typed `ApiError` on non-2xx. Query key factory: `productKeys`. |
| `src/features/catalog/hooks/useProducts.ts` | `useQuery({ queryKey: productKeys.all, queryFn: fetchProducts })` |
| `src/features/catalog/components/ProductCard.tsx` | `Pressable` + `Image` + title + price range; `accessibilityRole="button"` |
| `src/components/LoadingView.tsx` | Centered `ActivityIndicator`; `accessibilityLiveRegion="polite"` |
| `src/components/ErrorView.tsx` | Error message + Retry `Pressable` |
| `src/components/EmptyView.tsx` | Empty message + subtext |
| `src/features/catalog/screens/ProductListScreen.tsx` | Replace stub: `useProducts()` → conditional render → `FlashList` with `estimatedItemSize={120}` |
| `src/utils/currency.ts` | `formatMoney(money: MoneyV2): string` using `Intl.NumberFormat` |
| `__mocks__/@shopify/flash-list.tsx` | Re-export `FlatList` as `FlashList` for Jest |
| `__tests__/features/catalog/ProductCard.test.tsx` | Render; assert title; assert accessibilityRole |
| `__tests__/features/catalog/useProducts.test.ts` | `renderHook` + mock fetch; loading→success |
| `__tests__/utils/renderWithProviders.tsx` | Helper wrapping `NavigationContainer` + `QueryClientProvider` + `SafeAreaProvider` + `GestureHandlerRootView` |

### Key gotchas

- `FlashList` requires `estimatedItemSize` or logs a warning. Use `120`.
- MMKV persister from Phase 1 makes offline work automatically — TanStack Query hydrates cache on cold start.
- `Pressable` should use `android_ripple` for Material feedback.
- `formatMoney`: price amounts in the API are strings (Shopify convention) — `parseFloat` before formatting.

### Verify

- Products render on first launch (online).
- Airplane mode + kill + relaunch → products still render from MMKV cache.
- Loading spinner on first cold launch.
- `npm test` passes; `npx tsc --noEmit` = 0 errors.

---

## Phase 3 — Product Detail Page + Variant Selection

**Goal:** Tapping a product opens PDP. Full details shown. Options selectable.
"Add to Cart" enabled only when a valid, available variant is selected.

### Files to create/modify

| File | Action |
|------|--------|
| `src/features/catalog/hooks/useProduct.ts` | `useQuery` with `select: products => products.find(p => p.id === id)` — reuses cached list, no extra request |
| `src/features/pdp/hooks/useVariantSelection.ts` | State: `selectedOptions: Record<string, string>`. Derived: `selectedVariant` via `useMemo`. Auto-selects first available variant on mount. Exports `selectOption`, `isComplete`. |
| `src/features/pdp/components/ImageCarousel.tsx` | Horizontal paginated `ScrollView` of `Image`s; `accessibilityLabel="Product image X of Y"` |
| `src/features/pdp/components/OptionSelector.tsx` | Chip row per option; selected chip highlighted; unavailable chips greyed + `accessibilityState={{ disabled: true }}` |
| `src/features/pdp/components/VariantPriceDisplay.tsx` | Current price + strikethrough `compareAtPrice` |
| `src/features/pdp/components/AddToCartButton.tsx` | `Pressable`; disabled until `isComplete` |
| `src/features/pdp/components/StockBadge.tsx` | "Out of Stock" / "Low Stock" conditional |
| `src/features/catalog/screens/ProductDetailScreen.tsx` | Replace stub: `useProduct(id)` → loading/error guard → scroll layout with sticky footer button |
| `__tests__/features/pdp/useVariantSelection.test.ts` | Full option selection → correct variant; partial → undefined |
| `__tests__/features/pdp/OptionSelector.test.tsx` | Render; press; assert callback |

### Key gotchas

- Sticky "Add to Cart" button: content in `ScrollView`, button outside in fixed footer with `SafeAreaView` bottom inset.
- Variant availability: `!availableForSale` = unavailable. `currentlyNotInStock && availableForSale` = backorderable (show differently).
- `navigation.setOptions({ title: product.title })` in `useEffect` once product loads.
- Impossible combos: after selecting an option, if no variant matches full selection, clear conflicting options (keep newly selected value only).

### Verify

- Navigate to product; images swipeable; all options render.
- Selecting all options shows variant price; button enables.
- Out-of-stock variants visually distinct.
- `npm test` passes; `npx tsc --noEmit` = 0 errors.

---

## Phase 4 — Cart Screen + Persistence

**Goal:** Zustand + MMKV cart store. PDP adds items. Cart tab shows line items,
quantity controls, totals. Persists across kills.

### Files to create/modify

| File | Action |
|------|--------|
| `src/store/cartStore.ts` | Zustand `persist` with MMKV adapter. Actions: `addItem` (upsert by variantId), `removeItem`, `incrementQuantity`, `decrementQuantity` (remove at 0), `clearCart`. Derived: `totalItems`, `subtotal`, `total`. |
| `src/features/cart/hooks/useCart.ts` | Selector hook: items, totals |
| `src/features/cart/hooks/useCartActions.ts` | Action hook: add/remove/increment/decrement |
| `src/features/cart/components/CartLineItem.tsx` | Thumbnail + title + quantity stepper (`-`/count/`+`) + row subtotal; `accessibilityLabel` on buttons |
| `src/features/cart/components/CartSummary.tsx` | Subtotal + total rows via `formatMoney`; note total = subtotal (no tax) |
| `src/features/cart/components/EmptyCart.tsx` | Empty message + "Browse Products" `Pressable` → `navigation.navigate('Home')` |
| `src/features/cart/screens/CartScreen.tsx` | Replace stub: `useCart()` → empty state or `FlashList` + `ListFooterComponent={<CartSummary>}` |
| `src/features/catalog/screens/ProductDetailScreen.tsx` | Wire `AddToCartButton.onPress` → `useCartActions().addItem(...)` |
| `src/navigation/RootTabs.tsx` | `tabBarBadge={totalItems > 0 ? totalItems : undefined}` on Cart tab |
| `__tests__/store/cartStore.test.ts` | Unit tests: add new item, upsert, decrement-to-0 removes, subtotal calc. Use `createStore` directly (no persistence) for isolation. |
| `__tests__/features/cart/CartLineItem.test.tsx` | Render; press `+`; assert callback; accessibilityLabel present |

### Key gotchas

- Zustand MMKV storage adapter: `{ getItem: key => mmkv.getString(key) ?? null, setItem: (k,v) => mmkv.set(k,v), removeItem: k => mmkv.delete(k) }` → wrap with `createJSONStorage`.
- In tests, never use the singleton store with persistence. Use `createStore(cartSlice)` per test; `beforeEach(() => useCartStore.setState({ items: [] }))` for integration tests.
- `decrementQuantity`: if current qty = 1 → `removeItem`, never allow qty = 0 in state.
- `FlashList` in CartScreen: `estimatedItemSize={80}`, `keyExtractor={item => item.variantId}`.

### Verify

- Add variant from PDP → badge shows count.
- Cart: line item visible; `+`/`-` work; subtotal updates.
- Kill app → relaunch → cart persisted.
- Same variant added twice → qty = 2, not 2 items.
- `npm test` passes; `npx tsc --noEmit` = 0 errors.

---

## Phase 5 — Polish + Tests + Accessibility

**Goal:** Theme system, full accessibility audit, complete test suite, README + Decision Log.

### Files to create/modify

| File | Action |
|------|--------|
| `src/utils/theme.ts` | `colors`, `spacing`, `typography` tokens + `useTheme()` hook (respects `useColorScheme()`) |
| Navigation files | Apply theme to header/tab bar styles |
| All interactive components | Full accessibility audit: `accessibilityRole`, `accessibilityLabel`, `accessibilityState`, `accessibilityHint` |
| `__tests__/utils/currency.test.ts` | `formatMoney` edge cases |
| `__tests__/utils/mmkvPersister.test.ts` | read/write/delete via mock |
| `__tests__/features/catalog/ProductListScreen.test.tsx` | `renderWithProviders`; mock fetch; assert titles; loading state |
| `__tests__/features/cart/CartScreen.test.tsx` | Pre-populated store; decrement to 0 → empty state |
| `__tests__/features/pdp/ProductDetailScreen.test.tsx` | Select all options → button enabled → press → cart has item |
| `README.md` | Setup, env vars, architecture diagram (ASCII), tradeoffs |
| `DECISION_LOG.md` | AI usage, rejected alternatives, key tradeoffs, what's missing |

### Key gotchas

- `OptionSelector` chips: `accessibilityRole="radio"`, `accessibilityState={{ selected, disabled }}`.
- `LoadingView`: `accessibilityLiveRegion="polite"`. `ErrorView`: `accessibilityLiveRegion="assertive"`.
- `jest.config.js`: add `setupFilesAfterFramework: ['@testing-library/react-native/extend-expect']` (verify exact key name against Jest docs).
- `@shopify/flash-list` mock re-exports `FlatList` as `FlashList` so items render in Jest.

### Verify

- `npm test` — all suites pass, no skips.
- `npm run lint` — 0 errors.
- `npx tsc --noEmit` — 0 errors.
- iOS + Android: full flow (list → PDP → add → cart → qty → persist).
- VoiceOver: option chip reads name + selected state; stepper reads "Increase/Decrease quantity of X".
- Airplane mode: cached catalog visible; cart persisted.

---

## Decisions

| Decision | Choice | Reason |
|----------|--------|--------|
| Server cache | TanStack Query | Predictable loading/error states; built-in stale-while-revalidate |
| Offline persistence | TanStack Query + MMKV persister | Automatic hydration on cold start; MMKV is sync and JSI-native |
| Cart state | Zustand + MMKV `persist` | Minimal boilerplate; easy to unit-test slices in isolation |
| List rendering | FlashList | Better perf than FlatList for large catalogs; Fabric-compatible |
| Navigation | react-navigation v7 native stack + JS bottom tabs | Type-safe; JS tabs avoid native module complexity for 2-tab layout |
| Testing | Jest + React Native Testing Library | Required by constraints; RNTL tests behavior, not implementation |
| Folder structure | Feature-based (`features/catalog`, `features/cart`, `features/pdp`) | Scales better than flat; co-locates related hooks/components/screens |

## API

- **Products feed**: `https://gist.githubusercontent.com/agorovyi/40dcd166a38b4d1e9156ad66c87111b7/raw/36f1c815dd83ed8189e55e6e6619b5d7c7c4e7d6/testProducts.json`
- Single response, all products. PDP filters client-side from cached list (no second request).
- `price.amount` is a string (Shopify convention) — always `parseFloat` before arithmetic.
