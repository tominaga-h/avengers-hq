import client from './client';

export async function fetchDashboard(): Promise<{ content: string; last_modified: string }> {
  const res = await client.get('/dashboard');
  return res.data;
}
