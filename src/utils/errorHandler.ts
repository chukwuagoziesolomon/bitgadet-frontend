import { apiRequest } from '../config/api';

/**
 * Extracts error message from various API error response formats
 * Handles: validation errors, non_field_errors, nested structures, simple messages
 */
export const extractErrorMessage = (responseData: any): string => {
  if (!responseData) {
    return 'An unexpected error occurred. Please try again.';
  }

  // Priority 1: Check for 'errors' object (validation errors)
  if (responseData.errors && typeof responseData.errors === 'object') {
    const errors = responseData.errors;
    const errorMessages: string[] = [];

    // Handle non_field_errors specifically
    if (errors.non_field_errors && Array.isArray(errors.non_field_errors)) {
      errorMessages.push(...errors.non_field_errors);
    }

    // Handle field-specific errors
    for (const [field, messages] of Object.entries(errors)) {
      if (field !== 'non_field_errors') {
        if (Array.isArray(messages)) {
          errorMessages.push(...messages);
        } else if (typeof messages === 'string') {
          errorMessages.push(messages);
        } else if (typeof messages === 'object' && messages !== null) {
          // Handle nested error objects
          errorMessages.push(String(messages));
        }
      }
    }

    if (errorMessages.length > 0) {
      return errorMessages.join(', ');
    }
  }

  // Priority 2: Check for 'detail' field (common DRF error format)
  if (responseData.detail) {
    return String(responseData.detail);
  }

  // Priority 3: Check for 'message' field
  if (responseData.message) {
    return String(responseData.message);
  }

  // Priority 4: Check for 'error' field
  if (responseData.error) {
    return String(responseData.error);
  }

  // Priority 5: Handle array responses
  if (Array.isArray(responseData) && responseData.length > 0) {
    if (typeof responseData[0] === 'string') {
      return responseData.join(', ');
    }
  }

  return 'An unexpected error occurred. Please try again.';
};

// Global error handler for API requests
export const handleApiError = (error: any, context?: string): string => {
  console.error(`API Error${context ? ` in ${context}` : ''}:`, error);

  // First try to extract from response data
  if (error.response?.data) {
    const extractedMessage = extractErrorMessage(error.response.data);
    if (extractedMessage !== 'An unexpected error occurred. Please try again.') {
      return extractedMessage;
    }
  }

  // Fallback to error.message
  if (error.message) {
    return error.message;
  }

  return 'An unexpected error occurred. Please try again.';
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

