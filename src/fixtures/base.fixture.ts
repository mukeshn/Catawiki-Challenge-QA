import { test as base } from "@playwright/test";
import { HomePage } from "../pages/HomePage";
import { SearchResultsPage } from "../pages/SearchResultsPage";
import { LotDetailsPage } from "../pages/LotDetailsPage";

// page object fixtures shared across tests
type Fixtures = {
  homePage: HomePage;
  searchResultsPage: SearchResultsPage;
  lotDetailsPage: LotDetailsPage;
};

export const test = base.extend<Fixtures>({
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  searchResultsPage: async ({ page }, use) => {
    await use(new SearchResultsPage(page));
  },
  lotDetailsPage: async ({ page }, use) => {
    await use(new LotDetailsPage(page));
  },
});

export { expect } from "@playwright/test";
