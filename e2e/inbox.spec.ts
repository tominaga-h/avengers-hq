import { test, expect } from '@playwright/test';

test.describe('受信ボックス（/inbox）', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/inbox');
  });

  test('ページタイトルが表示される', async ({ page }) => {
    await expect(page.getByRole('heading', { name: '受信ボックス' })).toBeVisible();
  });

  test('エージェントタブが7つ表示される', async ({ page }) => {
    const agentNames = ['JARVIS', 'IRON MAN', 'HULK', 'CAPTAIN AMERICA', 'CAPTAIN MARVEL', 'SPIDER-MAN', 'STAR-LORD'];
    for (const name of agentNames) {
      await expect(page.getByRole('button', { name: new RegExp(name) })).toBeVisible();
    }
  });

  test('デフォルトでJARVISタブが選択されている', async ({ page }) => {
    const jarvisTab = page.getByRole('button', { name: /JARVIS/ });
    await expect(jarvisTab).toHaveClass(/avengers-gold/);
  });

  test('エージェントタブの切り替えが動作する', async ({ page }) => {
    const hulkTab = page.getByRole('button', { name: /HULK/ });
    await hulkTab.click();
    await expect(hulkTab).toHaveClass(/avengers-gold/);

    // 他のタブはアクティブでないこと
    const jarvisTab = page.getByRole('button', { name: /JARVIS/ });
    await expect(jarvisTab).not.toHaveClass(/avengers-gold/);
  });

  test('メッセージ一覧エリアが表示される', async ({ page }) => {
    // InboxViewerコンテナが存在すること
    const container = page.locator('.bg-shield-card').last();
    await expect(container).toBeVisible();
  });

  test('全エージェントのinboxを切り替えできる', async ({ page }) => {
    const agentIds = ['JARVIS', 'IRON MAN', 'HULK', 'CAPTAIN AMERICA', 'CAPTAIN MARVEL', 'SPIDER-MAN', 'STAR-LORD'];
    for (const name of agentIds) {
      const tab = page.getByRole('button', { name: new RegExp(name) });
      await tab.click();
      await expect(tab).toHaveClass(/avengers-gold/);
      await page.waitForTimeout(300);
    }
  });

  test('ベルアイコンからinboxへのリンクが存在する', async ({ page }) => {
    await page.goto('/');
    const bellLink = page.locator('a[href="/inbox"]');
    await expect(bellLink.first()).toBeVisible();
  });
});
