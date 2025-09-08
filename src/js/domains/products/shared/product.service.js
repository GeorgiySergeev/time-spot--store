/**
 * Product Service - Functional Product Operations
 * Domain service for product-related business logic
 */

import {
  curry,
  pipe,
  compose,
  map,
  filter,
  sortBy,
  groupBy,
  prop,
  path,
  merge,
  isNil,
  isNotNil,
  memoizeWithTTL,
} from '../../../core/functional.utils.js'
import { createApiFactory } from '../../api/core/api.factory.js'
import { createCockpitAdapter } from '../../api/cockpit/cockpit.adapter.js'

// ============================================================================
// SERVICE CONFIGURATION
// ============================================================================

/**
 * Default product service configuration
 */
export const defaultProductConfig = {
  cacheTimeout: 300000, // 5 minutes
  retryAttempts: 3,
  retryDelay: 1000,
  debug: false,
}

// ============================================================================
// PRODUCT TRANSFORMATIONS
// ============================================================================

/**
 * Add computed fields to product
 */
export const addComputedFields = (product) => {
  if (!product) return null

  return {
    ...product,
    displayName:
      product.name || `${product.brand || ''} ${product.model || ''}`.trim(),
    isAvailable: Boolean(product.inStock && product.price > 0),
    priceCategory: getPriceCategory(product.price || 0),
    searchText:
      `${product.brand || ''} ${product.model || ''} ${product.category || ''}`.toLowerCase(),
  }
}

/**
 * Get price category for product
 */
const getPriceCategory = (price) => {
  if (price < 1000) return 'budget'
  if (price < 5000) return 'mid-range'
  if (price < 10000) return 'premium'
  return 'luxury'
}

/**
 * Normalize product data
 */
export const normalizeProduct = (product) => {
  if (!product) return null

  return pipe(addComputedFields, (p) => ({
    ...p,
    id: p.id || p._id,
    price: parseFloat(p.price) || 0,
    inStock: p.inStock !== false,
    imageUrl: p.imageUrl || '/img/default/single-product-item.jpg',
  }))(product)
}

/**
 * Normalize array of products
 */
export const normalizeProducts = map(normalizeProduct)

// ============================================================================
// FILTERING FUNCTIONS
// ============================================================================

/**
 * Create product filter function
 */
export const createProductFilter = (criteria) => (product) => {
  // Price range filter
  if (criteria.priceMin !== undefined && product.price < criteria.priceMin) {
    return false
  }
  if (criteria.priceMax !== undefined && product.price > criteria.priceMax) {
    return false
  }

  // Brand filter
  if (criteria.brands && criteria.brands.length > 0) {
    if (!criteria.brands.includes(product.brand)) {
      return false
    }
  }

  // Category filter
  if (criteria.category && product.category !== criteria.category) {
    return false
  }

  // Stock filter
  if (criteria.inStockOnly && !product.inStock) {
    return false
  }

  // Search filter
  if (criteria.search) {
    const searchLower = criteria.search.toLowerCase()
    if (!product.searchText.includes(searchLower)) {
      return false
    }
  }

  // Price category filter
  if (
    criteria.priceCategory &&
    product.priceCategory !== criteria.priceCategory
  ) {
    return false
  }

  return true
}

/**
 * Filter products by criteria
 */
export const filterProducts = curry((criteria, products) =>
  products.filter(createProductFilter(criteria)),
)

// ============================================================================
// SORTING FUNCTIONS
// ============================================================================

/**
 * Create product sorter function
 */
export const createProductSorter = (sortBy) => {
  const [field, direction = 'asc'] = sortBy.split('_')
  const isDesc = direction === 'desc'

  return (a, b) => {
    let aVal, bVal

    switch (field) {
      case 'price':
        aVal = a.price
        bVal = b.price
        break
      case 'name':
        aVal = a.displayName.toLowerCase()
        bVal = b.displayName.toLowerCase()
        break
      case 'brand':
        aVal = a.brand.toLowerCase()
        bVal = b.brand.toLowerCase()
        break
      case 'created':
        aVal = new Date(a.createdAt || 0)
        bVal = new Date(b.createdAt || 0)
        break
      default:
        return 0
    }

    if (aVal < bVal) return isDesc ? 1 : -1
    if (aVal > bVal) return isDesc ? -1 : 1
    return 0
  }
}

/**
 * Sort products
 */
export const sortProducts = curry((sortBy, products) => {
  if (!sortBy) return products
  return [...products].sort(createProductSorter(sortBy))
})

// ============================================================================
// PAGINATION FUNCTIONS
// ============================================================================

/**
 * Create pagination result
 */
export const createPagination = curry((products, page, perPage) => {
  const start = (page - 1) * perPage
  const end = start + perPage

  return {
    products: products.slice(start, end),
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(products.length / perPage),
      totalItems: products.length,
      itemsPerPage: perPage,
      startIndex: start + 1,
      endIndex: Math.min(end, products.length),
      hasNextPage: end < products.length,
      hasPrevPage: page > 1,
    },
  }
})

// ============================================================================
// AGGREGATION FUNCTIONS
// ============================================================================

/**
 * Extract filter options from products
 */
