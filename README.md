# Catawiki QA Automation - Prepared by Mukesh Ningadali

E2E tests for [Catawiki](https://www.catawiki.com) using Playwright + TypeScript.

Built as part of a QA take-home assignment. The main scenario — search "train", open the 2nd lot, print name/favourites/current bid — is in `search.spec.ts`. Everything else is extra coverage I added to make the suite more useful.

---

## Quick Start (for reviewers)

> **Prerequisite:** Node.js 18+ and **Google Chrome** must be installed.

```bash
npm install
npx playwright install chromium
npm test
```

That's it. The full suite runs in headless Chrome and takes around 3–5 minutes. When done, open the HTML report with:

```bash
npm run report
```

> **Note:** Tests run against the live Catawiki site, so results depend on live lot availability. If a test fails due to a lot being closed, re-running it almost always passes.

---

## Stack

- **Playwright** (v1.49) + **TypeScript**
- Page Object Model with reusable components (Header, BidPanel, CookieConsent)
- Custom fixtures for cleaner test signatures
- GitHub Actions CI

---

## Project layout

```
src/
├── components/     Header, BidPanel, CookieConsent
├── pages/          BasePage, HomePage, SearchResultsPage, LotDetailsPage
├── tests/          search · lotDetails · navigation · edgeCases
├── fixtures/       base.fixture.ts — injects page objects into tests
├── helpers/        utils.ts — currency parsing, ascending check
└── data/           testData.ts — keywords and URL patterns
```

---

## Setup

```bash
npm install
npx playwright install
```

> **Note:** Catawiki blocks Playwright's bundled headless Chromium. You need **Google Chrome** installed locally. The config already sets `channel: "chrome"` so nothing extra is needed beyond having Chrome on your machine.

---

## Running tests

```bash
npm test                   # all tests, Chrome headless
npm run test:headed        # same but you can watch the browser
npm run test:smoke         # @smoke tags only (~5 tests, ~1 min)
npm run test:regression    # @regression tags only
npm run report             # open the last HTML report
```

---

## What's covered

**search.spec.ts** — core assignment flow + extra keyword coverage
- Search "train" → click 2nd lot → print lot name, favourites, current bid to console
- Same flow using Enter key instead of the search button
- Searches for watches, paintings, numeric year

**lotDetails.spec.ts** — lot page element validation
- Lot title is present and non-empty
- Current bid shows a valid € amount
- Favourites counter is a non-negative integer
- Gallery has at least one image
- Seller info is visible
- Bid suggestion chips are in ascending order
- Two different lots have different titles

**navigation.spec.ts** — URL and navigation behaviour
- Homepage renders search field and logo
- Browser back from a lot page returns to search results
- Search URL includes the keyword
- Lot URLs always contain `/l/`

**edgeCases.spec.ts** — robustness checks
- Nonsense keyword doesn't crash the page
- Special characters (`art & antiques`) are handled gracefully
- Consecutive searches both return results
- Page refresh on a lot keeps the same title
- Direct URL access (bookmark simulation) works

---

## A few things worth knowing

Tests run against the live site, so lot availability changes. If a lot closes mid-run the bid section disappears — re-running almost always picks up an active one. CI retries twice for exactly this reason.

Catawiki doesn't expose `data-testid` attributes on most elements, so selectors use roles and accessible names where possible and fall back to structural CSS. If the DOM changes, `npx playwright codegen https://www.catawiki.com/en/` is the fastest way to find updated selectors.

---

## What I'd add next

- Visual regression with `toHaveScreenshot()` to catch layout shifts
- Intercept bid API responses and verify the displayed amount matches
- Accessibility scan with axe-core
- Cookie consent compliance — confirm no analytics fire before the banner is accepted
- Data-driven search tests pulling keywords from a JSON fixture
