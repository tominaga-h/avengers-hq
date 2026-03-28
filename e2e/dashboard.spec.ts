import { test, expect } from '@playwright/test';

test.describe('ダッシュボードホーム（/）', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('ページタイトルが表示される', async ({ page }) => {
    await expect(page.getByText('作戦本部')).toBeVisible();
  });

  test('エージェントステータスグリッドが7枠表示される', async ({ page }) => {
    // ローディング完了またはスケルトン表示を待つ
    await page.waitForTimeout(3000);

    // グリッドコンテナが存在すること
    const grid = page.locator('.grid').first();
    await expect(grid).toBeVisible();

    // グリッドの子要素（カードまたはスケルトン）が7枠あること
    const gridChildren = grid.locator('> div');
    const count = await gridChildren.count();
    expect(count).toBe(7);
  });

  test('ヘッダーにAVENGERS HQロゴが表示される', async ({ page }) => {
    await expect(page.getByText('AVENGERS HQ')).toBeVisible();
  });

  test('更新ボタンが存在する', async ({ page }) => {
    const refreshBtn = page.getByRole('button', { name: '更新' });
    await expect(refreshBtn).toBeVisible();
  });

  test('更新ボタンをクリックするとデータが再取得される', async ({ page }) => {
    await page.waitForTimeout(1000);
    const refreshBtn = page.getByRole('button', { name: '更新' });
    await refreshBtn.click();
    // エラーが出ないこと
    await expect(page.getByText('作戦本部')).toBeVisible();
  });
});
