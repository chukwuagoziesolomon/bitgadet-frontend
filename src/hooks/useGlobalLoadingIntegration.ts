import { useEffect, useCallback, useState } from 'react';
import { useGlobalLoading } from './useGlobalLoading';

interface UseGlobalLoadingOptions {
  showLoading?: boolean;
  loadingText?: string;
}

/**
 * Hook to automatically manage global loading state for async operations
 * Shows beautiful full-screen loading animation while data is being fetched
 */
export const useGlobalLoadingState = (
  shouldLoad: boolean = true,
  loadingText: string = 'Loading...'
) => {
  const { isLoading, startLoading, stopLoading, setLoadingText } = useGlobalLoading();

  useEffect(() => {
    if (shouldLoad) {
      setLoadingText(loadingText);
      startLoading();
    } else {
      stopLoading();
    }

    return () => {
      stopLoading();
    };
  }, [shouldLoad, loadingText, startLoading, stopLoading, setLoadingText]);

  return { isLoading };
};

/**
 * Hook to show global loading for async operations
 * Automatically handles show/hide based on promise state
 */
export const useGlobalAsync = (
  asyncFn: () => Promise<any>,
  loadingText: string = 'Loading...'
) => {
  const { startLoading, stopLoading, setLoadingText } = useGlobalLoading();

  const execute = useCallback(async () => {
    try {
      setLoadingText(loadingText);
      startLoading();
      const result = await asyncFn();
      return result;
    } finally {
      stopLoading();
    }
  }, [asyncFn, loadingText, startLoading, stopLoading, setLoadingText]);

  return execute;
};

/**
 * Hook to show global loading during data fetching
 * Combines fetch functionality with global loading state
 */
interface UseFetchOptions extends UseGlobalLoadingOptions {
  dependencies?: any[];
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
}

export const useGlobalFetch = (
  url: string,
  options: UseFetchOptions = {}
) => {
  const {
    showLoading = true,
    loadingText = 'Loading...',
    dependencies = [url],
    onSuccess,
    onError,
  } = options;

  const { startLoading, stopLoading, setLoadingText } = useGlobalLoading();
  const [data, setData] = useState(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = useCallback(async () => {
    if (!showLoading) return;

    try {
      setError(null);
      setIsLoading(true);
      setLoadingText(loadingText);
      startLoading();

      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const result = await response.json();

      setData(result);
      onSuccess?.(result);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      onError?.(error);
      throw error;
    } finally {
      setIsLoading(false);
      stopLoading();
    }
  }, [url, showLoading, loadingText, startLoading, stopLoading, setLoadingText, onSuccess, onError]);

  useEffect(() => {
    fetchData();
  }, dependencies);

  return {
    data,
    isLoading,
    error,
    refetch: fetchData,
  };
};
