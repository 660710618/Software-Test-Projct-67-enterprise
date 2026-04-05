import { test, expect } from '@playwright/test';
import { IdentityPage } from '../pages/IdentityPage';
import { PurchasePage } from '../pages/PurchasePage';

test.describe('Purchase Flow with POM', () => {
  let identityPage: IdentityPage;
  let purchasePage: PurchasePage;

  test.beforeEach(async ({ page }) => {
    // กำหนดค่าเริ่มต้นของ Page Object
    identityPage = new IdentityPage(page);
    purchasePage = new PurchasePage(page);
    
    await identityPage.goto();
  });

  test('ควรสามารถระบุตัวตนและเพิ่มสินค้าลงบิลได้สำเร็จ', async () => {
    // 1. ระบุตัวตนแบบไม่ระบุชื่อ (ถ่ายรูป)
    await identityPage.proceedAsAnonymous();

    // 2. เลือกสินค้า "กระดาษลัง"
    await purchasePage.selectProduct('กระดาษลัง');

    // 3. ใส่น้ำหนักและเพิ่มลงบิล
    await purchasePage.addProductManualWeight('10.5');

    // 4. เลือกสินค้า "ขวดแก้ว" และชำระเงิน
    await purchasePage.selectProduct('ขวดแก้ว');
    await purchasePage.addProductManualWeight('5.0');
    await purchasePage.checkoutWithCash();
  });
});