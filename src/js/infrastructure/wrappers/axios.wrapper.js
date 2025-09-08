/**
 * Functional Axios Wrapper
 * Pure functional HTTP client with composition and error handling
 */

import axios from 'axios'
import {
  curry,
  pipe,
  compose,
  retry,
  memoizeWithTTL,
  tap,
  trace,
} from '../../core/functional.utils.js'

// ============================================================================
// HTTP CLIENT FACTORY
// ============================================================================

/**
 * Create a functional HTTP client
 */
export const createHttpClient = (baseConfig = {}) => {
  const instance = axios.create({
    timeout: 15000,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    ...baseConfig,
  })

  // Add request interceptor
  instance.interceptors.request.use(
    (config) => {
      if (baseConfig.debug) {
        console.log(
          '🌐 HTTP Request:',
          config.method?.toUpperCase(),
          config.url,
        )
      }
      return config
    },
    (error) => Promise.reject(error),
  )

  // Add response interceptor
  instance.interceptors.response.use(
    (response) => {
      if (baseConfig.debug) {
        console.log('✅ HTTP Response:', response.status, response.config.url)
      }
      return response
    },
    (error) => {
      if (baseConfig.debug) {
        console.error(
          '❌ HTTP Error:',
          error.response?.status,
          error.config?.url,
        )
      }
      return Promise.reject(error)
    },
  )

  return instance
}

// ============================================================================
// FUNCTIONAL MIDDLEWARE
// ============================================================================

/**
 * Add retry capability to requests
 */
export const withRetry = curry((maxAttempts, delay, httpFn) =>
  retry(maxAttempts, delay, httpFn),
)

/**
 * Add caching to GET requests
 */
export const withCache = curry((ttl, keyFn, httpFn) => {
  const cachedFn = memoizeWithTTL(httpFn, ttl, keyFn)

  return (config) => {
    // Only cache GET requests
    if (config.method?.toLowerCase() === 'get' || !config.method) {
      return cachedFn(config)
    }
    return httpFn(config)
  }
})

/**
 * Transform request before sending
 */
export const withRequestTransform = curry(
  (transformer, httpFn) => (config) => httpFn(transformer(config)),
)

/**
 * Transform response after receiving
 */
export const withResponseTransform = curry(
  (transformer, httpFn) => (config) => httpFn(config).then(transformer),
)

/**
 * Add authentication headers
 */
export const withAuth = curry((getAuthHeaders, httpFn) => (config) => {
  const authHeaders = getAuthHeaders()
  return httpFn({
    ...config,
    headers: { ...config.headers, ...authHeaders },
  })
})

/**
 * Add error handling
 */
export const withErrorHandling = curry(
  (errorHandler, httpFn) => (config) => httpFn(config).catch(errorHandler),
)

/**
 * Add loading state management
 */
export const withLoading = curry((setLoading, httpFn) => async (config) => {
  setLoading(true)
  try {
    const result = await httpFn(config)
    setLoading(false)
    return result
  } catch (error) {
    setLoading(false)
    throw error
  }
})

// ============================================================================
// HTTP METHODS
// ============================================================================

/**
 * Generic request function
 */
export const request = curry((client, config) => client(config))

/**
 * GET request
 */
export const get = curry((client, url, config = {}) =>
  client({ method: 'GET', url, ...config }),
)

/**
 * POST request
 */
export const post = curry((client, url, data, config = {}) =>
  client({ method: 'POST', url, data, ...config }),
)

/**
 * PUT request
 */
export const put = curry((client, url, data, config = {}) =>
  client({ method: 'PUT', url, data, ...config }),
)

/**
 * PATCH request
 */
export const patch = curry((client, url, data, config = {}) =>
  client({ method: 'PATCH', url, data, ...config }),
)

/**
 * DELETE request
 */
export const del = curry((client, url, config = {}) =>
  client({ method: 'DELETE', url, ...config }),
)

// ============================================================================
// RESPONSE UTILITIES
// ============================================================================

/**
 * Extract data from response
 */
export const extractData = (response) => response.data

/**
 * Extract status from response
 */
export const extractStatus = (response) => response.status

/**
 * Extract headers from response
 */
export const extractHeaders = (response) => response.headers

/**
 * Check if response is successful
 */
export const isSuccessful = (response) =>
  response.status >= 200 && response.status < 300

/**
 * Check if response has data
 */
export const hasData = (response) =>
  response.data !== null && response.data !== undefined

// ============================================================================
// ERROR HANDLING
// ============================================================================

/**
 * Create error handler
 */
export const createErrorHandler =
  (handlers = {}) =>
  (error) => {
    const status = error.response?.status
    const handler = handlers[status] || handlers.default

    if (handler) {
      return handler(error)
    }

    // Default error handling
    console.error('HTTP Error:', {
      status,
      message: error.message,
      url: error.config?.url,
      method: error.config?.method,
    })

    throw error
  }

