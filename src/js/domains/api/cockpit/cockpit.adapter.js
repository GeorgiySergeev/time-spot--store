/**
 * Cockpit CMS Adapter
 * Functional adapter for Cockpit CMS API integration
 */

import {
  curry,
  pipe,
  compose,
  merge,
  map,
  filter,
  prop,
  path,
  isNil,
  isNotNil,
} from '../../../core/functional.utils.js'

// ============================================================================
// COCKPIT CONFIGURATION
// ============================================================================

/**
 * Default Cockpit CMS configuration
 */
export const defaultCockpitConfig = {
  apiKey: 'API-7c2cde63ceaca7aa2da97700466244e1f4f59c6e',
  baseUrl: 'https://websphere.miy.link/admin/api',
  imageBaseUrl: 'https://websphere.miy.link/admin/storage/uploads',
  defaultImage: '/img/default/single-product-item.jpg',
  timeout: 15000,
  retryAttempts: 3,
  retryDelay: 1000,
  debug: false,
}

/**
 * Cockpit API endpoints
 */
export const cockpitEndpoints = {
  watch: '/content/items/watch',
  jewelry: '/content/items/jewelry',
  accessories: '/content/items/accessories',
  watchById: '/content/item/watch',
  jewelryById: '/content/item/jewelry',
  accessoriesById: '/content/item/accessories',
}

// ============================================================================
// REQUEST TRANSFORMATION
// ============================================================================

/**
 * Transform request for Cockpit CMS
 */
export const transformCockpitRequest = curry((config, request) => ({
  ...request,
  headers: {
    ...request.headers,
    'Content-Type': 'application/json',
    Accept: 'application/json',
    Authorization: `Bearer ${config.apiKey}`,
    'api-key': config.apiKey,
  },
}))

/**
 * Build Cockpit API query parameters
 */
export const buildCockpitQuery = (filters = {}) => {
  const query = new URLSearchParams()

  // Category filter
  if (filters.category) {
    query.append('filter[category]', filters.category)
  }

  // Price range filters
  if (filters.priceMin !== undefined) {
    query.append('filter[price][$gte]', filters.priceMin)
  }
  if (filters.priceMax !== undefined) {
    query.append('filter[price][$lte]', filters.priceMax)
  }

  // Brand filter
  if (filters.brands && filters.brands.length > 0) {
    query.append('filter[brand][$in]', filters.brands.join(','))
  }

  // Search filter
  if (filters.search) {
    query.append('filter[$or][0][model][$regex]', filters.search)
    query.append('filter[$or][1][brand][$regex]', filters.search)
  }

  // Stock filter
  if (filters.inStock !== undefined) {
    query.append('filter[in_stock]', filters.inStock)
  }

  // Sorting
  if (filters.sort) {
    const [field, direction] = filters.sort.split('_')
    query.append('sort', direction === 'desc' ? `-${field}` : field)
  }

  // Pagination
  if (filters.limit) {
    query.append('limit', filters.limit)
  }
  if (filters.skip) {
    query.append('skip', filters.skip)
  }

  return query.toString()
}

// ============================================================================
// RESPONSE TRANSFORMATION
// ============================================================================

/**
 * Transform Cockpit CMS response
 */
export const transformCockpitResponse = curry((config, response) => {
  // Handle null or undefined responses
  if (!response) {
    return {
      data: [],
      meta: {
        total: 0,
        page: 1,
        limit: 50,
      },
    }
  }

  // Handle different response structures
  const data = response.data || response

  return {
    data: data?.entries || data?.data || data || [],
    meta: {
      total: data?.total || (Array.isArray(data) ? data.length : 0),
      page: data?.page || 1,
      limit: data?.limit || 50,
    },
  }
})

/**
 * Get image URL from Cockpit CMS
 */
export const getCockpitImageUrl = curry((config, imagePath) => {
  if (!imagePath) return config.defaultImage

  if (imagePath.startsWith('http')) return imagePath

  // Handle Cockpit image object
  if (typeof imagePath === 'object' && imagePath.path) {
    return `${config.imageBaseUrl}/${imagePath.path}`
  }

  // Handle direct path
  return `${config.imageBaseUrl}/${imagePath}`
})

/**
 * Normalize Cockpit product data
 */
