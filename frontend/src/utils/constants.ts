export const AGENTS = [
  { id: 'jarvis',   name: 'JARVIS',          role: '司令塔・窓口' },
  { id: 'tony',     name: 'IRON MAN',        role: '開発班リーダー' },
  { id: 'bruce',    name: 'HULK',            role: 'デバッグ・分析' },
  { id: 'cap',      name: 'CAPTAIN AMERICA', role: 'コードレビュー・テスト' },
  { id: 'marvel',   name: 'CAPTAIN MARVEL',  role: 'パフォーマンス・セキュリティ' },
  { id: 'peter',    name: 'SPIDER-MAN',      role: 'YouTube監視' },
  { id: 'starlord', name: 'STAR-LORD',       role: 'Spotifyプレイリスト' },
] as const;

export const AGENT_ICONS: Record<string, string> = {
  jarvis:   '🤖',
  tony:     '🦾',
  bruce:    '💚',
  cap:      '🛡',
  marvel:   '⚡',
  peter:    '🕷',
  starlord: '⭐',
};

export const MESSAGE_TYPES = [
  { value: 'task_assigned',   label: 'タスク依頼' },
  { value: 'ping',            label: '疎通確認' },
  { value: 'report_completed', label: '完了報告' },
  { value: 'wake_up',         label: '起動指示' },
] as const;

export const STATUS_LABELS: Record<string, string> = {
  online:  '稼働中',
  working: '作業中',
  idle:    '待機中',
  offline: 'オフライン',
};

export const POLL_INTERVAL = 5000; // 5秒
