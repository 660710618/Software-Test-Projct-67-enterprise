import { test, expect } from '@playwright/test';

test.describe('Login + showproduct', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/login');
  });

  // -------------------------------
  // TC-001: Login success
  // -------------------------------
  test('TC-001: เข้าสู่ระบบด้วยข้อมูลที่ถูกต้อง', async ({ page }) => {
    await page.getByRole('textbox', { name: 'ชื่อผู้ใช้' }).fill('treble2561');
    await page.getByRole('textbox', { name: 'รหัสผ่าน' }).fill('087456123a');
    await page.getByRole('button', { name: 'เข้าสู่ระบบ' }).click();

    await expect(page).toHaveURL(/.*products/);
  });

  // -------------------------------
  // TC-002: ไม่กรอกรหัสผ่าน
  // -------------------------------
  test('TC-002: ไม่กรอกรหัสผ่าน', async ({ page }) => {
    await page.getByRole('textbox', { name: 'ชื่อผู้ใช้' }).fill('treble2561');
    await page.getByRole('button', { name: 'เข้าสู่ระบบ' }).click();

    await expect(
      page.getByText('กรุณากรอกชื่อผู้ใช้และรหัสผ่าน')
    ).toBeVisible();
  });

  // -------------------------------
  // TC-003: รหัสผ่านผิด
  // -------------------------------
  test('TC-003: กรอกรหัสผ่านผิด', async ({ page }) => {
    await page.getByRole('textbox', { name: 'ชื่อผู้ใช้' }).fill('treble2561');
    await page.getByRole('textbox', { name: 'รหัสผ่าน' }).fill('9999');
    await page.getByRole('button', { name: 'เข้าสู่ระบบ' }).click();

    await expect(
      page.getByText('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง')
    ).toBeVisible();
  });

  // -------------------------------
  // TC-004: ค้นหาสินค้า
  // -------------------------------
  test('TC-004: ค้นหาสินค้า "ขวดแก้ว"', async ({ page }) => {
    await page.getByRole('textbox', { name: 'ชื่อผู้ใช้' }).fill('treble2561');
    await page.getByRole('textbox', { name: 'รหัสผ่าน' }).fill('087456123a');
    await page.getByRole('button', { name: 'เข้าสู่ระบบ' }).click();

    await page.getByRole('textbox', { name: 'ค้นหาสินค้า' }).fill('ขวดแก้ว');

    await expect(
        page.locator('div').filter({ hasText: 'ขวดแก้ว3.00 บาท' }).nth(5)
    ).toBeVisible();
  });

  // -------------------------------
  // TC-005: เลือกหมวดหมู่
  // -------------------------------
  test('TC-005: เลือกหมวดหมู่ "กระดาษ"', async ({ page }) => {
    await page.getByRole('textbox', { name: 'ชื่อผู้ใช้' }).fill('treble2561');
    await page.getByRole('textbox', { name: 'รหัสผ่าน' }).fill('087456123a');
    await page.getByRole('button', { name: 'เข้าสู่ระบบ' }).click();

    await page.getByRole('combobox').selectOption('2');

    await expect(
        page.locator('div').filter({ hasText: 'ลังกระดาษ2.50 บาท' }).nth(5)
    ).toBeVisible();
  });

  // -------------------------------
  // TC-006: ค้นหา special char
  // -------------------------------
  test('TC-006: ค้นหา @#$%', async ({ page }) => {
    await page.getByRole('textbox', { name: 'ชื่อผู้ใช้' }).fill('treble2561');
    await page.getByRole('textbox', { name: 'รหัสผ่าน' }).fill('087456123a');
    await page.getByRole('button', { name: 'เข้าสู่ระบบ' }).click();

    await page.getByRole('textbox', { name: 'ค้นหาสินค้า' }).fill('@#$%');

    await expect(
      page.getByText('ไม่พบสินค้า ที่ตรงกับ “@#$%” ในหมวดที่เลือก')
    ).toBeVisible();
  });

});