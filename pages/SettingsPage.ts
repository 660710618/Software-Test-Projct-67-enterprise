import { Page, Locator } from '@playwright/test';

export class SettingsPage {
  readonly page: Page;
  readonly settingsMenu: Locator;
  readonly basicInfoOption: Locator;
  readonly thaiNameInput: Locator;
  readonly engNameInput: Locator;
  readonly saveStoreButton: Locator;
  readonly logoInput: Locator;
  readonly cameraDropdown: Locator;
  readonly saveCameraButton: Locator;

  constructor(page: Page) {
    this.page = page;
    // กำหนด Locators ตาม ts2.txt [11-13]
    this.settingsMenu = page.getByRole('link', { name: 'ตั้งค่า - System' });
    this.basicInfoOption = page.getByText('ข้อมูลพื้นฐาน');
    this.thaiNameInput = page.locator('input[name="storeNameThai"]');
    this.engNameInput = page.locator('input[name="storeNameEng"]');
    this.saveStoreButton = page.getByRole('button', { name: 'บันทึกข้อมูลร้าน' });
    this.logoInput = page.locator('input[type="file"]');
    this.cameraDropdown = page.getByRole('combobox', { name: 'เลือกกล้อง' });
    this.saveCameraButton = page.getByRole('button', { name: 'บันทึกค่า' });
  }

  async goto() {
    await this.settingsMenu.click();
  }

  // Action: บันทึกชื่อร้าน [12]
  async updateStoreName(thai: string, eng: string) {
    await this.basicInfoOption.click();
    await this.thaiNameInput.fill(thai);
    await this.engNameInput.fill(eng);
    await this.saveStoreButton.click();
  }

  // Action: อัปโหลดโลโก้ [12]
  async uploadLogo(filePath: string) {
    await this.basicInfoOption.click();
    await this.logoInput.setInputFiles(filePath);
    await this.saveStoreButton.click();
  }
}