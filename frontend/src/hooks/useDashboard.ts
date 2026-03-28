import { useQuery } from 'react-query';
import { fetchDashboard } from '../api/dashboard';
import { POLL_INTERVAL } from '../utils/constants';

export function useDashboard() {
  return useQuery('dashboard', fetchDashboard, {
    refetchInterval: POLL_INTERVAL,
    staleTime: 0,
  });
}
