import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login-page';
import { ProductPage } from '../pages/product-page';

test.describe('Scrap Shop System', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('https://your-scrap-shop-url.com'); 
  });

  //  LOGIN PAGE
  test.describe('Login Page Tests', () => {
    let loginPage: LoginPage;

    test.beforeEach(async ({ page }) => {
      loginPage = new LoginPage(page);
    });

    //  Positive
    test('TC_LG_01: Valid Login', async ({ page }) => {
      await loginPage.login('admin', '1234');
      await expect(page).toHaveURL(/products/);
    });

    //  Positive
    test('TC_LG_02: Toggle Password Visibility', async () => {
      await loginPage.passwordInput.fill('1234');
      await loginPage.togglePassword();
      await expect(loginPage.passwordInput).toHaveAttribute('type', 'text');
    });

    //  Negative
    test('TC_LG_05: Empty Password', async ({ page }) => {
      await loginPage.login('admin', '');
      await expect(page.getByText('กรุณากรอกข้อมูล')).toBeVisible();
    });
  });

  //  PRODUCT PAGE
  test.describe('Product Page Tests', () => {
    let loginPage: LoginPage;
    let productPage: ProductPage;

    test.beforeEach(async ({ page }) => {
      loginPage = new LoginPage(page);
      productPage = new ProductPage(page);

      await loginPage.login('admin', '1234');
    });

    //  Positive
    test('TC_PD_01: Search Valid Product', async () => {
      await productPage.searchProduct('ขวดแก้ว');
      await expect(productPage.productCard).toBeVisible();
    });

    //  Positive
    test('TC_PD_02: Filter Product Category', async () => {
      await productPage.selectCategory('ทองแดง');
      await expect(productPage.page.getByText('ทองแดง')).toBeVisible();
    });
    
    //  Negative
    test('TC_PD_04: Search Invalid Product', async () => {
      await productPage.searchProduct('พัดลม');
      await expect(productPage.page.getByText('ไม่พบข้อมูล')).toBeVisible();
    });
  });
});

