import { useQuery } from 'react-query';
import { fetchAgents } from '../api/agents';
import { POLL_INTERVAL } from '../utils/constants';

export function useAgents() {
  return useQuery('agents', fetchAgents, {
    refetchInterval: POLL_INTERVAL,
    staleTime: 0,
  });
}
