import { useEffect, useRef, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';

interface UseAutoRefreshOptions {
  intervalMs?: number;
  enabled?: boolean;
  queryKeys?: string[][];
}

/**
 * Hook to automatically refresh data at specified intervals
 * Uses React Query's invalidateQueries to trigger refetches
 */
export function useAutoRefresh({
  intervalMs = 30000,
  enabled = true,
  queryKeys = [['input-aspirasi'], ['aspirasi'], ['siswa'], ['admin']],
}: UseAutoRefreshOptions = {}) {
  const queryClient = useQueryClient();
  const intervalRef = useRef<number | null>(null);

  const refresh = useCallback(() => {
    queryKeys.forEach(key => {
      queryClient.invalidateQueries({ queryKey: key });
    });
  }, [queryClient, queryKeys]);

  useEffect(() => {
    if (!enabled) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    // Set up interval for auto-refresh
    intervalRef.current = window.setInterval(() => {
      refresh();
    }, intervalMs);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [enabled, intervalMs, refresh]);

  return { refresh };
}
