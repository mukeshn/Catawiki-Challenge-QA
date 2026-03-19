import { Page } from "@playwright/test";
import { BasePage } from "./BasePage";
import { Header } from "../components/Header";
import { CookieConsent } from "../components/CookieConsent";

export class HomePage extends BasePage {
  readonly header: Header;
  readonly cookies: CookieConsent;

  constructor(page: Page) {
    super(page);
    this.header = new Header(page);
    this.cookies = new CookieConsent(page);
  }

  async navigate(): Promise<void> {
    await this.page.goto("/en/", { waitUntil: "load" });
    await this.cookies.acceptIfVisible();
  }

  async searchFor(keyword: string): Promise<void> {
    await this.header.searchByClick(keyword);
  }

  async searchByEnter(keyword: string): Promise<void> {
    await this.header.searchByEnter(keyword);
  }
}
