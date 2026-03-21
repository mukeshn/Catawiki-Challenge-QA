import { Page, Locator } from "@playwright/test";
import { parseCurrencyAmount } from "../helpers/utils";

export class BidPanel {
  readonly page: Page;
  readonly currentBidAmount: Locator;
  readonly placeBidButton: Locator;
  readonly setMaxBidButton: Locator;
  readonly bidSuggestionChips: Locator;
  readonly closingTimer: Locator;

  constructor(page: Page) {
    this.page = page;

    // grab the amount sitting next to the "Current bid" label
    this.currentBidAmount = page.locator(':text-is("Current bid") + *').first();

    this.placeBidButton = page.getByRole("button", { name: /place bid/i });
    this.setMaxBidButton = page.getByRole("button", { name: /max bid/i });

    // quick-bid chips contain € but aren't action buttons
    this.bidSuggestionChips = page.locator(
      'button:has-text("€"):not(:has-text("Place")):not(:has-text("Set")):not(:has-text("Buy"))'
    );

    this.closingTimer = page.locator("text=/Closes in|Closing|ends in/i").first();
  }

  async getCurrentBidText(): Promise<string> {
    try {
      await this.currentBidAmount.waitFor({ state: "visible", timeout: 10_000 });
      const text = await this.currentBidAmount.textContent();
      return text?.trim() ?? "";
    } catch {
      // fallback - grab first visible euro amount on the page
      const fallback = this.page.locator("text=/€\\s*\\d+/").first();
      const text = await fallback.textContent().catch(() => "");
      return text?.trim() ?? "Bid not found";
    }
  }

  async getCurrentBidNumeric(): Promise<number> {
    const text = await this.getCurrentBidText();
    return parseCurrencyAmount(text);
  }

  async getBidSuggestionValues(): Promise<string[]> {
    const count = await this.bidSuggestionChips.count();
    // panel renders in both main and sticky versions, dedup by value
    const seen = new Set<string>();
    for (let i = 0; i < count; i++) {
      const text = await this.bidSuggestionChips.nth(i).textContent();
      if (text?.trim()) seen.add(text.trim());
    }
    return [...seen];
  }

  async isPlaceBidVisible(): Promise<boolean> {
    return this.placeBidButton.isVisible({ timeout: 5_000 }).catch(() => false);
  }

  async isTimerVisible(): Promise<boolean> {
    return this.closingTimer.isVisible({ timeout: 5_000 }).catch(() => false);
  }
}
