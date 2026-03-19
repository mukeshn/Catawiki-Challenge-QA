import { Page } from "@playwright/test";

export class CookieConsent {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async acceptIfVisible(): Promise<void> {
    try {
      const btn = this.page.getByRole("button", { name: /accept all|accept/i });
      await btn.click({ timeout: 5_000 });
      // eslint-disable-next-line playwright/no-wait-for-timeout
      await this.page.waitForTimeout(500); // banner animation
    } catch {
      // no banner, that's fine
    }
  }
}
