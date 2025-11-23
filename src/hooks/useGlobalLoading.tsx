import React, { createContext, useContext, useState, useCallback } from 'react';
import LoadingSpinner from '../components/LoadingSpinner';

interface GlobalLoadingContextType {
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
  startLoading: () => void;
  stopLoading: () => void;
  setLoadingText: (text: string) => void;
  loadingText: string;
}

const GlobalLoadingContext = createContext<GlobalLoadingContextType | undefined>(undefined);

interface GlobalLoadingProviderProps {
  children: React.ReactNode;
}

/**
 * Global Loading Provider
 * Provides a single loading state for the entire application
 * Shows beautiful loading animation when pages/data are loading
 */
export const GlobalLoadingProvider: React.FC<GlobalLoadingProviderProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('Loading...');

  const startLoading = useCallback(() => {
    setIsLoading(true);
  }, []);

  const stopLoading = useCallback(() => {
    setIsLoading(false);
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    setIsLoading(loading);
  }, []);

  const handleSetLoadingText = useCallback((text: string) => {
    setLoadingText(text);
  }, []);

  const value: GlobalLoadingContextType = {
    isLoading,
    setLoading,
    startLoading,
    stopLoading,
    setLoadingText: handleSetLoadingText,
    loadingText,
  };

  return (
    <GlobalLoadingContext.Provider value={value}>
      {/* Global Loading Overlay */}
      {isLoading && (
        <LoadingSpinner
          fullScreen
          overlay
          variant="elegant"
          text={loadingText}
        />
      )}
      {children}
    </GlobalLoadingContext.Provider>
  );
};

/**
 * Hook to use global loading state
 * Use this in any component to show/hide the global loading overlay
 *
 * @example
 * const { isLoading, startLoading, stopLoading } = useGlobalLoading();
 *
 * useEffect(() => {
 *   startLoading();
 *   fetchData().finally(() => stopLoading());
 * }, []);
 */
export const useGlobalLoading = (): GlobalLoadingContextType => {
  const context = useContext(GlobalLoadingContext);
  if (!context) {
    throw new Error('useGlobalLoading must be used within GlobalLoadingProvider');
  }
  return context;
};

export default GlobalLoadingProvider;
