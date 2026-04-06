import { test, expect } from '@playwright/test';
import { HelpPage } from '../pages/HelpPage';
import { SettingsPage } from '../pages/SettingsPage';

test.describe('Scrap Shop System - Help & Settings Tests', () => {
  let helpPage: HelpPage;
  let settingsPage: SettingsPage;

  test.beforeEach(async ({ page }) => {
    // จำลองการเข้าสู่ระบบสำเร็จตาม Pre-condition [6, 11]
    await page.goto('http://localhost/login');
    await page.fill('#user', 'admin');
    await page.fill('#pass', '1234');
    await page.click('button#login');
    helpPage = new HelpPage(page);
    settingsPage = new SettingsPage(page);
  });

  // 📖 กลุ่มที่ 1: ศูนย์ช่วยเหลือ (Help Center)
  test.describe('Help Center Tests', () => {
    test('TC-HELP-01: สามารถเข้าสู่หน้าศูนย์ช่วยเหลือได้ถูกต้อง', async () => {
      await helpPage.goto();
      await expect(helpPage.helpTitle).toBeVisible(); // [6]
    });

    test('TC-HELP-02: แสดงคำแนะนำหน้ารับซื้อสินค้าถูกต้อง', async () => {
      await helpPage.goto();
      await helpPage.viewHelpTopic('purchases');
      await expect(page.getByText('วิธีเปิดบิล')).toBeVisible(); // [6]
    });

    test('TC-HELP-06 (Negative): ผู้ไม่ได้รับอนุญาตต้องถูก Redirect ไปหน้า Login', async ({ page, context }) => {
      await context.clearCookies(); // จำลองไม่ได้ Login [8]
      await page.goto('http://localhost/help');
      await expect(page).toHaveURL(/.*login/);
    });
  });

  // ⚙️ กลุ่มที่ 2: ตั้งค่า (Settings System)
  test.describe('Settings System Tests', () => {
    test('TC-SET-03: สามารถบันทึกชื่อร้านใหม่ได้', async () => {
      await settingsPage.goto();
      await settingsPage.updateStoreName('ร้านของเก่ารวยมาก', 'Rich Scrap Shop');
      await expect(page.getByText('บันทึกสำเร็จ')).toBeVisible(); // [12]
    });

    test('TC-SET-12 (Negative): ป้องกันการอัปโหลดไฟล์อันตราย (.exe)', async () => {
      await settingsPage.goto();
      await settingsPage.uploadLogo('./test_files/test.exe');
      await expect(page.getByText('รูปแบบไฟล์ไม่ถูกต้อง')).toBeVisible(); // [16]
    });

    test('TC-SET-15 (Negative): แจ้งเตือนเมื่อเว้นว่างชื่อร้านค้า', async () => {
      await settingsPage.goto();
      await settingsPage.updateStoreName('', '');
      await expect(page.getByText('กรุณากรอกชื่อร้านค้า')).toBeVisible(); // [17]
    });
  });
});