/**
 * API Factory - Core API Creation and Configuration
 * Functional approach to API client creation with composition
 */

import {
  curry,
  pipe,
  compose,
  merge,
  tap,
  trace,
} from '../../../core/functional.utils.js'
import { createApiClient } from '../../../infrastructure/wrappers/axios.wrapper.js'

// ============================================================================
// API FACTORY
// ============================================================================

/**
 * Create a base API client with common configuration
 */
export const createBaseApi = (config = {}) => {
  const defaultConfig = {
    timeout: 15000,
    retryAttempts: 3,
    retryDelay: 1000,
    cacheTimeout: 300000, // 5 minutes
    debug: false,
  }

  const finalConfig = merge(defaultConfig, config)

  return createApiClient(finalConfig)
}

/**
 * Create API factory with dependency injection
 */
export const createApiFactory = (baseConfig = {}) => {
  const baseApi = createBaseApi(baseConfig)

  return {
    // Get the base API client
    getBaseApi: () => baseApi,

    // Create specialized API clients
    createCrudApi: (resourceConfig) => createCrudApi(baseApi, resourceConfig),
    createProductApi: (productConfig) =>
      createProductApi(baseApi, productConfig),
    createWatchApi: (watchConfig) => createWatchApi(baseApi, watchConfig),
    createJewelryApi: (jewelryConfig) =>
      createJewelryApi(baseApi, jewelryConfig),

    // Utility methods
    buildUrl: baseApi.buildUrl,
    buildQuery: baseApi.buildQuery,
    extractData: baseApi.extractData,
    isSuccessful: baseApi.isSuccessful,
  }
}

// ============================================================================
// CRUD API CREATOR
// ============================================================================

/**
 * Create a generic CRUD API
 */
export const createCrudApi = curry((baseApi, config) => {
  const {
    baseUrl = '',
    endpoints = {},
    transformRequest = (data) => data,
    transformResponse = (data) => data,
    validateRequest = () => ({ isValid: true }),
    validateResponse = () => ({ isValid: true }),
  } = config

  return {
    // Create resource
    create: async (data) => {
      const validation = validateRequest(data)
      if (!validation.isValid) {
        throw new Error(`Request validation failed: ${validation.error}`)
      }

      const transformedData = transformRequest(data)
      const response = await baseApi.postWithMiddleware(
        endpoints.create || baseUrl,
        transformedData,
      )

      return transformResponse(baseApi.extractData(response))
    },

    // Read resource(s)
    read: async (params = {}) => {
      const url = params.id
        ? `${endpoints.read || baseUrl}/${params.id}`
        : endpoints.list || baseUrl

      const response = await baseApi.getWithMiddleware(url, { params })
      const data = baseApi.extractData(response)

      const validation = validateResponse(data)
      if (!validation.isValid) {
        throw new Error(`Response validation failed: ${validation.error}`)
      }

      return transformResponse(data)
    },

    // Update resource
    update: async (id, data) => {
      const validation = validateRequest(data)
      if (!validation.isValid) {
        throw new Error(`Request validation failed: ${validation.error}`)
      }

      const transformedData = transformRequest(data)
      const response = await baseApi.putWithMiddleware(
        `${endpoints.update || baseUrl}/${id}`,
        transformedData,
      )

      return transformResponse(baseApi.extractData(response))
    },

    // Delete resource
    delete: async (id) => {
      const response = await baseApi.deleteWithMiddleware(
        `${endpoints.delete || baseUrl}/${id}`,
      )

      return baseApi.isSuccessful(response)
    },

    // List resources with filtering
    list: async (filters = {}) => {
      const url = baseApi.buildUrl(endpoints.list || baseUrl, filters)
      const response = await baseApi.getWithMiddleware(url)
      const data = baseApi.extractData(response)

      return transformResponse(data)
    },
  }
})

// ============================================================================
// PRODUCT API CREATOR
// ============================================================================

/**
 * Create a product-specific API
 */
