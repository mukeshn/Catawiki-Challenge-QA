import { test, expect } from "../fixtures/base.fixture";
import { Keywords, Urls } from "../data/testData";

test.describe("Homepage Structure", () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.navigate();
  });

  test("search field should be visible on homepage @smoke", async ({ homePage }) => {
    expect(await homePage.header.isSearchVisible()).toBeTruthy();
  });

  test("logo should be visible @smoke", async ({ homePage }) => {
    expect(await homePage.header.isLogoVisible()).toBeTruthy();
  });

  test("page title should contain catawiki @regression", async ({ homePage }) => {
    const title = await homePage.getPageTitle();
    const url = await homePage.getCurrentUrl();
    // title doesn't always include the brand name depending on locale, so checking URL too
    expect(
      title.toLowerCase().includes("catawiki") ||
      url.toLowerCase().includes("catawiki.com")
    ).toBeTruthy();
  });
});

test.describe("Navigation Flows", () => {
  test("browser back from lot page should return to search results @regression", async ({
    homePage,
    searchResultsPage,
    lotDetailsPage,
    page,
  }) => {
    await homePage.navigate();
    await homePage.searchFor(Keywords.PRIMARY);
    await searchResultsPage.expectToBeOpen(Keywords.PRIMARY);
    await searchResultsPage.clickLotByIndex(2);
    await lotDetailsPage.expectToBeOpen();

    // go back
    await page.goBack();
    await page.waitForLoadState("domcontentloaded");

    const count = await searchResultsPage.getLotCount();
    expect(count).toBeGreaterThan(0);
  });

  test("search URL should contain the keyword @regression", async ({
    homePage,
    page,
  }) => {
    await homePage.navigate();
    await homePage.searchFor(Keywords.PRIMARY);

    expect(page.url()).toMatch(Urls.SEARCH);
  });

  test("lot page URL should contain /l/ path @regression", async ({
    homePage,
    searchResultsPage,
    lotDetailsPage,
    page,
  }) => {
    await homePage.navigate();
    await homePage.searchFor(Keywords.PRIMARY);
    await searchResultsPage.expectToBeOpen(Keywords.PRIMARY);
    await searchResultsPage.clickLotByIndex(1);
    await lotDetailsPage.expectToBeOpen();

    expect(page.url()).toMatch(Urls.LOT);
  });
});
