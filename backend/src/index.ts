import app from './app';

const PORT = parseInt(process.env.BACKEND_PORT ?? '3001', 10);

app.listen(PORT, () => {
  console.log(`[JARVIS] Backend online: http://localhost:${PORT}/api`);
});