/**
 * Common error handlers
 */
export const errorHandlers = {
  400: (error) => {
    console.warn('Bad Request:', error.response?.data)
    throw new Error('Invalid request data')
  },

  401: (error) => {
    console.warn('Unauthorized:', error.response?.data)
    // Could trigger logout or token refresh
    throw new Error('Authentication required')
  },

  403: (error) => {
    console.warn('Forbidden:', error.response?.data)
    throw new Error('Access denied')
  },

  404: (error) => {
    console.warn('Not Found:', error.response?.data)
    throw new Error('Resource not found')
  },

  500: (error) => {
    console.error('Server Error:', error.response?.data)
    throw new Error('Server error occurred')
  },

  default: (error) => {
    console.error('Unknown Error:', error)
    throw error
  },
}

// ============================================================================
// REQUEST BUILDERS
// ============================================================================

/**
 * Build query string from object
 */
export const buildQuery = (params) => {
  const query = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      if (Array.isArray(value)) {
        value.forEach((item) => query.append(key, item))
      } else {
        query.append(key, value)
      }
    }
  })

  return query.toString()
}

/**
 * Build URL with query parameters
 */
export const buildUrl = curry((baseUrl, params) => {
  const query = buildQuery(params)
  return query ? `${baseUrl}?${query}` : baseUrl
})

/**
 * Create form data from object
 */
export const createFormData = (data) => {
  const formData = new FormData()

  Object.entries(data).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      if (value instanceof File || value instanceof Blob) {
        formData.append(key, value)
      } else if (Array.isArray(value)) {
        value.forEach((item) => formData.append(key, item))
      } else {
        formData.append(key, String(value))
      }
    }
  })

  return formData
}

// ============================================================================
// COMPOSED HTTP FUNCTIONS
// ============================================================================

/**
 * Create a configured HTTP client with common middleware
 */
export const createApiClient = (config = {}) => {
  const {
    baseURL = '',
    timeout = 15000,
    retryAttempts = 3,
    retryDelay = 1000,
    cacheTimeout = 300000, // 5 minutes
    debug = false,
    authHeadersProvider = null,
    errorHandlers: customErrorHandlers = {},
  } = config

  const client = createHttpClient({
    baseURL,
    timeout,
    debug,
  })

  // Create base request function
  let requestFn = request(client)

  // Add retry middleware
  if (retryAttempts > 0) {
    requestFn = withRetry(retryAttempts, retryDelay, requestFn)
  }

  // Add caching middleware
  if (cacheTimeout > 0) {
    requestFn = withCache(
      cacheTimeout,
      (config) =>
        `${config.method || 'GET'}:${config.url}:${JSON.stringify(config.params)}`,
      requestFn,
    )
  }

  // Add auth middleware
  if (authHeadersProvider) {
    requestFn = withAuth(authHeadersProvider, requestFn)
  }

  // Add error handling middleware
  const errorHandler = createErrorHandler({
    ...errorHandlers,
    ...customErrorHandlers,
  })
  requestFn = withErrorHandling(errorHandler, requestFn)

  return {
    // Raw request function
    request: requestFn,

    // HTTP methods
    get: get(client),
    post: post(client),
    put: put(client),
    patch: patch(client),
    delete: del(client),

    // Composed methods with middleware
    getWithMiddleware: (url, config) =>
      requestFn({ method: 'GET', url, ...config }),
    postWithMiddleware: (url, data, config) =>
      requestFn({ method: 'POST', url, data, ...config }),
    putWithMiddleware: (url, data, config) =>
      requestFn({ method: 'PUT', url, data, ...config }),
    patchWithMiddleware: (url, data, config) =>
      requestFn({ method: 'PATCH', url, data, ...config }),
    deleteWithMiddleware: (url, config) =>
      requestFn({ method: 'DELETE', url, ...config }),

    // Utilities
    buildUrl,
    buildQuery,
    createFormData,
    extractData,
    extractStatus,
    extractHeaders,
    isSuccessful,
    hasData,
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  // Core functions
  createHttpClient,
  createApiClient,

  // Middleware
  withRetry,
  withCache,
  withRequestTransform,
  withResponseTransform,
  withAuth,
  withErrorHandling,
  withLoading,

  // HTTP methods
  request,
  get,
  post,
  put,
  patch,
  delete: del,

  // Utilities
  buildUrl,
  buildQuery,
  createFormData,
  extractData,
  extractStatus,
  extractHeaders,
  isSuccessful,
  hasData,

  // Error handling
  createErrorHandler,
  errorHandlers,
}
