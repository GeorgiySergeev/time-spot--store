// API Utility functions for better error handling and common operations

export const API_ERROR_MESSAGES = {
  400: 'Bad Request - The request was malformed',
  401: 'Unauthorized - Authentication required',
  403: 'Forbidden - Access denied',
  404: 'Not Found - The requested resource was not found',
  412: 'Precondition Failed - Request headers or parameters are invalid',
  429: 'Too Many Requests - Rate limit exceeded',
  500: 'Internal Server Error - Something went wrong on the server',
  502: 'Bad Gateway - Server communication error',
  503: 'Service Unavailable - Service temporarily unavailable',
  504: 'Gateway Timeout - Request timed out',
}

export const handleApiError = (error) => {
  const status = error.response?.status
  const message = error.response?.data?.message || error.message

  // Get user-friendly error message
  const userMessage =
    API_ERROR_MESSAGES[status] || 'An unexpected error occurred'

  // Log detailed error for debugging
  console.error('API Error Details:', {
    status,
    message,
    userMessage,
    url: error.config?.url,
    method: error.config?.method,
    headers: error.config?.headers,
    responseData: error.response?.data,
  })

  return {
    status,
    message,
    userMessage,
    isNetworkError: !error.response,
    isServerError: status >= 500,
    isClientError: status >= 400 && status < 500,
  }
}

export const createApiHeaders = (apiKey, additionalHeaders = {}) => {
  return {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    Authorization: `Bearer ${apiKey}`,
    'api-key': apiKey,
    ...additionalHeaders,
  }
}

export const validateApiResponse = (response) => {
  if (!response || typeof response !== 'object') {
    throw new Error('Invalid API response format')
  }

  return response
}
