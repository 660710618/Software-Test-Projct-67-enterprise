import { Page, Locator } from '@playwright/test';

export class PurchasePage {
  readonly page: Page;
  
  // กำหนด Locators
  readonly weightInput: Locator;
  readonly unitPriceInput: Locator;
  readonly addToBillButton: Locator;
  readonly checkoutButton: Locator;
  readonly payCashButton: Locator;
  readonly printReceiptButton: Locator;
  readonly totalPriceDisplay: Locator;

  constructor(page: Page) {
    this.page = page;
    
    this.weightInput = page.getByLabel('น้ำหนัก (กิโลกรัม)');
    this.unitPriceInput = page.getByLabel('ราคาต่อหน่วย');
    this.addToBillButton = page.getByRole('button', { name: 'เพิ่มลงบิล' });
    this.checkoutButton = page.getByRole('button', { name: 'ชำระเงิน' });
    this.payCashButton = page.getByRole('button', { name: 'เงินสด' });
    this.printReceiptButton = page.getByRole('button', { name: 'พิมพ์ใบเสร็จ' });
    this.totalPriceDisplay = page.locator('.total-price-display');
  }

  // Action: คลิกเลือกสินค้าจากหน้าจอ
  async selectProduct(productName: string) {
    await this.page.locator('.product-card', { hasText: productName }).click();
  }

  // Action: กรอกน้ำหนักด้วยตนเองและเพิ่มลงบิล
  async addProductManualWeight(weight: string) {
    await this.weightInput.fill(weight);
    await this.addToBillButton.click();
  }

  // Action: แก้ไขราคาต่อหน่วย
  async editUnitPrice(newPrice: string) {
    await this.unitPriceInput.fill(newPrice);
  }

  // Action: กดชำระเงินด้วยเงินสดและพิมพ์ใบเสร็จ
  async checkoutWithCash() {
    await this.checkoutButton.click();
    await this.payCashButton.click();
    await this.printReceiptButton.click();
  }

  // Action: ดึงค่ายอดรวมปัจจุบันที่แสดงใน Modal มาตรวจสอบ
  async getTotalPriceInModal() {
    return await this.totalPriceDisplay.innerText();
  }
}