export const createProductApi = curry((baseApi, config) => {
  const {
    baseUrl = '/products',
    transformProduct = (product) => product,
    validateProduct = () => ({ isValid: true }),
  } = config

  const crudApi = createCrudApi(baseApi, {
    baseUrl,
    transformResponse: (data) => {
      if (Array.isArray(data)) {
        return data.map(transformProduct)
      }
      return transformProduct(data)
    },
    validateResponse: validateProduct,
  })

  return {
    ...crudApi,

    // Product-specific methods
    search: async (query, filters = {}) => {
      const searchParams = { search: query, ...filters }
      return crudApi.list(searchParams)
    },

    getByCategory: async (category, filters = {}) => {
      const categoryParams = { category, ...filters }
      return crudApi.list(categoryParams)
    },

    getByBrand: async (brand, filters = {}) => {
      const brandParams = { brand, ...filters }
      return crudApi.list(brandParams)
    },

    getInPriceRange: async (minPrice, maxPrice, filters = {}) => {
      const priceParams = { priceMin: minPrice, priceMax: maxPrice, ...filters }
      return crudApi.list(priceParams)
    },

    getInStock: async (filters = {}) => {
      const stockParams = { inStock: true, ...filters }
      return crudApi.list(stockParams)
    },
  }
})

// ============================================================================
// WATCH API CREATOR
// ============================================================================

/**
 * Create a watch-specific API
 */
export const createWatchApi = curry((baseApi, config) => {
  const {
    baseUrl = '/watches',
    transformWatch = (watch) => watch,
    validateWatch = () => ({ isValid: true }),
  } = config

  const productApi = createProductApi(baseApi, {
    baseUrl,
    transformProduct: transformWatch,
    validateProduct: validateWatch,
  })

  return {
    ...productApi,

    // Watch-specific methods
    getByMovement: async (movement, filters = {}) => {
      const movementParams = { movement, ...filters }
      return productApi.list(movementParams)
    },

    getByDialColor: async (dialColor, filters = {}) => {
      const colorParams = { dialColor, ...filters }
      return productApi.list(colorParams)
    },

    getByWaterResistance: async (waterResistance, filters = {}) => {
      const resistanceParams = { waterResistance, ...filters }
      return productApi.list(resistanceParams)
    },
  }
})

// ============================================================================
// JEWELRY API CREATOR
// ============================================================================

/**
 * Create a jewelry-specific API
 */
export const createJewelryApi = curry((baseApi, config) => {
  const {
    baseUrl = '/jewelry',
    transformJewelry = (jewelry) => jewelry,
    validateJewelry = () => ({ isValid: true }),
  } = config

  const productApi = createProductApi(baseApi, {
    baseUrl,
    transformProduct: transformJewelry,
    validateProduct: validateJewelry,
  })

  return {
    ...productApi,

    // Jewelry-specific methods
    getByMaterial: async (material, filters = {}) => {
      const materialParams = { material, ...filters }
      return productApi.list(materialParams)
    },

    getByGemstone: async (gemstone, filters = {}) => {
      const gemstoneParams = { gemstone, ...filters }
      return productApi.list(gemstoneParams)
    },

    getByKarat: async (karat, filters = {}) => {
      const karatParams = { karat, ...filters }
      return productApi.list(karatParams)
    },
  }
})

// ============================================================================
// API COMPOSITION UTILITIES
// ============================================================================

/**
 * Compose multiple API methods
 */
export const composeApiMethods =
  (...methods) =>
  async (...args) => {
    const results = []
    for (const method of methods) {
      const result = await method(...args)
      results.push(result)
    }
    return results
  }

/**
 * Create API method with caching
 */
export const withApiCache = curry((cacheKey, ttl, apiMethod) => {
  const cache = new Map()

  return async (...args) => {
    const key = `${cacheKey}:${JSON.stringify(args)}`
    const cached = cache.get(key)

    if (cached && Date.now() - cached.timestamp < ttl) {
      return cached.data
    }

    const result = await apiMethod(...args)
    cache.set(key, { data: result, timestamp: Date.now() })

    return result
  }
})

/**
 * Create API method with retry logic
 */
export const withApiRetry = curry((maxAttempts, delay, apiMethod) => {
  return async (...args) => {
    let lastError

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return await apiMethod(...args)
      } catch (error) {
        lastError = error

        if (attempt === maxAttempts) break

        const backoffDelay = delay * Math.pow(2, attempt - 1)
        await new Promise((resolve) => setTimeout(resolve, backoffDelay))
      }
    }

    throw lastError
  }
})

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  // Core factory functions
  createBaseApi,
  createApiFactory,

  // Specialized API creators
  createCrudApi,
  createProductApi,
  createWatchApi,
  createJewelryApi,

  // Composition utilities
  composeApiMethods,
  withApiCache,
  withApiRetry,
}
