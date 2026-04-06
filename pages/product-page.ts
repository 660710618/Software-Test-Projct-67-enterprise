import { Page, Locator } from '@playwright/test';

export class ProductPage {
  readonly page: Page;
  readonly categoryDropdown: Locator;
  readonly searchInput: Locator;
  readonly addProductButton: Locator;
  readonly productCard: Locator;
  readonly logoutButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.categoryDropdown = page.locator('select');
    this.searchInput = page.getByPlaceholder('ค้นหาสินค้า');
    this.addProductButton = page.getByRole('button', { name: 'เพิ่มสินค้า' });
    this.productCard = page.getByText('ขวดแก้ว');
    this.logoutButton = page.getByText('ออกจากระบบ');
  }

  async searchProduct(productName: string) {
    await this.searchInput.fill(productName);
    await this.searchInput.press('Enter');
  }

  async selectCategory(category: string) {
    await this.categoryDropdown.selectOption(category);
  }

  async clickAddProduct() {
    await this.addProductButton.click();
  }

  async logout() {
    await this.logoutButton.click();
  }
}