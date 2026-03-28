import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => {
  // ルートの .env を読む（frontend/ の一つ上のディレクトリ）
  const env = loadEnv(mode, path.resolve(__dirname, '..'), '');
  const frontendPort = parseInt(env.FRONTEND_PORT ?? '3000', 10);
  const backendPort = parseInt(env.BACKEND_PORT ?? '3001', 10);

  return {
    plugins: [react()],
    server: {
      port: frontendPort,
      proxy: {
        '/api': `http://localhost:${backendPort}`,
      },
    },
  };
});
