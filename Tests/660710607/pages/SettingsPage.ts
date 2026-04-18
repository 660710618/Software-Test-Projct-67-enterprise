import { Page, Locator } from '@playwright/test';

export class SettingsPage {
  readonly page: Page;
  readonly menuLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.menuLink = page.getByRole('link', { name: 'ตั้งค่า - System' });
  }

  async goto() {
    await this.menuLink.click();
  }

  // เมนู settings (จาก codegen จริง)
  get menuItems() {
    return {
      basic: this.page.getByText('ข้อมูลพื้นฐาน'),
      device: this.page.getByText('การเชื่อมต่ออุปกรณ์'),
      rounding: this.page.getByText('โหมดปัดราคา'),
      category: this.page.getByText('จัดการหมวดหมู่สินค้า'),
      priceHistory: this.page.getByText('ประวัติราคาสินค้า'),
    };
  }

  async openCategory() {
    await this.menuItems.category.click();
  }
}
