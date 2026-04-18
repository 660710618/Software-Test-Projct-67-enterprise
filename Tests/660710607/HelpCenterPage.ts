import { Page, Locator } from '@playwright/test';

export class HelpCenterPage {
  readonly page: Page;
  readonly menuLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.menuLink = page.getByRole('link', { name: 'ศูนย์ช่วยเหลือ' });
  }

  async goto() {
    await this.menuLink.click();
  }

  // เมนูทั้งหมด (อิงจาก codegen จริง)
  get helpItems() {
    return {
      receive: this.page.getByText('หน้ารับซื้อสินค้า'),
      products: this.page.getByText('หน้าสินค้าทั้งหมด'),
      inventory: this.page.getByText('หน้าคลังสินค้า'),
      purchase: this.page.getByText('หน้ารายการรับซื้อ'),
      customer: this.page.getByText('หน้าลูกค้า'),
      bill: this.page.getByText('หน้าบิลเสร็จ'),
    };
  }
}