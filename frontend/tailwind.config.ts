import type { Config } from 'tailwindcss';
import typography from '@tailwindcss/typography';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'avengers-red': '#C41E3A',
        'avengers-gold': '#FFD700',
        'shield-dark': '#0a0e1a',
        'shield-panel': '#111827',
        'shield-card': '#1f2937',
        'shield-border': '#374151',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        mono: ['JetBrains Mono', 'ui-monospace'],
      },
    },
  },
  plugins: [typography],
} satisfies Config;
