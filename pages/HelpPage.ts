import { Page, Locator } from '@playwright/test';

export class HelpPage {
  readonly page: Page;
  readonly helpMenu: Locator;
  readonly helpTitle: Locator;
  readonly purchasesCard: Locator;
  readonly productsCard: Locator;
  readonly warehouseCard: Locator;
  readonly customersCard: Locator;

  constructor(page: Page) {
    this.page = page;
    // กำหนด Locators ตาม ts1.txt [6-8]
    this.helpMenu = page.getByRole('link', { name: 'ศูนย์ช่วยเหลือ' });
    this.helpTitle = page.getByText('วิธีการใช้งานแต่ละหน้า');
    this.purchasesCard = page.locator('.card').filter({ hasText: 'หน้ารับซื้อสินค้า' });
    this.productsCard = page.locator('.card').filter({ hasText: 'หน้าสินค้าทั้งหมด' });
    this.warehouseCard = page.locator('.card').filter({ hasText: 'หน้าคลังสินค้า' });
    this.customersCard = page.locator('.card').filter({ hasText: 'หน้าลูกค้า' });
  }

  // Action: เข้าสู่หน้าศูนย์ช่วยเหลือ [6]
  async goto() {
    await this.helpMenu.click();
  }

  // Action: คลิกดูคู่มือแต่ละหัวข้อ [6-8]
  async viewHelpTopic(topic: 'purchases' | 'products' | 'warehouse' | 'customers') {
    const cards = {
      purchases: this.purchasesCard,
      products: this.productsCard,
      warehouse: this.warehouseCard,
      customers: this.customersCard,
    };
    await cards[topic].click();
  }
}