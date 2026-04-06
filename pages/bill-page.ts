import { Page, Locator, expect } from '@playwright/test';

export class BillPage {
    readonly page: Page;
    readonly menuBill: Locator;
    readonly dateFilterButton: Locator;
    readonly modalDetail: Locator;

    constructor(page: Page) {
        this.page = page;
        this.menuBill = page.locator('div').filter({ hasText: /^บิลใบเสร็จ$/ });
        this.dateFilterButton = page.getByRole('button', { name: 'เลือกวันที่' });
        this.modalDetail = page.locator('div.modal, [role="dialog"]');
    }

    async goto() {
        await this.menuBill.click();
        await expect(this.page.getByText('รายการบิลใบเสร็จ')).toBeVisible();
    }

    async openBillDetail(billNo: string) {
        const row = this.page.locator('tr').filter({ hasText: billNo });
        await row.getByRole('button', { name: 'ดูบิล' }).click();
    }

    async filterByDate(date: string) {
        await this.dateFilterButton.click();
        const dateInput = this.page.locator('input[type="date"]');
        await dateInput.fill(date);
        await this.page.keyboard.press('Enter');
    }

    async expectTotal(amount: string) {
        await expect(this.modalDetail).toBeVisible();
        await expect(this.modalDetail.getByText(amount)).toBeVisible();
    }
}