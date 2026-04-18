import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { HelpCenterPage } from '../pages/HelpCenterPage';
import { SettingsPage } from '../pages/SettingsPage';

test.describe('Help Center & Settings System - STABLE', () => {

  // ✅ TC1 (ของเดิม OK)
  test('TC_HELP_01 | ต้องมีเมนู help center ครบ', async ({ page }) => {
    const login = new LoginPage(page);
    const help = new HelpCenterPage(page);

    await login.goto();
    await login.login('Treble2561', '087456123a');
    await help.goto();

    await expect(help.helpItems.receive).toBeVisible();
    await expect(help.helpItems.products).toBeVisible();
    await expect(help.helpItems.inventory).toBeVisible();
    await expect(help.helpItems.purchase).toBeVisible();
    await expect(help.helpItems.customer).toBeVisible();
    await expect(help.helpItems.bill).toBeVisible();
  });


  // 🔥 NEW TC2 (แทน popup → check redirect)
  test('TC_HELP_02_FIX | เข้า help center ตรง → ต้อง redirect ไป login', async ({ page }) => {

    await page.goto('http://localhost:3000/help-center');

    await expect(page).toHaveURL(/login/);
    await expect(page.getByRole('button', { name: 'เข้าสู่ระบบ' })).toBeVisible();
  });


  // 🔥 FIXED TC3 (ใช้ text เต็มจาก codegen)
  test('TC_SET_01_FIX | Settings ต้องมีเมนูครบ (ใช้ locator จริง)', async ({ page }) => {

    const login = new LoginPage(page);
    const settings = new SettingsPage(page);

    await login.goto();
    await login.login('Treble2561', '087456123a');
    await settings.goto();

    await expect(page.getByText('ข้อมูลพื้นฐานตั้งค่าชื่อร้าน โลโก้')).toBeVisible();
    await expect(page.getByText('การเชื่อมต่ออุปกรณ์')).toBeVisible();
    await expect(page.getByText('โหมดปัดราคา')).toBeVisible();
    await expect(page.getByText('จัดการหมวดหมู่สินค้า')).toBeVisible();
    await expect(page.getByText('ประวัติราคาสินค้า')).toBeVisible();
  });


  // ✅ TC4 (ของเดิม OK แต่เพิ่มความชัวร์)
  test('TC_SET_02 | ต้องมีหมวดหมู่สินค้า', async ({ page }) => {

    const login = new LoginPage(page);
    const settings = new SettingsPage(page);

    await login.goto();
    await login.login('Treble2561', '087456123a');

    await settings.goto();
    await settings.openCategory();

    // ใช้จาก codegen จริง: test1กระดาษแก้ว
    await expect(page.getByText('กระดาษ')).toBeVisible();
  });


  // 🔥 NEW TC5 (แทน popup → redirect)
  test('TC_SET_03_FIX | เข้า settings ตรง → ต้องไปหน้า login', async ({ page }) => {

    await page.goto('http://localhost:3000/settings');

    await expect(page).toHaveURL(/login/);
    await expect(page.getByRole('button', { name: 'เข้าสู่ระบบ' })).toBeVisible();
  });

});