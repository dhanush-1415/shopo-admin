/**
 * Hook to get API client with authentication token
 * Use this hook in components that need to make authenticated API calls
 */
import { useMemo } from 'react';
import { createApiClient } from '@/api/client';
import { useAuthStore } from '@/store/authStore';

export function useApiClient() {
  const token = useAuthStore((state) => state.accessToken);

  const apiClient = useMemo(() => {
    return createApiClient(token);
  }, [token]);

  return apiClient;
}

