import { test, expect } from '@playwright/test';

test.describe('ระบบจัดการร้านรับซื้อของเก่า - หน้ารับซื้อสินค้าและระบุตัวตน', async () => {

  test.beforeEach(async ({ page }) => {
    // ให้เปิดหน้าเว็บก่อนเริ่มเทสทุกข้อ
    await page.goto('http://localhost:3000/login');
    await page.getByRole('textbox', { name: 'ชื่อผู้ใช้' }).click();
    await page.getByRole('textbox', { name: 'ชื่อผู้ใช้' }).fill('Treble2561')
    await page.getByRole('textbox', { name: 'รหัสผ่าน' }).click();
    await page.getByRole('textbox', { name: 'รหัสผ่าน' }).fill('087456123a');
    await page.getByRole('button', { name: 'เข้าสู่ระบบ' }).click();
    await page.getByRole('link', { name: 'รับซื้อสินค้า' }).click();
  });

  // ---------------------------------------------------------
  // Test 1: TC-001 (ตรวจสอบการแสดงผลตัวเลือกระบุตัวตน)
  // ---------------------------------------------------------
  test('TC-001: ควรแสดงตัวเลือกระบุตัวตนครบทั้ง 3 รูปแบบ', async ({ page }) => {
    // คาดหวังว่าปุ่มตัวเลือกระบุตัวตนทั้ง 3 ปุ่มจะต้องแสดงอยู่บนหน้าจอ
    await expect(page.getByRole('button', { name: 'ระบุตัวตน ระบุตัวตน' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'ไม่ระบุตัวตน ไม่ระบุตัวตน' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'ลูกค้า ลูกค้า' })).toBeVisible();
  });

  // ---------------------------------------------------------
  // Test 2: TC-012 (ค้นหาชื่อลูกค้าที่มีในระบบ)
  // ---------------------------------------------------------
  test('TC-012: ควรค้นหาข้อมูลลูกค้าเดิมในระบบเจออย่างถูกต้อง', async ({ page }) => {
    // 1. คลิกเลือกปุ่ม "ลูกค้า"
    await page.getByRole('button', { name: 'ลูกค้า ลูกค้า' }).click();
    
    // 2. พิมพ์ชื่อลูกค้าในช่องค้นหา
    await page.getByRole('textbox', { name: 'ค้นหาลูกค้า' }).click();
    await page.getByRole('textbox', { name: 'ค้นหาลูกค้า' }).fill('พรพรรณษา');
    
    // 3. ตรวจสอบผลลัพธ์ว่าในตาราง/รายการ มีชื่อที่ค้นหาแสดงขึ้นมา
    await page.getByRole('cell', { name: 'น.ส.พรพรรณษา โกฎค้างพลู' }).click()
    await expect(page.getByRole('cell', { name: 'น.ส.พรพรรณษา โกฎค้างพลู' })).toBeVisible();
  });

  // ---------------------------------------------------------
  // Test 3: TC-016 (เลือกสินค้าเพื่อกรอกรายละเอียด)
  // ---------------------------------------------------------
  test('TC-016: คลิกเลือกสินค้าแล้วควรมีหน้าต่าง (Popup) รายละเอียดแสดงขึ้นมา', async ({ page }) => {
    
    // 1. คลิกเลือกปุ่ม "ไม่ระบุตัวตน"
    await page.getByRole('button', { name: 'ไม่ระบุตัวตน ไม่ระบุตัวตน' }).click();
    await page.getByRole('button', { name: 'บันทึกรูป' }).click();
    await page.getByRole('button', { name: 'ยืนยัน' }).click();

    // 2. ตรวจสอบว่า Popup รายละเอียดการรับซื้อแสดงขึ้นมา
    await expect(page.getByRole('heading', { name: 'ขวดแก้ว' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'ลังกระดาษ' })).toBeVisible();
    await expect(page.getByText('ขวดแก้ว3.00 บาท')).toBeVisible();
    await expect(page.getByText('ลังกระดาษ2.50 บาท')).toBeVisible();
  });

  // ---------------------------------------------------------
  // Test 4: TC-019 (กรอกน้ำหนักด้วยตนเอง Positive Case)
  // ---------------------------------------------------------
  test('TC-019: ควรคำนวณราคารวมได้ถูกต้องเมื่อกรอกน้ำหนักด้วยตนเอง', async ({ page }) => {
    // 1. คลิกเลือกสินค้า "ขวดแก้ว" (ราคา 3 บาท/กก.)
    await page.getByRole('button', { name: 'ไม่ระบุตัวตน ไม่ระบุตัวตน' }).click();
    await page.getByRole('button', { name: 'บันทึกรูป' }).click();
    await page.getByRole('button', { name: 'ยืนยัน' }).click();
    await page.getByText('ขวดแก้ว3.00 บาท').click();
    await page.getByRole('button', { name: 'บันทึกรูป' }).click();
    // 2. กรอกน้ำหนักด้วยตนเอง
    await page.getByPlaceholder('เช่น').click();
    await page.getByPlaceholder('เช่น').fill('10');
    await page.getByRole('button', { name: 'ยืนยัน' }).click();

    // 3. ตรวจสอบราคารวม (สมมติราคาหน่วยคือ 3 บาท 10 * 3 = 30.00);
    await expect(page.getByText('ยอดรวม30.00 บาท')).toBeVisible();
  });

  // ---------------------------------------------------------
  // Test 5: TC-024 (กดยืนยันโดยไม่ใส่น้ำหนัก Negative Case)
  // ---------------------------------------------------------
  test('TC-024: ไม่ควรบันทึกสินค้าระบุตัวบิลได้ หากไม่ได้ระบุน้ำหนัก (น้ำหนัก=0)', async ({ page }) => {
    // *สเต็ปเตรียมความพร้อมก่อนเข้าสู่หน้าเพิ่มสินค้า*
    await page.getByRole('link', { name: 'รับซื้อสินค้า' }).click();
    await page.getByRole('button', { name: 'ไม่ระบุตัวตน ไม่ระบุตัวตน' }).click();
    await page.getByRole('button', { name: 'บันทึกรูป' }).click();
    await page.getByRole('button', { name: 'ยืนยัน' }).click();
    await page.getByText('ขวดแก้ว3.00 บาท').click();
    await page.getByRole('button', { name: 'บันทึกรูป' }).click();
    // 2. ตรวจสอบว่ามี Alert/Toast แจ้งเตือนข้อผิดพลาด
    await expect(page.getByRole('button', { name: 'ยืนยัน' })).toBeDisabled();
  });
});
