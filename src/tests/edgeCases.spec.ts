import { test, expect } from "../fixtures/base.fixture";
import { Keywords } from "../data/testData";

test.describe("Search Edge Cases", () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.navigate();
  });

  test("nonsense keyword should not crash the page @regression", async ({
    homePage,
    searchResultsPage,
    page,
  }) => {
    await homePage.searchFor(Keywords.NONSENSE);
    await page.waitForLoadState("domcontentloaded");

    // page should still be functional, not a 500 error
    const title = await page.title();
    expect(title).toBeTruthy();

    const count = await searchResultsPage.getLotCount();
    console.log(`Nonsense search returned ${count} lots`);
  });

  test("special characters should be handled gracefully @regression", async ({
    homePage,
    page,
  }) => {
    await homePage.searchFor(Keywords.SPECIAL_CHARS);
    await page.waitForLoadState("domcontentloaded");

    // no broken page
    const title = await page.title();
    expect(title).toBeTruthy();
  });

  test("consecutive searches should both work @regression", async ({
    homePage,
    searchResultsPage,
    page,
  }) => {
    // first search
    await homePage.searchFor(Keywords.PRIMARY);
    await searchResultsPage.expectToBeOpen(Keywords.PRIMARY);

    // go back home and search something else
    await page.goto("/en/", { waitUntil: "domcontentloaded" });
    await homePage.searchFor(Keywords.WATCHES);
    await searchResultsPage.expectToBeOpen(Keywords.WATCHES);
    expect(await searchResultsPage.hasResults()).toBeTruthy();
  });

  test("page refresh should keep lot info intact @regression", async ({
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

    const nameBefore = await lotDetailsPage.getLotName();

    await page.reload({ waitUntil: "domcontentloaded" });
    await lotDetailsPage.cookies.acceptIfVisible();

    const nameAfter = await lotDetailsPage.getLotName();
    expect(nameAfter).toBe(nameBefore);
  });

  test("direct URL access to a lot should work (bookmark scenario) @regression", async ({
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

    const url = page.url();
    const name = await lotDetailsPage.getLotName();

    // navigate directly to the URL like a bookmark
    await page.goto(url, { waitUntil: "domcontentloaded" });
    await lotDetailsPage.cookies.acceptIfVisible();

    const directName = await lotDetailsPage.getLotName();
    expect(directName).toBe(name);
  });
});
