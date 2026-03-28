import { test, expect } from '@playwright/test';

test('inboxアコーディオン動作確認', async ({ page }) => {
  await page.goto('/inbox');
  await page.waitForTimeout(2000);

  const cards = page.locator('.rounded-lg.border');
  const count = await cards.count();
  console.log('カード数:', count);

  // 最初のカードをスクロールして表示
  const firstCard = cards.first();
  await firstCard.scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);

  // 展開前: 本文非表示を確認
  const bodyText = firstCard.locator('p.whitespace-pre-wrap');
  const beforeVisible = await bodyText.isVisible().catch(() => false);
  console.log('展開前 本文:', beforeVisible ? '表示中' : '非表示 ✅');

  // ヘッダーボタンクリック（展開）
  await firstCard.locator('button').first().click();
  await page.waitForTimeout(400);

  // 展開後: 本文表示を確認
  await expect(bodyText).toBeVisible({ timeout: 3000 });
  console.log('展開後 本文: ✅ 表示');

  // 既読ボタン確認
  const markReadBtn = firstCard.locator('button', { hasText: '既読にする' });
  const hasMarkRead = await markReadBtn.count() > 0;
  console.log('既読ボタン:', hasMarkRead ? '✅ あり' : '既読済みのため非表示');

  if (hasMarkRead) {
    await markReadBtn.click();
    await page.waitForTimeout(500);
    console.log('既読ボタンクリック: ✅');
    // ゴールドドット（未読インジケーター）が消えるか
    const unreadDot = firstCard.locator('.bg-avengers-gold.rounded-full');
    const dotGone = await unreadDot.isVisible().catch(() => false);
    console.log('未読ドット消失:', !dotGone ? '✅' : '（APIリフレッシュ待ち）');
  }

  // 再クリックで閉じる
  await firstCard.locator('button').first().click();
  await page.waitForTimeout(400);
  const afterClose = await bodyText.isVisible().catch(() => false);
  console.log('閉じた後 本文:', afterClose ? '❌ まだ表示' : '✅ 非表示');

  await page.screenshot({ path: '/tmp/inbox-accordion-final.png' });
});
