import { useState, useCallback, useRef, useEffect } from 'react';

interface UseLoadingOptions {
  delay?: number;
  minDuration?: number;
}

/**
 * Custom hook for managing loading states with automatic timeout
 *
 * @param options - Configuration options
 * @param options.delay - Delay before showing loader (ms)
 * @param options.minDuration - Minimum time to show loader (ms)
 * @returns Loading state and control functions
 */
export const useLoading = (options: UseLoadingOptions = {}) => {
  const { delay = 0, minDuration = 0 } = options;
  const [isLoading, setIsLoading] = useState(false);
  const delayTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const minDurationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number | null>(null);

  const stopLoading = useCallback(() => {
    setIsLoading(false);
    if (delayTimeoutRef.current) clearTimeout(delayTimeoutRef.current);
    if (minDurationTimeoutRef.current) clearTimeout(minDurationTimeoutRef.current);
  }, []);

  const startLoading = useCallback(() => {
    startTimeRef.current = Date.now();

    if (delay > 0) {
      delayTimeoutRef.current = setTimeout(() => {
        setIsLoading(true);
      }, delay);
    } else {
      setIsLoading(true);
    }
  }, [delay]);

  const setLoading = useCallback(
    (loading: boolean) => {
      if (loading) {
        startLoading();
      } else {
        const elapsedTime = Date.now() - (startTimeRef.current || Date.now());
        const remainingMinDuration = Math.max(0, minDuration - elapsedTime);

        if (remainingMinDuration > 0) {
          minDurationTimeoutRef.current = setTimeout(() => {
            stopLoading();
          }, remainingMinDuration);
        } else {
          stopLoading();
        }
      }
    },
    [startLoading, stopLoading, minDuration]
  );

  const cleanup = useCallback(() => {
    if (delayTimeoutRef.current) clearTimeout(delayTimeoutRef.current);
    if (minDurationTimeoutRef.current) clearTimeout(minDurationTimeoutRef.current);
  }, []);

  return {
    isLoading,
    setLoading,
    startLoading,
    stopLoading,
    cleanup,
  };
};

interface UseAsyncOptions extends UseLoadingOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
}

/**
 * Hook for async operations with automatic loading state
 */
export const useAsync = (
  asyncFn: () => Promise<any>,
  options: UseAsyncOptions = {}
) => {
  const { onSuccess, onError, delay = 0, minDuration = 300 } = options;
  const [error, setError] = useState<Error | null>(null);
  const { isLoading, setLoading } = useLoading({ delay, minDuration });

  const execute = useCallback(async () => {
    try {
      setError(null);
      setLoading(true);
      const result = await asyncFn();
      onSuccess?.(result);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      onError?.(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [asyncFn, onSuccess, onError, setLoading]);

  return {
    isLoading,
    error,
    execute,
    clearError: () => setError(null),
  };
};

/**
 * Hook for managing multiple loading states
 */
export const useMultiLoading = (keys: string[]) => {
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>(
    keys.reduce((acc, key) => ({ ...acc, [key]: false }), {})
  );

  const setLoading = useCallback(
    (key: string, loading: boolean) => {
      if (!keys.includes(key)) {
        console.warn(`Unknown loading key: ${key}`);
        return;
      }
      setLoadingStates((prev) => ({ ...prev, [key]: loading }));
    },
    [keys]
  );

  const isLoading = Object.values(loadingStates).some((v) => v);
  const isLoadingAny = (keysToCheck: string[]) =>
    keysToCheck.some((key) => loadingStates[key]);
  const isLoadingAll = (keysToCheck: string[]) =>
    keysToCheck.every((key) => loadingStates[key]);

  return {
    isLoading,
    isLoadingAny,
    isLoadingAll,
    loadingStates,
    setLoading,
    setAllLoading: (loading: boolean) => {
      setLoadingStates(keys.reduce((acc, key) => ({ ...acc, [key]: loading }), {}));
    },
    startAll: () => {
      setLoadingStates(keys.reduce((acc, key) => ({ ...acc, [key]: true }), {}));
    },
    stopAll: () => {
      setLoadingStates(keys.reduce((acc, key) => ({ ...acc, [key]: false }), {}));
    },
  };
};

/**
 * Hook for request cancellation and cleanup
 */
export const useAbortController = () => {
  const controllerRef = useRef<AbortController>(new AbortController());

  const abort = useCallback(() => {
    controllerRef.current?.abort();
  }, []);

  const cleanup = useCallback(() => {
    abort();
    controllerRef.current = new AbortController();
  }, [abort]);

  return {
    signal: controllerRef.current.signal,
    abort,
    cleanup,
  };
};

/**
 * Combined hook for complete data fetching with loading state
 */
interface UseFetchOptions extends UseLoadingOptions {
  dependencies?: any[];
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
}

export const useFetch = (url: string, options: UseFetchOptions = {}) => {
  const { dependencies = [url], onSuccess, onError, delay = 0, minDuration = 300 } = options;
  const [data, setData] = useState<any>(null);
  const { isLoading, setLoading } = useLoading({ delay, minDuration });
  const [error, setError] = useState<Error | null>(null);
  const { signal, cleanup } = useAbortController();

  const fetchData = useCallback(async () => {
    try {
      setError(null);
      setLoading(true);
      const response = await fetch(url, { signal });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const result = await response.json();
      setData(result);
      onSuccess?.(result);
    } catch (err) {
      if (err instanceof Error && err.name !== 'AbortError') {
        setError(err);
        onError?.(err);
      }
    } finally {
      setLoading(false);
    }
  }, [url, signal, setLoading, onSuccess, onError]);

  // Initial fetch
  useEffect(() => {
    fetchData();
    return cleanup;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  return {
    data,
    isLoading,
    error,
    refetch: fetchData,
  };
};
