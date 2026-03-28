import { test, expect } from '@playwright/test';

test('inboxアコーディオン動作確認', async ({ page }) => {
  await page.goto('/inbox');
  await page.waitForTimeout(2000);

  // div.rounded-lg.border でメッセージカードのみ選択（タブボタンを除外）
  const cards = page.locator('div.rounded-lg.border');
  const count = await cards.count();
  console.log('メッセージカード数:', count);

  const targetCard = cards.first();
  await targetCard.scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);

  // 展開前: 本文非表示を確認
  const bodyText = targetCard.locator('p.whitespace-pre-wrap');
  const beforeVisible = await bodyText.isVisible().catch(() => false);
  console.log('展開前 本文:', beforeVisible ? '表示中' : '非表示 ✅');

  // ヘッダーボタンクリック（展開）
  await targetCard.locator('button').first().click({ timeout: 10000 });
  await page.waitForTimeout(400);

  // 展開後: 本文表示を確認
  await expect(bodyText).toBeVisible({ timeout: 5000 });
  console.log('展開後 本文: ✅ 表示（アコーディオン展開動作OK）');

  // アニメーション確認
  const expandDiv = targetCard.locator('.overflow-hidden').first();
  const expandClass = await expandDiv.getAttribute('class');
  console.log('展開クラス:', expandClass?.includes('max-h-[600px]') ? '✅ max-h-[600px] 適用' : expandClass);
  console.log('アニメーション:', expandClass?.includes('transition-all') ? '✅ transition-all あり' : '❌');

  // 既読ボタン確認
  const markReadBtn = targetCard.locator('button', { hasText: '既読にする' });
  const hasMarkRead = await markReadBtn.count() > 0;
  console.log('既読ボタン:', hasMarkRead ? '✅ あり' : '既読済みのため非表示');

  if (hasMarkRead) {
    await markReadBtn.click({ timeout: 5000 });
    await page.waitForTimeout(500);
    console.log('既読ボタンクリック: ✅ 実行');
  }

  // 再クリックで閉じる
  await targetCard.locator('button').first().click({ timeout: 10000 });
  await page.waitForTimeout(400);
  const afterClose = await bodyText.isVisible().catch(() => false);
  console.log('閉じた後 本文:', afterClose ? '❌ まだ表示' : '✅ 非表示（閉じる動作OK）');

  // 全体スクリーンショット
  await page.screenshot({ path: '/tmp/inbox-accordion-final.png' });
  console.log('スクリーンショット保存済み');
});
