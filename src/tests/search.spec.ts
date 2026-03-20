import { test, expect } from "../fixtures/base.fixture";
import { Keywords } from "../data/testData";

test.describe("Search and Lot Details - Core Flow", () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.navigate();
  });

  test("search for train, open 2nd lot, and print lot details @smoke", async ({
    homePage,
    searchResultsPage,
    lotDetailsPage,
  }) => {
    // Step 1-2: type "train" and click magnifier button
    await homePage.searchFor(Keywords.PRIMARY);

    // Step 3: verify search results loaded
    await searchResultsPage.expectToBeOpen(Keywords.PRIMARY);
    const count = await searchResultsPage.getLotCount();
    expect(count).toBeGreaterThan(1);

    // Step 4: click the second lot
    await searchResultsPage.clickLotByIndex(2);

    // Step 5: verify lot page opened
    await lotDetailsPage.expectToBeOpen();

    // Step 6-7: extract and print all three values
    const info = await lotDetailsPage.extractAndPrintLotInfo();

    expect(info.name.length).toBeGreaterThan(0);
    expect(info.favoritesCount).toBeGreaterThanOrEqual(0);
    expect(info.currentBid).toContain("€");
    expect(info.currentBidNumeric).toBeGreaterThan(0);
  });

  test("search results should show multiple lots for popular keyword @smoke", async ({
    homePage,
    searchResultsPage,
  }) => {
    await homePage.searchFor(Keywords.PRIMARY);
    await searchResultsPage.expectToBeOpen(Keywords.PRIMARY);

    const count = await searchResultsPage.getLotCount();
    expect(count).toBeGreaterThanOrEqual(3);
  });

  test("search via Enter key should also work @regression", async ({
    homePage,
    searchResultsPage,
  }) => {
    await homePage.searchByEnter(Keywords.PRIMARY);
    await searchResultsPage.expectToBeOpen(Keywords.PRIMARY);
    expect(await searchResultsPage.hasResults()).toBeTruthy();
  });

  test("search for watches should return results @regression", async ({
    homePage,
    searchResultsPage,
  }) => {
    await homePage.searchFor(Keywords.WATCHES);
    await searchResultsPage.expectToBeOpen(Keywords.WATCHES);
    expect(await searchResultsPage.hasResults()).toBeTruthy();
  });

  test("search for art keyword should return results @regression", async ({
    homePage,
    searchResultsPage,
  }) => {
    await homePage.searchFor(Keywords.ART);
    await searchResultsPage.expectToBeOpen(Keywords.ART);
    expect(await searchResultsPage.hasResults()).toBeTruthy();
  });

  test("search for year should work @regression", async ({
    homePage,
    searchResultsPage,
  }) => {
    await homePage.searchFor(Keywords.YEAR);
    await searchResultsPage.expectToBeOpen(Keywords.YEAR);
    const count = await searchResultsPage.getLotCount();
    console.log(`Year search "${Keywords.YEAR}" returned ${count} lots`);
  });
});
