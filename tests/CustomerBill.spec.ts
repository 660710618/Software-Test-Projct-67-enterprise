import { test, expect } from '@playwright/test';
import { CustomerPage } from './customer-page';
import { BillPage } from './bill-page';

test.describe('Scrap Shop Management System - Integration Test', () => {
  let customerPage: CustomerPage;
  let billPage: BillPage;
  test.beforeEach(async ({ page }) => {
    customerPage = new CustomerPage(page);
    billPage = new BillPage(page);
    await page.goto('http://localhost:3000/dashboard');
  });
  test('TS-CUS-01: ค้นหาลูกค้า "น.ส.ใจดี จริงใจ" และตรวจสอบข้อมูล', async () => {
    await customerPage.goto();
    await customerPage.search('น.ส.ใจดี จริงใจ');
    await customerPage.expectCustomerData('น.ส.ใจดี จริงใจ', '99/123 หมู่ 5');
  });

  test('TS-CUS-05: ค้นหาชื่อที่ไม่มีในระบบ ต้องแสดงข้อความแจ้งเตือน', async () => {
    await customerPage.goto();
    await customerPage.search('Non-Existent-User');
    
    // ผลลัพธ์ที่คาดหวัง: ระบบแสดงข้อความแจ้งไม่พบข้อมูล
    await expect(customerPage.page.getByText('ไม่พบข้อมูล')).toBeVisible();
  });


  /** * [ระบบหน้าบิลใบเสร็จ]
   */

  test('TS-CUS-17: เปิดดูรายละเอียดบิล #3 และตรวจสอบยอดชำระ', async () => {
    await billPage.goto();
    await billPage.openBillDetail('#3');
    
    // ตรวจสอบ Pop-up รายละเอียดบิล (รูป 5.16)
    await billPage.expectTotal('1,925.20');
    await expect(billPage.modalDetail.getByText('RC-000003')).toBeVisible();
  });

  test('TS-CUS-23: กรองวันที่ที่ไม่มีรายการ ต้องแสดงข้อความแจ้งเตือน', async () => {
    await billPage.goto();
    await billPage.filterByDate('2099-12-31');
    
    // ผลลัพธ์ที่คาดหวัง: ระบบแสดงข้อความ "ไม่พบข้อมูลบิลในวันที่เลือก"
    await expect(billPage.page.getByText('ไม่พบข้อมูลบิลในวันที่เลือก')).toBeVisible();
  });

  test('TS-CUS-24: ตรวจสอบว่าบิลเป็นแบบอ่านอย่างเดียว (ห้ามแก้ไข)', async () => {
    await billPage.goto();
    
    // พยายาม Double click ที่ช่องจำนวนเงินในตาราง
    const amountCell = billPage.page.locator('tr').first().locator('td').nth(3);
    await amountCell.dblclick();
    
    // ตรวจสอบว่าไม่มีช่อง Input สำหรับแก้ไขปรากฏขึ้นมา
    await expect(amountCell.locator('input')).not.toBeVisible();
  });


  /** * [ระบบการทำงานร่วมกัน]
   */

  test('TS-Navigation: ตรวจสอบการสลับเมนูไปมาระหว่าง ระบบลูกค้า และ ระบบบิล', async ({ page }) => {
    // ไปหน้าลูกค้า
    await customerPage.goto();
    await expect(page).toHaveURL(/.*customer/);
    
    // ไปหน้าบิล
    await billPage.goto();
    await expect(page).toHaveURL(/.*bill/);
    
    // ตรวจสอบว่าหัวข้อหน้าเปลี่ยนถูกต้อง
    await expect(page.getByText('รายการบิลใบเสร็จ')).toBeVisible();
  });
});