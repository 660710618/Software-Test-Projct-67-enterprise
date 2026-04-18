import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { PurchaseHistoryPage } from '../pages/PurchaseHistoryPage';

test.describe('Scrap Shop System - UI Tests', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('Treble2561', '087456123a');
  });

  test.describe('หน้าคลังสินค้า', () => {
    let inventoryPage: InventoryPage;

    test.beforeEach(async ({ page }) => {
      inventoryPage = new InventoryPage(page);
      await inventoryPage.goto();
    });

    // ======================================
    // ข้อ 1 POSITIVE TEST CASE
    // ======================================
    test('TC_INV_02 | ค้นหาสินค้าด้วยชื่อที่ถูกต้อง = "ขวดแก้ว" -> สำเร็จ', async () => {
      await inventoryPage.searchProduct('ขวดแก้ว');
      await expect(inventoryPage.productGlassBottle).toBeVisible(); 
    });

    // ======================================
    // ข้อ 2 NEGATIVE TEST CASE
    // ======================================
    test('TC_INV_09 | ค้นหาสินค้าที่ไม่มีในระบบ = "ยูเรเนียม" -> ไม่พบข้อมูล', async () => {
      await inventoryPage.searchProduct('ยูเรเนียม');
      await expect(inventoryPage.emptyStateCell).toBeVisible();
    });

    // ======================================
    // ข้อ 3 NEGATIVE TEST CASE
    // ======================================
    test('TC_INV_11 | ค้นหาด้วยการเคาะเว้นวรรค (Spacebar) อย่างเดียว 5 ครั้ง -> ไม่พบข้อมูล', async () => {
      await inventoryPage.searchProduct('     ');
      await expect(inventoryPage.emptyStateCell).toBeVisible();
    });
  });

  test.describe('หน้ารายการรับซื้อ', () => {
    let purchaseHistoryPage: PurchaseHistoryPage;

    test.beforeEach(async ({ page }) => {
      purchaseHistoryPage = new PurchaseHistoryPage(page);
      await purchaseHistoryPage.goto();
    });

    // ======================================
    // ข้อ 4 POSITIVE TEST CASE
    // ======================================
    test('TC_PUR_02 | เปิดหน้าต่างข้อมูลลูกค้า (Modal Popup) -> สำเร็จ', async () => {
      await purchaseHistoryPage.openFirstRecordDetails();
      await expect(purchaseHistoryPage.customerModalDetail).toBeVisible();
    });

    // ======================================
    // ข้อ 5 POSITIVE TEST CASE
    // ======================================
    test('TC_PUR_06 | ปิดหน้าต่างข้อมูลลูกค้าด้วยปุ่ม X -> สำเร็จ', async () => {
      await purchaseHistoryPage.openFirstRecordDetails();
      await expect(purchaseHistoryPage.customerModalDetail).toBeVisible();
      
      await purchaseHistoryPage.closeDetails();
      await expect(purchaseHistoryPage.customerModalDetail).toBeHidden();
    });

    // ======================================
    // ข้อ 6 NEGATIVE TEST CASE
    // ======================================
    test('TC_PUR_13 | ค้นหาด้วยเลข 0 เพียงตัวเดียว -> ไม่พบข้อมูล', async () => {
      await purchaseHistoryPage.searchRecord('0');
      await expect(purchaseHistoryPage.emptyStateCell).toBeVisible();
    });
  });
});