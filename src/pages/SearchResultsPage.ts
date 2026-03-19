import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "./BasePage";
import { Header } from "../components/Header";

export class SearchResultsPage extends BasePage {
  readonly header: Header;
  readonly lotCards: Locator;

  constructor(page: Page) {
    super(page);
    this.header = new Header(page);

    // search results link directly to /l/ pages; homepage tiles wrap <article>
    this.lotCards = page
      .locator('main a[href*="/l/"]')
      .or(page.locator("main a:has(> article)"));
  }

  async expectToBeOpen(keyword: string): Promise<void> {
    await this.waitForPageReady();
    const url = this.page.url().toLowerCase();
    expect(
      url.includes("/s?") ||
      url.includes("q=") ||
      url.includes(keyword.toLowerCase())
    ).toBeTruthy();
  }

  async getLotCount(): Promise<number> {
    await this.lotCards
      .first()
      .waitFor({ state: "visible", timeout: 15_000 })
      .catch(() => {});
    return this.lotCards.count();
  }

  async clickLotByIndex(index: number): Promise<void> {
    const count = await this.getLotCount();
    if (count < index) {
      throw new Error(`Wanted lot #${index} but only ${count} found on page`);
    }
    const lot = this.lotCards.nth(index - 1);
    await this.scrollToElement(lot);
    await lot.click();
  }

  async getLotTitleByIndex(index: number): Promise<string> {
    const lot = this.lotCards.nth(index - 1);
    const inner = lot.locator("h2, h3, p:not(:empty)").first();
    const text = await inner.textContent().catch(() => "");
    if (text?.trim()) return text.trim();
    return (await lot.getAttribute("aria-label")) ?? "";
  }

  async getAllVisibleTitles(): Promise<string[]> {
    const count = await this.getLotCount();
    const titles: string[] = [];
    for (let i = 0; i < Math.min(count, 10); i++) {
      const t = await this.getLotTitleByIndex(i + 1);
      if (t) titles.push(t);
    }
    return titles;
  }

  async hasResults(): Promise<boolean> {
    return (await this.getLotCount()) > 0;
  }
}
