import { Page, Locator } from '@playwright/test';

export class InventoryPage {
  readonly page: Page;
  readonly menuLink: Locator;
  readonly searchInput: Locator;
  readonly emptyStateCell: Locator;
  readonly productGlassBottle: Locator;

  constructor(page: Page) {
    this.page = page;
    this.menuLink = page.getByRole('link', { name: 'คลังสินค้า' });
    this.searchInput = page.getByRole('textbox', { name: 'ค้นหาสินค้า' });
    this.emptyStateCell = page.getByRole('cell', { name: 'ไม่พบข้อมูล' });
    this.productGlassBottle = page.locator('div').filter({ hasText: /^ขวดแก้ว$/ }).first();
  }

  async goto() {
    await this.menuLink.click();
  }

  async searchProduct(keyword: string) {
    await this.searchInput.click();
    await this.searchInput.fill(keyword);
    // Codegen ไม่ได้กด Enter แต่พิมพ์แล้วข้อมูลอาจจะกรองเลย 
    // หากระบบต้องกด Enter ให้เพิ่ม: await this.searchInput.press('Enter');
  }
}
