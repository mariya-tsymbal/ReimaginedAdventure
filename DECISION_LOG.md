# Decision Log

## AI Usage

After creating boilerplate React Native setup with `@react-native-community/cli@latest init` command, since as per technical restrictions Expo was not allowed, my next step was to create `CLAUDE.md` file to give some context for this project. After it created a md file based on project requirements. I've added 2 more prompts.

1. **Guideline for general interaction** — In all interactions and commit messages, be extremely concise and sacrifice grammar for the same of concision.
2. **Specific guideline for planning** — At the end of each plan, give me a list of unresolved questions to answer, if any. Make the questions extremely concise. Sacrifice grammar for the sake of concision.

Second one specifically improves quality of plans generated.

Below was my /plan prompt:

> Make a plan to implement the app from the requirements in CLAUDE.md. Here are my decisions upfront: For server cache use TanStack Query; for navigation use react-navigation JS bottom tabs (Home, Cart), List -> PDP; for cart state use zustand and mmkv; for rendering lists use FlashList; for testing let's do unit tests and light component testing with RN Testing Library; folder structure should be feature based. Here is an example of JSON response …
>
> Use multiphase structure where each phase ends with: yarn test passes, the app builds and runs on iOS and Android simulator with new functionality manually verifiable, no TS error.

After that I asked Claude to implement changes in phases, so that it is easier for me to review them and decide what I want to change.

## What Was Changed or Rejected

- **Add to Cart button placement** — AI generated it as a sticky footer above the tab bar. I moved it inline within the PDP scroll content so the full product context (images, options, price) is visible when the user reaches the button, and it doesn't compete with navigation chrome
- **Zod API validation** — I noticed `quantityAvailable` could be negative in the API response while `availableForSale` was still `true`. This prompted me to add Zod schema validation. I also chose per-item `safeParse` over strict `parse` so one malformed product doesn't break the entire catalog — important since we don't own the Shopify feed
- **Environment config** — AI hardcoded the API URL in `constants.ts`. I moved it to a `.env` file with `react-native-dotenv`, following the convention of keeping config separate from code
- **SVG icons** — AI created manual wrapper components that duplicated SVG path data in TSX. I pushed to import the `.svg` assets directly via `react-native-svg-transformer`, keeping assets as the single source of truth and the navigation code cleaner
- **Tab bar icons** — I sourced the SVG assets and replaced the placeholder text characters (`[S]`, `[C]`) with proper home and cart icons
- **Zod v4 → v3** — Zod v4 uses `export * as` syntax unsupported by React Native's Babel config; caught during testing, downgraded to v3 which has identical API for our usage
- **Added `useCallback`** to handler functions for stable references and to avoid unnecessary re-renders in child components
- **Price range display** — product list originally showed only the min price; changed to show max–min range (e.g. "CA$36.87 – CA$29.46") so users see the full price spread at a glance
- **Branding** — changed header title from "Products" to "Welcome to Reactiv store" and tab label from "Products" to "Home" for a more polished, branded experience
- **Accessibility on StockBadge** — added `accessibilityRole` and `accessibilityLiveRegion` so screen readers announce stock status changes dynamically

## Key Technical Tradeoffs

**Server state — TanStack Query over RTK Query / manual fetch**
Considered RTK Query and manual fetch with persist. Picked TanStack Query since it's faster to set up and offline consideration is being taken care of almost for free. `staleTime: 5min` avoids refetching on every screen focus; `gcTime: 24h` keeps data available offline for a full day.

**Cart state — Zustand + MMKV over Redux / Context**
Zustand has minimal boilerplate and the `persist` middleware plugs directly into MMKV. Cart survives app kills without any extra hydration logic. Easier to unit-test slices in isolation compared to Redux.

**MMKV over AsyncStorage**
MMKV is synchronous (JSI-based), making it faster for both query cache hydration and cart persistence. Tradeoff: requires native module linking and `pod install`, but worth it for a production app.

**API response validation — Zod per-item `safeParse`**
Rather than strict `parse` (all-or-nothing), each product is validated individually. Non-conforming products are dropped with a `console.warn`. This prioritizes UX resilience over strictness since we don't control the Shopify feed. Types are derived from Zod schemas via `z.infer` — single source of truth.

**Single endpoint, client-side PDP lookup**
The API returns all products in one response. PDP reuses the TanStack Query cache (`useProduct` selects from the cached list) instead of making a second request. Avoids extra network calls but means the full catalog is always in memory. Acceptable for a small catalog; would need pagination for hundreds of products.

**FlashList over FlatList**
Better recycling and memory performance. Requires `estimatedItemSize` but worth it for smoother scrolling. Mocked as `FlatList` in tests since FlashList doesn't render in JSDOM.

**Navigation — JS bottom tabs + native stack**
React Navigation v7 with type-safe param lists. Used JS-based bottom tabs (not native) to avoid native module complexity for a simple 2-tab layout. Native stack for the Home → PDP push for native transition performance.

**Feature-based folder structure**
`features/catalog`, `features/pdp`, `features/cart` — co-locates screens, components, and hooks per domain. Scales better than flat structure as the app grows.

**Environment variables — `react-native-dotenv`**
API URL moved from hardcoded constant to `.env` file. Allows different feeds per environment without code changes. `.env.template` committed for developer onboarding.

## What Would I Improve With More Time

- **Animations:** screen transitions, "added to cart" confirmation feedback, shared element transitions on product images
- **Backorder UX:** when `currentlyNotInStock && availableForSale`, swap Add to Cart for a Notify Me button
- **Image performance:** swap `Image` for FastImage (or `expo-image`) for disk caching and progressive loading
- **Visual polish:** floating tab bar, custom header animations, skeleton loading placeholders instead of a spinner
- **Cart decrement/remove:** currently only increment is implemented — would add decrement-to-zero removal and a swipe-to-delete gesture
- **Pagination:** if the catalog grows, implement cursor-based pagination rather than loading all products at once
- **Test coverage:** add integration tests for full flows (list → PDP → add to cart → cart screen), test offline hydration, and increase unit test coverage for edge cases
- **Currency formatting:** currently hardcoded to `en-US` locale — would detect device locale for accurate formatting (e.g. "28,52 $" in French Canada vs "CA$28.52" in US English)
- **Error reporting:** replace `console.warn` in Zod validation with a proper crash reporter (Sentry, Bugsnag) for production observability
