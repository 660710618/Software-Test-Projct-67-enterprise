import { test, expect } from '@playwright/test';
import { InventoryPage } from '../pages/InventoryPage';
import { PurchaseHistoryPage } from '../pages/PurchaseHistoryPage';

test.describe('Scrap Shop System', () => {

  test.beforeEach(async ({ page }) => {
    // ไปที่หน้าเว็บก่อนเริ่มทุกๆ Test
    await page.goto('https://your-scrap-shop-url.com'); 
  });

  // 📦 กลุ่มที่ 1: หน้าคลังสินค้า
  test.describe('Inventory Page Tests', () => {
    let inventoryPage: InventoryPage;

    test.beforeEach(async ({ page }) => {
      inventoryPage = new InventoryPage(page);
      await inventoryPage.goto();
    });

    // 🟢 Positive 1
    test('TC_INV_02: Search Valid Item Name', async () => {
      await inventoryPage.searchProduct('ทองแดง');
      await expect(inventoryPage.firstTableRow).toContainText('ทองแดง');
    });

    // 🔴 Negative 1
    test('TC_INV_09: Search Invalid Item Name', async () => {
      await inventoryPage.searchProduct('ยูเรเนียม');
      await expect(inventoryPage.tableRows).toHaveCount(0);
      // await expect(inventoryPage.emptyStateText).toBeVisible(); // เปิดใช้ถ้ามี UI บอกว่าไม่พบข้อมูล
    });

    // 🔴 Negative 2
    test('TC_INV_10: Search Special Characters', async () => {
      await inventoryPage.searchProduct('!@#$%^&*()');
      await expect(inventoryPage.tableRows).toHaveCount(0);
    });
  });

  // 📋 กลุ่มที่ 2: หน้ารายการรับซื้อ
  test.describe('Purchase History Page Tests', () => {
    let purchaseHistoryPage: PurchaseHistoryPage;

    test.beforeEach(async ({ page }) => {
      purchaseHistoryPage = new PurchaseHistoryPage(page);
      await purchaseHistoryPage.goto();
    });

    // 🟢 Positive 2
    test('TC_PUR_04: Filter Purchase By Category', async () => {
      await purchaseHistoryPage.filterByCategory('กระดาษ');
      
      const rowCount = await purchaseHistoryPage.categoryCells.count();
      for (let i = 0; i < rowCount; i++) {
        await expect(purchaseHistoryPage.categoryCells.nth(i)).toHaveText(/กระดาษ/);
      }
    });

    // 🟢 Positive 3
    test('TC_PUR_02: Open Customer Info Modal', async () => {
      await purchaseHistoryPage.openFirstItemDetails();
      
      await expect(purchaseHistoryPage.customerModalHeader).toBeVisible();
      await expect(purchaseHistoryPage.customerNameField).toBeVisible();
      await expect(purchaseHistoryPage.idCardField).toBeVisible();
    });

    // 🔴 Negative 3
    test('TC_PUR_06: Close Modal With X Button', async () => {
      await purchaseHistoryPage.openFirstItemDetails();
      await expect(purchaseHistoryPage.customerModalHeader).toBeVisible(); // รอให้เปิดสำเร็จก่อน

      await purchaseHistoryPage.closeDetailsModal();
      await expect(purchaseHistoryPage.customerModalHeader).toBeHidden(); // เช็คว่าปิดไปแล้ว
    });
  });
});