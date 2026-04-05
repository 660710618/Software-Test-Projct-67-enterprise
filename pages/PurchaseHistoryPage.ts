import { Page, Locator } from '@playwright/test';

export class PurchaseHistoryPage {
  readonly page: Page;
  readonly purchaseMenu: Locator;
  readonly categoryDropdown: Locator;
  readonly categoryCells: Locator;
  readonly moreInfoButtons: Locator;
  readonly customerModalHeader: Locator;
  readonly customerNameField: Locator;
  readonly idCardField: Locator;
  readonly closeModalButton: Locator;

  constructor(page: Page) {
    this.page = page;
    // กำหนด Locators
    this.purchaseMenu = page.getByRole('link', { name: 'รายการรับซื้อ' });
    this.categoryDropdown = page.getByRole('combobox', { name: 'หมวดหมู่' });
    this.categoryCells = page.locator('table tbody tr td:nth-child(8)'); // สมมติหมวดหมู่อยู่คอลัมน์ 8
    this.moreInfoButtons = page.getByRole('button', { name: 'เพิ่มเติม' });
    this.customerModalHeader = page.getByText('ลูกค้าที่นำสินค้ามาขาย');
    this.customerNameField = page.getByText('ชื่อ-นามสกุล');
    this.idCardField = page.getByText('เลขบัตรประชาชน');
    this.closeModalButton = page.getByRole('button', { name: 'Close' }); 
  }

  // Action: ไปที่หน้ารายการรับซื้อ
  async goto() {
    await this.purchaseMenu.click();
  }

  // Action: กรองข้อมูลตามหมวดหมู่
  async filterByCategory(categoryName: string) {
    await this.categoryDropdown.selectOption({ label: categoryName });
  }

  // Action: เปิด Pop-up รายละเอียดลูกค้าของรายการแรก
  async openFirstItemDetails() {
    await this.moreInfoButtons.first().click();
  }

  // Action: ปิด Pop-up
  async closeDetailsModal() {
    await this.closeModalButton.click();
  }
}