export const extractFilterOptions = (products) => {
  const brands = [...new Set(products.map(prop('brand')).filter(isNotNil))]
  const categories = [
    ...new Set(products.map(prop('category')).filter(isNotNil)),
  ]
  const priceCategories = [
    ...new Set(products.map(prop('priceCategory')).filter(isNotNil)),
  ]

  const priceRange = products.reduce(
    (acc, product) => {
      acc.min = Math.min(acc.min, product.price || 0)
      acc.max = Math.max(acc.max, product.price || 0)
      return acc
    },
    { min: Infinity, max: 0 },
  )

  return {
    brands: brands.sort(),
    categories: categories.sort(),
    priceCategories: priceCategories.sort(),
    priceRange: {
      min: priceRange.min === Infinity ? 0 : priceRange.min,
      max: priceRange.max,
    },
  }
}

/**
 * Group products by category
 */
export const groupProductsByCategory = groupBy(prop('category'))

/**
 * Group products by brand
 */
export const groupProductsByBrand = groupBy(prop('brand'))

/**
 * Group products by price category
 */
export const groupProductsByPriceCategory = groupBy(prop('priceCategory'))

// ============================================================================
// PRODUCT SERVICE FACTORY
// ============================================================================

/**
 * Create product service
 */
export const createProductService = (config = {}) => {
  const finalConfig = merge(defaultProductConfig, config)

  // Create Cockpit adapter
  const cockpitAdapter = createCockpitAdapter(finalConfig)

  // Create API factory with Cockpit configuration
  const apiFactory = createApiFactory({
    baseURL: cockpitAdapter.config.baseUrl,
    timeout: cockpitAdapter.config.timeout,
    retryAttempts: cockpitAdapter.config.retryAttempts,
    retryDelay: cockpitAdapter.config.retryDelay,
    debug: cockpitAdapter.config.debug,
    authHeadersProvider: () => ({
      Authorization: `Bearer ${cockpitAdapter.config.apiKey}`,
      'api-key': cockpitAdapter.config.apiKey,
    }),
  })

  // Create product API
  const productApi = apiFactory.createProductApi({
    transformProduct: cockpitAdapter.normalizeProduct,
    validateProduct: cockpitAdapter.validateProduct,
  })

  // Memoized functions for performance
  const memoizedFetchProducts = memoizeWithTTL(
    productApi.list,
    finalConfig.cacheTimeout,
    (filters) => JSON.stringify(filters),
  )

  const memoizedFetchById = memoizeWithTTL(
    productApi.read,
    finalConfig.cacheTimeout,
    (params) => JSON.stringify(params),
  )

  return {
    // Core API methods
    fetchProducts: async (filters = {}) => {
      try {
        const queryString = cockpitAdapter.buildQuery(filters)
        const url = queryString
          ? `${cockpitAdapter.endpoints.watch}?${queryString}`
          : cockpitAdapter.endpoints.watch

        const response = await apiFactory.getBaseApi().getWithMiddleware(url)
        const processedResponse = cockpitAdapter.processResponse(response)

        return {
          products: Array.isArray(processedResponse.data)
            ? processedResponse.data
            : [processedResponse.data].filter(isNotNil),
          meta: processedResponse.meta,
          filters: extractFilterOptions(processedResponse.data),
        }
      } catch (error) {
        throw cockpitAdapter.handleError(error)
      }
    },

    fetchById: async (id) => {
      try {
        const url = `${cockpitAdapter.endpoints.watchById}/${id}`
        const response = await apiFactory.getBaseApi().getWithMiddleware(url)
        const processedResponse = cockpitAdapter.processResponse(response)

        return processedResponse.data
      } catch (error) {
        throw cockpitAdapter.handleError(error)
      }
    },

    // Cached versions
    fetchProductsCached: memoizedFetchProducts,
    fetchByIdCached: memoizedFetchById,

    // Pure transformation functions
    normalizeProduct,
    normalizeProducts,
    filterProducts,
    sortProducts,
    createPagination,
    extractFilterOptions,

    // Grouping functions
    groupProductsByCategory,
    groupProductsByBrand,
    groupProductsByPriceCategory,

    // Search functionality
    searchProducts: async (query, filters = {}) => {
      const searchFilters = { ...filters, search: query }
      return await this.fetchProducts(searchFilters)
    },

    // Category-specific methods
    fetchByCategory: async (category, filters = {}) => {
      const categoryFilters = { ...filters, category }
      return await this.fetchProducts(categoryFilters)
    },

    // Brand-specific methods
    fetchByBrand: async (brand, filters = {}) => {
      const brandFilters = { ...filters, brands: [brand] }
      return await this.fetchProducts(brandFilters)
    },

    // Price range methods
    fetchInPriceRange: async (minPrice, maxPrice, filters = {}) => {
      const priceFilters = {
        ...filters,
        priceMin: minPrice,
        priceMax: maxPrice,
      }
      return await this.fetchProducts(priceFilters)
    },

    // Stock methods
    fetchInStock: async (filters = {}) => {
      const stockFilters = { ...filters, inStockOnly: true }
      return await this.fetchProducts(stockFilters)
    },

    // Utility methods
    getImageUrl: cockpitAdapter.getImageUrl,
    formatPrice: cockpitAdapter.formatPrice,

    // Configuration
    config: finalConfig,
    adapter: cockpitAdapter,
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  // Configuration
  defaultProductConfig,

  // Service factory
  createProductService,

  // Transformation functions
  normalizeProduct,
  normalizeProducts,
  addComputedFields,

  // Filtering functions
  createProductFilter,
  filterProducts,

  // Sorting functions
  createProductSorter,
  sortProducts,

  // Pagination functions
  createPagination,

  // Aggregation functions
  extractFilterOptions,
  groupProductsByCategory,
  groupProductsByBrand,
  groupProductsByPriceCategory,
}
