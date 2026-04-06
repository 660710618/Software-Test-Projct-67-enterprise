import { Page, Locator, expect } from '@playwright/test';

export class CustomerPage {
    readonly page: Page;
    readonly menuCustomer: Locator;
    readonly searchInput: Locator;
    readonly customerTable: Locator;

    constructor(page: Page) {
        this.page = page;
        this.menuCustomer = page.locator('div').filter({ hasText: /^ลูกค้า$/ });
        this.searchInput = page.getByPlaceholder('ค้นหาลูกค้า');
        this.customerTable = page.locator('table');
    }

    async goto() {
        await this.menuCustomer.click();
        await expect(this.page.getByText('รายชื่อลูกค้า')).toBeVisible();
    }

    async search(name: string) {
        await this.searchInput.fill(name);
        await this.page.keyboard.press('Enter');
    }

    async expectCustomerData(name: string, address: string) {
        await expect(this.page.getByText(name)).toBeVisible();
        await expect(this.page.getByText(address)).toBeVisible();
    }
}