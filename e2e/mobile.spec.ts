import { test, expect } from '@playwright/test';

// モバイルビューポートテスト（iPhone SE: 375×667）
// playwright.config.ts の 'mobile' プロジェクトで実行される

test.describe('モバイルビューポート（375×667）', () => {
  test.beforeEach(async ({ page }) => {
    // モバイルサイズを強制設定（単体実行時のフォールバック）
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
  });

  test('ハンバーガーメニューボタンが表示される', async ({ page }) => {
    const menuBtn = page.getByRole('button', { name: 'メニュー' });
    await expect(menuBtn).toBeVisible();
  });

  test('デスクトップではハンバーガーメニューが非表示', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    const menuBtn = page.getByRole('button', { name: 'メニュー' });
    // lg:hidden クラスで非表示になること
    await expect(menuBtn).toBeHidden();
  });

  test('ハンバーガーメニューをクリックするとサイドバーが開く', async ({ page }) => {
    const menuBtn = page.getByRole('button', { name: 'メニュー' });
    await menuBtn.click();

    // サイドバーが表示されること（translate-x-0 または visible）
    await page.waitForTimeout(300);
    const sidebar = page.locator('aside, nav').filter({ hasText: 'ダッシュボード' });
    await expect(sidebar.first()).toBeVisible({ timeout: 3000 });
  });

  test('サイドバーを閉じることができる', async ({ page }) => {
    const menuBtn = page.getByRole('button', { name: 'メニュー' });
    await menuBtn.click();
    await page.waitForTimeout(300);

    // サイドバー外の領域（右端）をクリックしてオーバーレイを閉じる
    // サイドバーは w-56（224px）なので右側の空き領域をクリック
    await page.mouse.click(350, 400);
    await page.waitForTimeout(300);

    // サイドバーが -translate-x-full に戻ること
    const sidebar = page.locator('aside');
    await expect(sidebar).toHaveClass(/-translate-x-full/, { timeout: 3000 });
  });

  test('モバイルでもページコンテンツが表示される', async ({ page }) => {
    await expect(page.getByText('AVENGERS HQ')).toBeVisible();
    await expect(page.getByText('作戦本部')).toBeVisible();
  });

  test('モバイルで/sendページが正常に表示される', async ({ page }) => {
    await page.goto('/send');
    await expect(page.getByRole('heading', { name: '指示送信' })).toBeVisible();
    await expect(page.locator('select')).toBeVisible();
    await expect(page.locator('textarea')).toBeVisible();
  });

  test('モバイルで/inboxページが正常に表示される', async ({ page }) => {
    await page.goto('/inbox');
    await expect(page.getByRole('heading', { name: '受信ボックス' })).toBeVisible();
    // エージェントタブコンテナが表示されること
    const tabContainer = page.locator('.flex.flex-wrap').first();
    await expect(tabContainer).toBeVisible();
  });
});
