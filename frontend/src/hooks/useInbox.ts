import { useQuery, useMutation, useQueryClient } from 'react-query';
import { fetchInbox, markMessageRead, markAllRead } from '../api/inbox';
import { POLL_INTERVAL } from '../utils/constants';

export function useInbox(agent: string, unreadOnly = false) {
  return useQuery(
    ['inbox', agent, unreadOnly],
    () => fetchInbox(agent, unreadOnly),
    { refetchInterval: POLL_INTERVAL, staleTime: 0 }
  );
}

export function useMarkRead(agent: string) {
  const qc = useQueryClient();
  return useMutation(
    (msgId: string) => markMessageRead(agent, msgId),
    { onSuccess: () => qc.invalidateQueries(['inbox', agent]) }
  );
}

export function useMarkAllRead(agent: string) {
  const qc = useQueryClient();
  return useMutation(
    () => markAllRead(agent),
    { onSuccess: () => qc.invalidateQueries(['inbox', agent]) }
  );
}
