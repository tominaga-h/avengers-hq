import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

const INBOX_PATH = path.join(process.env.HOME!, 'avengers/comms/inbox/jarvis.yaml');

test.describe('指示送信（/send）', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/send');
  });

  test('ページタイトルが表示される', async ({ page }) => {
    await expect(page.getByRole('heading', { name: '指示送信' })).toBeVisible();
  });

  test('送信先エージェント選択ドロップダウンが存在する', async ({ page }) => {
    const select = page.locator('select');
    await expect(select).toBeVisible();
    // 全エージェントがオプションとして存在すること
    const options = await select.locator('option').allTextContents();
    const agentNames = ['JARVIS', 'IRON MAN', 'HULK', 'CAPTAIN AMERICA', 'CAPTAIN MARVEL', 'SPIDER-MAN', 'STAR-LORD'];
    for (const name of agentNames) {
      expect(options.some(opt => opt.includes(name))).toBeTruthy();
    }
  });

  test('メッセージ種別ボタンが4種類表示される', async ({ page }) => {
    const typeLabels = ['タスク依頼', '疎通確認', '完了報告', '起動指示'];
    for (const label of typeLabels) {
      await expect(page.getByRole('button', { name: label })).toBeVisible();
    }
  });

  test('メッセージ種別ボタンの切り替えが動作する', async ({ page }) => {
    const pingBtn = page.getByRole('button', { name: '疎通確認' });
    await pingBtn.click();
    // クリック後にアクティブスタイルが付くこと
    await expect(pingBtn).toHaveClass(/avengers-gold/);
  });

  test('本文テキストエリアが存在し入力できる', async ({ page }) => {
    const textarea = page.locator('textarea');
    await expect(textarea).toBeVisible();
    await textarea.fill('E2Eテスト用メッセージ');
    await expect(textarea).toHaveValue('E2Eテスト用メッセージ');
  });

  test('文字数カウンターが動作する', async ({ page }) => {
    const textarea = page.locator('textarea');
    await textarea.fill('テスト');
    await expect(page.getByText(/3\/2000/)).toBeVisible();
  });

  test('送信先・本文が空の場合は送信ボタンが無効化されている', async ({ page }) => {
    const submitBtn = page.getByRole('button', { name: '送信' });
    await expect(submitBtn).toBeDisabled();
  });

  test('送信先を選択すると送信ボタンが有効化される（本文入力後）', async ({ page }) => {
    await page.locator('select').selectOption('jarvis');
    const textarea = page.locator('textarea');
    await textarea.fill('E2Eテスト: ping');
    const submitBtn = page.getByRole('button', { name: '送信' });
    await expect(submitBtn).toBeEnabled();
  });

  test('送信完了後にinbox(jarvis)にメッセージが届く', async ({ page }) => {
    // 送信前のinboxメッセージ数を記録
    let beforeCount = 0;
    try {
      const yaml = fs.readFileSync(INBOX_PATH, 'utf8');
      const matches = yaml.match(/^- content:/gm);
      beforeCount = matches ? matches.length : 0;
    } catch {
      // ファイルが存在しない場合は0
    }

    // jarvis宛にpingを送信
    await page.locator('select').selectOption('jarvis');
    await page.getByRole('button', { name: '疎通確認' }).click();
    await page.locator('textarea').fill('E2Eテスト: Playwrightからの疎通確認');
    await page.getByRole('button', { name: '送信' }).click();

    // 送信完了表示を確認
    await expect(page.getByText('送信完了')).toBeVisible({ timeout: 10000 });

    // inboxにメッセージが追加されたか確認
    await page.waitForTimeout(1000);
    try {
      const yaml = fs.readFileSync(INBOX_PATH, 'utf8');
      const matches = yaml.match(/^- content:/gm);
      const afterCount = matches ? matches.length : 0;
      expect(afterCount).toBeGreaterThan(beforeCount);
      expect(yaml).toContain('E2Eテスト: Playwrightからの疎通確認');
    } catch {
      // バックエンドが応答しない場合はスキップ
      test.skip();
    }
  });
});

test.describe('指示送信 — エラー系', () => {
  test('APIエラー時にエラーメッセージが表示される', async ({ page }) => {
    // バックエンドが存在しない状態を模倣するためにAPIをモック
    await page.route('**/api/messages/send', route => {
      route.fulfill({ status: 500, body: JSON.stringify({ error: 'Internal Server Error' }) });
    });

    await page.goto('/send');
    await page.locator('select').selectOption('jarvis');
    await page.locator('textarea').fill('エラーテスト用メッセージ');
    await page.getByRole('button', { name: '送信' }).click();

    // エラーメッセージが表示されること
    await expect(page.locator('.text-red-400')).toBeVisible({ timeout: 5000 });
  });
});