export const normalizeCockpitProduct = curry((config, product) => {
  if (!product || typeof product !== 'object') return null

  return {
    id: product.id || product._id,
    brand: product.brand || 'Unknown Brand',
    model: product.model || 'Unknown Model',
    name:
      `${product.brand || ''} ${product.model || ''}`.trim() ||
      'Untitled Product',
    price: parseFloat(product.price) || 0,
    imageUrl: getCockpitImageUrl(config, product.img),
    category: product.category || 'watch',
    inStock: product.in_stock !== false,
    url: `product-details.html?id=${product.id || product._id}`,
    formattedPrice: formatPrice(product.price),
    sku: `${product.brand}-${product.model}`.replace(/\s+/g, '-').toLowerCase(),

    // Additional fields that might be present
    description: product.description || '',
    specifications: product.specifications || {},
    images: product.images || [],
    tags: product.tags || [],
    rating: product.rating || 0,
    reviewCount: product.reviewCount || 0,

    // Timestamps
    createdAt: product._created || product.createdAt,
    updatedAt: product._modified || product.updatedAt,
  }
})

/**
 * Format price utility
 */
const formatPrice = (price) => {
  const numPrice = parseFloat(price) || 0
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(numPrice)
}

// ============================================================================
// VALIDATION
// ============================================================================

/**
 * Validate Cockpit API response
 */
export const validateCockpitResponse = (response) => {
  if (!response) {
    return { isValid: false, error: 'Response is null or undefined' }
  }

  if (response.error) {
    return { isValid: false, error: response.error }
  }

  return { isValid: true }
}

/**
 * Validate product data
 */
export const validateProductData = (product) => {
  if (!product) {
    return { isValid: false, error: 'Product is null or undefined' }
  }

  if (!product.id && !product._id) {
    return { isValid: false, error: 'Product must have an ID' }
  }

  return { isValid: true }
}

// ============================================================================
// ERROR HANDLING
// ============================================================================

/**
 * Handle Cockpit API errors
 */
export const handleCockpitError = (error) => {
  const errorInfo = {
    message: error.message || 'Unknown error',
    status: error.response?.status,
    statusText: error.response?.statusText,
    url: error.config?.url,
    method: error.config?.method,
    timestamp: new Date().toISOString(),
  }

  // Log error details
  console.error('Cockpit API Error:', errorInfo)

  // Return structured error
  return {
    type: 'COCKPIT_API_ERROR',
    ...errorInfo,
  }
}

// ============================================================================
// COCKPIT ADAPTER FACTORY
// ============================================================================

/**
 * Create Cockpit CMS adapter
 */
export const createCockpitAdapter = (config = {}) => {
  const finalConfig = merge(defaultCockpitConfig, config)

  return {
    // Configuration
    config: finalConfig,

    // Request transformation
    transformRequest: transformCockpitRequest(finalConfig),

    // Response transformation
    transformResponse: transformCockpitResponse(finalConfig),

    // Data normalization
    normalizeProduct: normalizeCockpitProduct(finalConfig),

    // Query building
    buildQuery: buildCockpitQuery,

    // Image URL handling
    getImageUrl: getCockpitImageUrl(finalConfig),

    // Validation
    validateResponse: validateCockpitResponse,
    validateProduct: validateProductData,

    // Error handling
    handleError: handleCockpitError,

    // Endpoints
    endpoints: cockpitEndpoints,

    // Utility methods
    formatPrice,

    // Composed transformations
    processResponse: pipe(
      transformCockpitResponse(finalConfig),
      (response) => ({
        ...response,
        data: Array.isArray(response.data)
          ? response.data
              .map(normalizeCockpitProduct(finalConfig))
              .filter(isNotNil)
          : response.data
            ? normalizeCockpitProduct(finalConfig)(response.data)
            : null,
      }),
    ),

    // Extract filters from products
    extractFilters: (products) => {
      if (!products || !Array.isArray(products) || products.length === 0) {
        return {
          brands: [],
          categories: [],
          priceRange: { min: 0, max: 0 },
        }
      }

      const brands = [...new Set(products.map(prop('brand')).filter(isNotNil))]
      const categories = [
        ...new Set(products.map(prop('category')).filter(isNotNil)),
      ]
      const priceRange = products.reduce(
        (acc, product) => {
          const price = product.price || 0
          acc.min = Math.min(acc.min, price)
          acc.max = Math.max(acc.max, price)
          return acc
        },
        { min: Infinity, max: 0 },
      )

      return {
        brands: brands.sort(),
        categories: categories.sort(),
        priceRange: {
          min: priceRange.min === Infinity ? 0 : priceRange.min,
          max: priceRange.max,
        },
      }
    },
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  // Configuration
  defaultCockpitConfig,
  cockpitEndpoints,

  // Transformation functions
  transformCockpitRequest,
  transformCockpitResponse,
  buildCockpitQuery,
  getCockpitImageUrl,
  normalizeCockpitProduct,

  // Validation functions
  validateCockpitResponse,
  validateProductData,

  // Error handling
  handleCockpitError,

  // Factory function
  createCockpitAdapter,
}
