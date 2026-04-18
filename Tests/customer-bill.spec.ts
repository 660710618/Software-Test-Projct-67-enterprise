import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3000';
const CREDENTIALS = {
  username: 'Treble2561',
  password: '087456123a'
};
test.beforeEach(async ({ page }) => {
  await page.goto(`${BASE_URL}/login`);
  await page.getByRole('textbox', { name: 'ชื่อผู้ใช้' }).fill(CREDENTIALS.username);
  await page.getByRole('textbox', { name: 'รหัสผ่าน' }).fill(CREDENTIALS.password);
  await page.getByRole('button', { name: 'เข้าสู่ระบบ' }).click();
});

test.describe('Customer Management', () => {
  
  // ก่อนเริ่มเทสต์ในหมวดนี้ ให้ไปที่หน้าลูกค้าก่อนเสมอ
  test.beforeEach(async ({ page }) => {
    await page.getByRole('link', { name: 'ลูกค้า' }).click();
  });

  test('TC-01: Search existing customer', async ({ page }) => {
    await page.getByRole('textbox', { name: 'ค้นหาลูกค้า' }).fill('พร');
    await page.getByText('น.ส.พรพรรณษา โกฏค้างพลู').click();
  });

  test('TC-02: Search non-existing customer', async ({ page }) => {
    await page.getByRole('textbox', { name: 'ค้นหาลูกค้า' }).fill('ธน');
    await expect(page.getByRole('cell', { name: 'ไม่พบข้อมูลลูกค้า' })).toBeVisible();
  });

  test('TC-03: Search using spacebar', async ({ page }) => {
    await page.getByRole('textbox', { name: 'ค้นหาลูกค้า' }).fill('     ');
    await page.getByText('น.ส.พรพรรณษา โกฏค้างพลู').click();
  });
});
test.describe('Receipt Management', () => {

  // ก่อนเริ่มเทสต์ในหมวดนี้ ให้ไปที่หน้าบิลใบเสร็จก่อนเสมอ
  test.beforeEach(async ({ page }) => {
    await page.getByRole('link', { name: 'บิลใบเสร็จ' }).click();
  });

  test('TC-04: View receipt default list', async ({ page }) => {
    await page.locator('div').filter({ hasText: 'เลขบิลวันที่เวลาจำนวนเงินประเภทเงินรายละเอียด#507/04/202616:248เงินโอนดูบิล#407' }).nth(4).click();
  });

  test('TC-05: Filter receipt by valid date', async ({ page }) => {
    await page.getByRole('button', { name: 'เลือกวันที่' }).click();
    
    await page.getByRole('textbox', { name: 'วว/ดด/ปปปป' }).first().click();
    await page.getByRole('gridcell', { name: 'Choose วันอังคารที่ 7 เมษายน' }).click();
    
    await page.getByRole('textbox', { name: 'วว/ดด/ปปปป' }).nth(1).click();
    await page.getByRole('gridcell', { name: 'Choose วันอังคารที่ 7 เมษายน' }).click();
    
    await page.getByRole('button', { name: 'ตกลง' }).click();
    await page.locator('div').filter({ hasText: 'เลขบิลวันที่เวลาจำนวนเงินประเภทเงินรายละเอียด#507/04/202616:248เงินโอนดูบิล#407' }).nth(4).click();
  });

  test('TC-06: Filter receipt by date with no data', async ({ page }) => {
    await page.getByRole('button', { name: 'เลือกวันที่' }).click();
    
    await page.getByRole('textbox', { name: 'วว/ดด/ปปปป' }).first().click();
    await page.getByRole('gridcell', { name: 'Choose วันพุธที่ 8 เมษายน' }).click();
    
    await page.getByRole('textbox', { name: 'วว/ดด/ปปปป' }).nth(1).click();
    await page.getByRole('gridcell', { name: 'Choose วันพุธที่ 8 เมษายน' }).click();
    
    await page.getByRole('button', { name: 'ตกลง' }).click();
    
    await expect(page.getByRole('cell', { name: 'ไม่พบข้อมูลบิลใบเสร็จ' })).toBeVisible();
  });

  test('TC-07: Click to view receipt popup', async ({ page }) => {
    await page.getByRole('row', { name: '#5 07/04/2026 16:24 8' }).getByRole('button').click();
  });

  test('TC-08: View receipt total and image', async ({ page }) => {
    await page.getByRole('row', { name: '#5 07/04/2026 16:24 8' }).getByRole('button').click();
    await page.getByRole('img', { name: 'receipt' }).click();
  });
});