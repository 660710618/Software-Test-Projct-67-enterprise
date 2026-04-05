import { Page, Locator } from '@playwright/test';

export class IdentityPage {
  readonly page: Page;
  
  // กำหนด Locators
  readonly scanIdButton: Locator;
  readonly anonymousButton: Locator;
  readonly existingCustomerButton: Locator;
  readonly takePhotoButton: Locator;
  readonly confirmButton: Locator;
  readonly searchInput: Locator;
  readonly searchButton: Locator;

  constructor(page: Page) {
    this.page = page;
    
    // ผูก Locators กับ Element บนหน้าเว็บ
    this.scanIdButton = page.getByRole('button', { name: 'สแกนบัตรประชาชน' });
    this.anonymousButton = page.getByRole('button', { name: 'ไม่ระบุตัวตน' });
    this.existingCustomerButton = page.getByRole('button', { name: 'ลูกค้าเดิม' });
    this.takePhotoButton = page.getByRole('button', { name: 'ถ่ายรูป' });
    this.confirmButton = page.getByRole('button', { name: 'ยืนยัน' });
    this.searchInput = page.getByPlaceholder('ค้นหาชื่อลูกค้า...');
    this.searchButton = page.getByRole('button', { name: 'ค้นหา' });
  }

  // นำทางไปยังหน้าระบุตัวตน
  async goto() {
    await this.page.goto('http://localhost:3000/purchase/identity');
  }

  // Action: เข้าสู่ระบบแบบไม่ระบุตัวตน (ต้องถ่ายรูป)
  async proceedAsAnonymous() {
    await this.anonymousButton.click();
    await this.takePhotoButton.click();
    await this.confirmButton.click();
  }

  // Action: ค้นหาและเลือกลูกค้าเดิม
  async searchAndSelectCustomer(customerName: string) {
    await this.existingCustomerButton.click();
    await this.searchInput.fill(customerName);
    await this.searchButton.click();
    
    // ค้นหารายการที่ตรงกับชื่อและคลิก
    const customerRow = this.page.locator('.customer-list-item', { hasText: customerName }).first();
    await customerRow.click();
    await this.confirmButton.click();
  }
}