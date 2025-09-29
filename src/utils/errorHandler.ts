import { apiRequest } from '../config/api';

// Global error handler for API requests
export const handleApiError = (error: any, context?: string): string => {
  console.error(`API Error${context ? ` in ${context}` : ''}:`, error);

  // Handle validation errors from API
  if (error.response?.data?.errors) {
    const errors = error.response.data.errors;
    
    // Handle non_field_errors specifically
    if (errors.non_field_errors && Array.isArray(errors.non_field_errors)) {
      return errors.non_field_errors.join(', ');
    } else {
      // Handle field-specific errors
      return Object.values(errors).flat().join(', ');
    }
  } else if (error.response?.data?.message) {
    return error.response.data.message;
  } else if (error.message) {
    return error.message;
  } else {
    return 'An unexpected error occurred. Please try again.';
  }
};

// Enhanced API request wrapper with global error handling
export const apiRequestWithErrorHandling = async <T>(
  endpoint: string,
  options: RequestInit = {},
  context?: string
): Promise<T> => {
  try {
    return await apiRequest<T>(endpoint, options);
  } catch (error) {
    const errorMessage = handleApiError(error, context);
    throw new Error(errorMessage);
  }
};

// Network error detection
export const isNetworkError = (error: any): boolean => {
  return !error.response && error.message?.includes('fetch');
};

// Authentication error detection
export const isAuthError = (error: any): boolean => {
  return error.response?.status === 401 || error.response?.status === 403;
};

// Validation error detection
export const isValidationError = (error: any): boolean => {
  return error.response?.status === 400 && error.response?.data?.errors;
};
