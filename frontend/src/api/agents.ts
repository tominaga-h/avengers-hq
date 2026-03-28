import client from './client';
import { Agent } from '../types/agent';

export async function fetchAgents(): Promise<Agent[]> {
  const res = await client.get<{ agents: Agent[] }>('/agents');
  return res.data.agents;
}

export async function fetchAgent(id: string): Promise<Agent> {
  const res = await client.get<Agent>(`/agents/${id}`);
  return res.data;
}
