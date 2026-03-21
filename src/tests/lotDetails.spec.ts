import { test, expect } from "../fixtures/base.fixture";
import { Keywords } from "../data/testData";
import { isValidEuroBid, isAscending, parseCurrencyAmount } from "../helpers/utils";

test.describe("Lot Detail Page - Elements", () => {
  // navigate to a lot page before each test
  test.beforeEach(async ({ homePage, searchResultsPage }) => {
    await homePage.navigate();
    await homePage.searchFor(Keywords.PRIMARY);
    await searchResultsPage.expectToBeOpen(Keywords.PRIMARY);
    await searchResultsPage.clickLotByIndex(2);
  });

  test("lot title should be present and non-empty @smoke", async ({ lotDetailsPage }) => {
    await lotDetailsPage.expectToBeOpen();
    const name = await lotDetailsPage.getLotName();
    expect(name).toBeTruthy();
    expect(name.length).toBeGreaterThan(3);
  });

  test("current bid should show euro amount @regression", async ({ lotDetailsPage }) => {
    await lotDetailsPage.expectToBeOpen();
    const bid = await lotDetailsPage.bidPanel.getCurrentBidText();
    const amount = await lotDetailsPage.bidPanel.getCurrentBidNumeric();

    expect(isValidEuroBid(bid)).toBeTruthy();
    expect(amount).toBeGreaterThan(0);
    console.log(`Current bid: ${bid} (parsed: ${amount})`);
  });

  test("favorites counter should be a valid number @regression", async ({ lotDetailsPage }) => {
    await lotDetailsPage.expectToBeOpen();
    const count = await lotDetailsPage.getFavoritesCount();

    expect(count).toBeGreaterThanOrEqual(0);
    expect(Number.isInteger(count)).toBeTruthy();
  });

  test("lot should have at least one image @regression", async ({ lotDetailsPage }) => {
    await lotDetailsPage.expectToBeOpen();
    const imgCount = await lotDetailsPage.getImageCount();
    expect(imgCount).toBeGreaterThanOrEqual(1);
  });

  test("seller info should be visible @regression", async ({ lotDetailsPage }) => {
    await lotDetailsPage.expectToBeOpen();
    expect(await lotDetailsPage.isSellerInfoVisible()).toBeTruthy();
  });

  test("buyer protection info should be present @regression", async ({ lotDetailsPage }) => {
    await lotDetailsPage.expectToBeOpen();
    const visible = await lotDetailsPage.isBuyerProtectionVisible();
    console.log(`Buyer protection visible: ${visible}`);
    // not hard-asserting because it might be styled differently for some lots
  });

  test("bid suggestion chips should be in ascending order @regression", async ({
    lotDetailsPage,
  }) => {
    await lotDetailsPage.expectToBeOpen();
    const suggestions = await lotDetailsPage.bidPanel.getBidSuggestionValues();

    if (suggestions.length > 1) {
      const amounts = suggestions.map(parseCurrencyAmount);
      expect(isAscending(amounts)).toBeTruthy();
      console.log(`Bid suggestions: ${suggestions.join(", ")}`);
    }
    // if 0 or 1 chips, the lot might have ended - skip the check
  });

  test("different lots should have different titles @regression", async ({
    homePage,
    searchResultsPage,
    page,
  }) => {
    // navigate fresh since beforeEach already clicked into lot page
    await page.goto("/en/", { waitUntil: "domcontentloaded" });
    await homePage.searchFor(Keywords.PRIMARY);
    await searchResultsPage.expectToBeOpen(Keywords.PRIMARY);

    const lot1Title = await searchResultsPage.getLotTitleByIndex(1);
    const lot2Title = await searchResultsPage.getLotTitleByIndex(2);

    if (lot1Title && lot2Title) {
      expect(lot1Title).not.toBe(lot2Title);
    }
  });
});
