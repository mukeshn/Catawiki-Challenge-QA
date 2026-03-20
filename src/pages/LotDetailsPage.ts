import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "./BasePage";
import { BidPanel } from "../components/BidPanel";
import { CookieConsent } from "../components/CookieConsent";
import { parseCurrencyAmount } from "../helpers/utils";

export interface LotInfo {
  name: string;
  favoritesCount: number;
  currentBid: string;
  currentBidNumeric: number;
}

export class LotDetailsPage extends BasePage {
  readonly bidPanel: BidPanel;
  readonly cookies: CookieConsent;
  readonly lotTitle: Locator;
  readonly favoritesCounter: Locator;
  readonly lotImages: Locator;
  readonly sellerInfo: Locator;
  readonly buyerProtection: Locator;

  constructor(page: Page) {
    super(page);
    this.bidPanel = new BidPanel(page);
    this.cookies = new CookieConsent(page);

    this.lotTitle = page.locator("h1").first();

    // Favourites button is right after h1; its text content is the count (e.g. "32")
    this.favoritesCounter = page.locator("h1 + * > button:has(img)").first();

    // Gallery images use sequential alt text: "Lot Title #1.0", "#2.1", etc.
    this.lotImages = page.locator('main img[alt*="#"]');

    this.sellerInfo = page.locator("text=/Selected by/i").first();

    this.buyerProtection = page.locator("text=/Buyer Protection/i").first();
  }

  async expectToBeOpen(): Promise<void> {
    await this.waitForPageReady();
    await expect(this.lotTitle).toBeVisible({ timeout: 15_000 });
    expect(this.page.url()).toMatch(/\/l\//i);
  }

  async getLotName(): Promise<string> {
    await this.lotTitle.waitFor({ state: "visible" });
    return (await this.lotTitle.textContent())?.trim() ?? "";
  }

  async getFavoritesCount(): Promise<number> {
    try {
      await this.favoritesCounter.waitFor({ state: "visible", timeout: 8_000 });
      const text = await this.favoritesCounter.textContent();
      const match = text?.match(/\d+/);
      return match ? parseInt(match[0], 10) : 0;
    } catch {
      return 0;
    }
  }

  async extractAndPrintLotInfo(): Promise<LotInfo> {
    const name = await this.getLotName();
    const favoritesCount = await this.getFavoritesCount();
    const currentBid = await this.bidPanel.getCurrentBidText();
    const currentBidNumeric = parseCurrencyAmount(currentBid);

    console.log(`Lot Name: ${name}`);
    console.log(`Favourites: ${favoritesCount}`);
    console.log(`Current Bid: ${currentBid}`);

    return { name, favoritesCount, currentBid, currentBidNumeric };
  }

  async getImageCount(): Promise<number> {
    await this.lotImages
      .first()
      .waitFor({ state: "visible", timeout: 10_000 })
      .catch(() => {});
    return this.lotImages.count();
  }

  async isSellerInfoVisible(): Promise<boolean> {
    return this.sellerInfo.isVisible({ timeout: 5_000 }).catch(() => false);
  }

  async isBuyerProtectionVisible(): Promise<boolean> {
    return this.buyerProtection.isVisible({ timeout: 5_000 }).catch(() => false);
  }
}
