import { Page, Locator } from "@playwright/test";

export class Header {
  readonly page: Page;
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly logo: Locator;

  constructor(page: Page) {
    this.page = page;

    // there's also a language switcher combobox — the placeholder name tells them apart
    this.searchInput = page
      .getByRole("combobox", { name: /brand|artist/i })
      .or(page.locator('input[type="search"]'));

    this.searchButton = page.getByRole("button", { name: "Search" }).first();
    this.logo = page.getByRole("link", { name: "homepage" }).first();
  }

  async searchByClick(keyword: string): Promise<void> {
    await this.searchInput.first().waitFor({ state: "visible" });
    await this.searchInput.first().fill(keyword);
    // small pause for the autocomplete dropdown to settle before clicking
    // eslint-disable-next-line playwright/no-wait-for-timeout
    await this.page.waitForTimeout(400);
    await this.searchButton.click();
  }

  async searchByEnter(keyword: string): Promise<void> {
    await this.searchInput.first().waitFor({ state: "visible" });
    await this.searchInput.first().fill(keyword);
    await this.searchInput.first().press("Enter");
  }

  async isSearchVisible(): Promise<boolean> {
    return this.searchInput.first().isVisible();
  }

  async isLogoVisible(): Promise<boolean> {
    return this.logo.isVisible();
  }

  async clickLogo(): Promise<void> {
    await this.logo.click();
  }

  async getSearchPlaceholder(): Promise<string | null> {
    return this.searchInput.first().getAttribute("placeholder");
  }
}
