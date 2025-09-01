import axios from 'axios'
import { handleApiError, validateApiResponse } from './api-utils.js'
import {
  API_CONFIG,
  validateConfig,
  getApiUrl,
  getApiHeaders,
  buildApiQuery,
  normalizeProduct,
} from './config.js'

// Get products with optional filtering
const getProducts = async (filters = {}) => {
  try {
    // Validate configuration first
    if (!validateConfig()) {
      throw new Error('API configuration is invalid')
    }

    const baseUrl = getApiUrl(API_CONFIG.ENDPOINTS.PRODUCTS)
    const queryString = buildApiQuery(filters)
    const url = queryString ? `${baseUrl}?${queryString}` : baseUrl

    if (API_CONFIG.DEBUG) {
      console.log('Fetching products from:', url)
    }

    const headers = getApiHeaders()

    const response = await axios.get(url, {
      headers: headers,
      timeout: API_CONFIG.TIMEOUT,
      validateStatus: (status) => status >= 200 && status < 300,
    })

    const data = validateApiResponse(response.data)

    // Normalize products according to confirmed CMS structure
    const products = Array.isArray(data)
      ? data
      : data.entries || data.data || []
    const normalizedProducts = products.map(normalizeProduct)

    if (API_CONFIG.DEBUG) {
      console.log(`✅ Loaded ${normalizedProducts.length} products`)
    }

    return {
      products: normalizedProducts,
      total: normalizedProducts.length,
      filters: extractFiltersFromProducts(normalizedProducts),
    }
  } catch (error) {
    const errorInfo = handleApiError(error)

    // Log errors if enabled
    if (API_CONFIG.LOG_ERRORS) {
      console.error('API Error occurred:', errorInfo)
    }

    // Re-throw the error so calling code can handle it
    throw error
  }
}

// Extract filter options from products data
const extractFiltersFromProducts = (products) => {
  const brands = [...new Set(products.map((p) => p.brand).filter(Boolean))]
  const categories = [
    ...new Set(products.map((p) => p.category).filter(Boolean)),
  ]
  const priceRange = products.reduce(
    (acc, p) => {
      acc.min = Math.min(acc.min, p.price || 0)
      acc.max = Math.max(acc.max, p.price || 0)
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
}

// Get single product by ID
const getProductById = async (productId) => {
  try {
    // Validate configuration first
    if (!validateConfig()) {
      throw new Error('API configuration is invalid')
    }

    // Construct URL with product ID
    const url = getApiUrl(`${API_CONFIG.ENDPOINTS.PRODUCT_BY_ID}/${productId}`)

    if (API_CONFIG.DEBUG) {
      console.log('Fetching product by ID from:', url)
    }

    const headers = getApiHeaders()

    const response = await axios.get(url, {
      headers: headers,
      timeout: API_CONFIG.TIMEOUT,
      validateStatus: (status) => status >= 200 && status < 300,
    })

    const data = validateApiResponse(response.data)
    return normalizeProduct(data)
  } catch (error) {
    const errorInfo = handleApiError(error)

    // Log errors if enabled
    if (API_CONFIG.LOG_ERRORS) {
      console.error(
        'API Error occurred when fetching product by ID:',
        errorInfo,
      )
    }

    // Re-throw the error so calling code can handle it
    throw error
  }
}

// Get available brands for filters
const getBrands = async () => {
  try {
    const { filters } = await getProducts()
    return filters.brands
  } catch (error) {
    console.error('Failed to load brands:', error)
    return []
  }
}

// Get products by category
const getProductsByCategory = async (category, filters = {}) => {
  return getProducts({ ...filters, category })
}

// Export the functions
export {
  getProducts,
  getProductById,
  getBrands,
  getProductsByCategory,
  extractFiltersFromProducts,
}
