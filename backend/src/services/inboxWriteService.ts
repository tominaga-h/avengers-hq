// inboxWriteService.ts — Bruce (Hulk) が実装する
// inbox_write.sh を呼び出してメッセージを書き込むサービス
import { execFile } from 'child_process';
import path from 'path';

const AVENGERS_ROOT = process.env.AVENGERS_ROOT ?? '/Users/mad-tmng/avengers';
const INBOX_WRITE_SH = path.join(AVENGERS_ROOT, 'scripts', 'inbox_write.sh');

export function sendMessage(
  to: string,
  content: string,
  type: string,
  from: string
): Promise<string> {
  return new Promise((resolve, reject) => {
    execFile(
      'bash',
      [INBOX_WRITE_SH, to, content, type, from],
      (err, stdout, stderr) => {
        if (err) {
          reject(new Error(`inbox_write.sh failed: ${stderr || err.message}`));
        } else {
          resolve(stdout.trim());
        }
      }
    );
  });
}
