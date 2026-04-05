import { Page, Locator } from '@playwright/test';

export class InventoryPage {
  readonly page: Page;
  readonly inventoryMenu: Locator;
  readonly searchInput: Locator;
  readonly tableRows: Locator;
  readonly firstTableRow: Locator;
  readonly emptyStateText: Locator;

  constructor(page: Page) {
    this.page = page;
    // กำหนด Locators
    this.inventoryMenu = page.getByRole('link', { name: 'คลังสินค้า' });
    this.searchInput = page.getByPlaceholder('ค้นหาสินค้า');
    this.tableRows = page.locator('table tbody tr');
    this.firstTableRow = page.locator('table tbody tr').first();
    this.emptyStateText = page.getByText('ไม่พบข้อมูล'); // สมมติข้อความเมื่อไม่พบข้อมูล
  }

  // Action: ไปที่หน้าคลังสินค้า
  async goto() {
    await this.inventoryMenu.click();
  }

  // Action: พิมพ์และค้นหาสินค้า
  async searchProduct(productName: string) {
    await this.searchInput.fill(productName);
    await this.searchInput.press('Enter');
  }
}