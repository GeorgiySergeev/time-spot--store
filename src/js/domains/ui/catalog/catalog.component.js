/**
 * Product Catalog Component - Functional Implementation
 * Replaces the legacy class-based ProductCatalogState with pure functional approach
 */

import {
  curry,
  pipe,
  compose,
  map,
  filter,
  merge,
  tap,
  trace,
} from '../../../core/functional.utils.js'
import {
  createComponent,
  clickEffect,
  inputEffect,
  withState,
} from '../../../core/component.system.js'
import {
  createStore,
  createActions,
  createAsyncActions,
} from '../../../core/state.management.js'
import {
  h,
  Fragment,
  when,
  mapTemplate,
  classNames,
} from '../../../core/template.system.js'
import {
  ProductCard,
  ProductListItem,
  LoadingState,
  ErrorState,
  EmptyState,
  ProductCount,
} from '../../products/shared/product.templates.js'
import { createWatchService } from '../../products/watch/watch.service.js'
import { createJewelryService } from '../../products/jewelry/jewelry.service.js'

// ============================================================================
// CATALOG STATE MANAGEMENT
// ============================================================================

/**
 * Catalog action types
 */
const CATALOG_ACTIONS = {
  LOAD_PRODUCTS_START: 'LOAD_PRODUCTS_START',
  LOAD_PRODUCTS_SUCCESS: 'LOAD_PRODUCTS_SUCCESS',
  LOAD_PRODUCTS_ERROR: 'LOAD_PRODUCTS_ERROR',
  UPDATE_FILTERS: 'UPDATE_FILTERS',
  UPDATE_SORT: 'UPDATE_SORT',
  UPDATE_VIEW: 'UPDATE_VIEW',
  UPDATE_PAGE: 'UPDATE_PAGE',
  CLEAR_FILTERS: 'CLEAR_FILTERS',
  SET_SEARCH_QUERY: 'SET_SEARCH_QUERY',
}

/**
 * Create catalog actions
 */
const catalogActions = createActions(CATALOG_ACTIONS)
const catalogAsyncActions = createAsyncActions({
  LOAD_PRODUCTS: 'LOAD_PRODUCTS',
})

/**
 * Catalog reducers
 */
const catalogReducers = {
  [CATALOG_ACTIONS.LOAD_PRODUCTS_START]: (state) => ({
    ...state,
    loading: true,
    error: null,
  }),

  [CATALOG_ACTIONS.LOAD_PRODUCTS_SUCCESS]: (state, { payload }) => ({
    ...state,
    loading: false,
    products: payload.products,
    filteredProducts: payload.products,
    availableFilters: payload.filters,
    total: payload.products.length,
    error: null,
  }),

  [CATALOG_ACTIONS.LOAD_PRODUCTS_ERROR]: (state, { payload }) => ({
    ...state,
    loading: false,
    error: payload.error || payload.message || 'Unknown error',
  }),

  [CATALOG_ACTIONS.UPDATE_FILTERS]: (state, { payload }) => ({
    ...state,
    currentFilters: { ...state.currentFilters, ...payload },
    currentPage: 1,
  }),

  [CATALOG_ACTIONS.UPDATE_SORT]: (state, { payload }) => ({
    ...state,
    currentSort: payload,
    currentPage: 1,
  }),

  [CATALOG_ACTIONS.UPDATE_VIEW]: (state, { payload }) => ({
    ...state,
    currentView: payload,
  }),

  [CATALOG_ACTIONS.UPDATE_PAGE]: (state, { payload }) => ({
    ...state,
    currentPage: payload,
  }),

  [CATALOG_ACTIONS.CLEAR_FILTERS]: (state) => ({
    ...state,
    currentFilters: {},
    currentSort: '',
    currentPage: 1,
    searchQuery: '',
  }),

  [CATALOG_ACTIONS.SET_SEARCH_QUERY]: (state, { payload }) => ({
    ...state,
    searchQuery: payload,
    currentPage: 1,
  }),
}

/**
 * Create catalog store
 */
const createCatalogStore = () =>
  createStore(
    {
      // Products data
      products: [],
      filteredProducts: [],
      availableFilters: {
        brands: [],
        categories: [],
        priceRange: { min: 0, max: 5000 },
      },

      // UI state
      loading: false,
      error: null,

      // Filter state
      currentFilters: {},
      currentSort: '',
      currentView: 'grid',
      currentPage: 1,
      productsPerPage: 12,
      searchQuery: '',

      // Pagination
      total: 0,
    },
    catalogReducers,
  )

// ============================================================================
// CATALOG BUSINESS LOGIC
// ============================================================================

/**
 * Load products with service
 */
const loadProducts = curry(async (service, filters, dispatch) => {
  dispatch(catalogActions.LOAD_PRODUCTS_START())

  try {
    const result = await service.fetchProducts(filters)
    dispatch(catalogActions.LOAD_PRODUCTS_SUCCESS(result))
    return result
  } catch (error) {
    dispatch(catalogActions.LOAD_PRODUCTS_ERROR({ error: error.message }))
    throw error
  }
})

/**
 * Apply filters to products
 */
const applyFilters = curry((filters, products) => {
  // Null safety checks
  if (!products || !Array.isArray(products)) {
    return []
  }

  if (!filters || Object.keys(filters).length === 0) {
    return products
  }

  return products.filter((product) => {
    // Null safety for product
    if (!product) return false

    // Price range filter
    if (
      filters.priceMin !== undefined &&
      (product.price || 0) < filters.priceMin
    ) {
      return false
    }
    if (
      filters.priceMax !== undefined &&
      (product.price || 0) > filters.priceMax
    ) {
      return false
    }

    // Brand filter
    if (filters.brands && filters.brands.length > 0) {
      if (!filters.brands.includes(product.brand || '')) {
        return false
      }
    }

    // Category filter
    if (filters.category && (product.category || '') !== filters.category) {
      return false
    }

    // Stock filter
    if (filters.inStockOnly && !product.inStock) {
      return false
    }

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      const searchText =
        `${product.brand || ''} ${product.model || ''} ${product.category || ''}`.toLowerCase()
      if (!searchText.includes(searchLower)) {
        return false
      }
    }

    return true
  })
})

/**
 * Apply sorting to products
 */
const applySorting = curry((sortBy, products) => {
  if (!products || !Array.isArray(products)) {
    return []
  }

  if (!sortBy) return products

  const [field, direction = 'asc'] = sortBy.split('_')
  const isDesc = direction === 'desc'

  return [...products].sort((a, b) => {
    // Null safety
    if (!a || !b) return 0

    let aVal, bVal

    switch (field) {
      case 'price':
        aVal = a.price || 0
        bVal = b.price || 0
        break
      case 'name':
        aVal = (a.name || '').toLowerCase()
        bVal = (b.name || '').toLowerCase()
        break
      case 'brand':
        aVal = (a.brand || '').toLowerCase()
        bVal = (b.brand || '').toLowerCase()
        break
      default:
        return 0
    }

    if (aVal < bVal) return isDesc ? 1 : -1
    if (aVal > bVal) return isDesc ? -1 : 1
    return 0
  })
})

/**
 * Apply pagination to products
 */
const applyPagination = curry((page, perPage, products) => {
  if (!products || !Array.isArray(products)) {
    return {
      products: [],
      pagination: {
        currentPage: 1,
        totalPages: 0,
        totalItems: 0,
        startIndex: 0,
        endIndex: 0,
        hasNextPage: false,
        hasPrevPage: false,
      },
    }
  }

  const start = (page - 1) * perPage
  const end = start + perPage

  return {
    products: products.slice(start, end),
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(products.length / perPage),
      totalItems: products.length,
      startIndex: start + 1,
      endIndex: Math.min(end, products.length),
      hasNextPage: end < products.length,
      hasPrevPage: page > 1,
    },
  }
})

// ============================================================================
// CATALOG TEMPLATE
// ============================================================================

/**
 * Catalog template
 */
const CatalogTemplate = (props, state, context) => {
  // Get store state or fallback to default state
  const storeState = state.store
    ? state.store.getState()
    : {
        products: [],
        loading: false,
        error: null,
        currentView: 'grid',
        currentFilters: {},
        currentPage: 1,
        productsPerPage: props.productsPerPage || 12,
      }

  const {
    products,
    loading,
    error,
    currentView,
    currentFilters,
    currentPage,
    productsPerPage,
  } = storeState

  // Process products through the pipeline
  const processedProducts = pipe(
    applyFilters(currentFilters),
    applySorting(props.currentSort),
    applyPagination(currentPage, productsPerPage),
  )(products)

  return h(
    'div',
    { className: 'catalog-container' },
    when(loading, LoadingState()),
    when(
      error && !loading,
      ErrorState(
        error,
        () => context.loadProducts(),
        () => context.showSamples(),
      ),
    ),
    when(
      !loading && !error && processedProducts.products.length === 0,
      EmptyState(currentFilters),
    ),
    when(
      !loading && !error && processedProducts.products.length > 0,
      Fragment(
        // Product count
        ProductCount(
          processedProducts.pagination.totalItems,
          processedProducts.pagination.startIndex,
          processedProducts.pagination.endIndex,
        ),

        // Products grid/list
        h(
          'div',
          {
            className: classNames('products-container', {
              'grid-view': currentView === 'grid',
              'list-view': currentView === 'list',
            }),
          },
          currentView === 'grid'
            ? h(
                'div',
                { className: 'row' },
                mapTemplate(
                  (product) =>
                    h(
                      'div',
                      { className: 'col-lg-3 col-md-6' },
                      ProductCard(product),
                    ),
                  processedProducts.products,
                ),
              )
            : h(
                'div',
                { className: 'products-list' },
                mapTemplate(ProductListItem, processedProducts.products),
              ),
        ),

        // Pagination (if needed)
        when(
          processedProducts.pagination.totalPages > 1,
          PaginationComponent(processedProducts.pagination, context.goToPage),
        ),
      ),
    ),
  )
}

/**
 * Pagination component
 */
const PaginationComponent = (pagination, onPageChange) => {
  const { currentPage, totalPages, hasNextPage, hasPrevPage } = pagination

  return h(
    'div',
    { className: 'pagination-area' },
    h(
      'ul',
      { className: 'pagination-box' },
      when(
        hasPrevPage,
        h(
          'li',
          h(
            'a',
            {
              href: '#',
              onClick: (e) => {
                e.preventDefault()
                onPageChange(currentPage - 1)
              },
            },
            'Предыдущая',
          ),
        ),
      ),

      // Page numbers (simplified - show current and adjacent pages)
      ...Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
        const pageNum = Math.max(1, currentPage - 2) + i
        if (pageNum > totalPages) return null

        return h(
          'li',
          {
            className: classNames({ active: pageNum === currentPage }),
          },
          h(
            'a',
            {
              href: '#',
              onClick: (e) => {
                e.preventDefault()
                onPageChange(pageNum)
              },
            },
            pageNum.toString(),
          ),
        )
      }).filter(Boolean),

      when(
        hasNextPage,
        h(
          'li',
          h(
            'a',
            {
              href: '#',
              onClick: (e) => {
                e.preventDefault()
                onPageChange(currentPage + 1)
              },
            },
            'Следующая',
          ),
        ),
      ),
    ),
  )
}

// ============================================================================
// CATALOG COMPONENT
// ============================================================================

/**
 * Create catalog component
 */
export const createCatalogComponent = (config = {}) => {
  const {
    category = 'watch',
    containerId = 'products',
    productsPerPage = 12,
  } = config

  // Create appropriate service based on category
  const service =
    category === 'jewelry'
      ? createJewelryService(config)
      : createWatchService(config)

  return createComponent('ProductCatalog', CatalogTemplate, {
    defaultProps: {
      category,
      containerId,
      productsPerPage,
    },

    effects: [
      // Search input effect
      inputEffect(
        '#product-search',
        (name, value, event, props, state, context) => {
          const store = state.store
          if (!store) return

          store.dispatch(catalogActions.SET_SEARCH_QUERY(value))

          // Debounced search - store timeout in a variable that won't conflict
          if (window.catalogSearchTimeout) {
            clearTimeout(window.catalogSearchTimeout)
          }

          window.catalogSearchTimeout = setTimeout(() => {
            const currentState = store.getState()
            const filters = { ...currentState.currentFilters, search: value }
            store.dispatch(catalogActions.UPDATE_FILTERS(filters))
          }, 300)
        },
      ),

      // Product card click effects
      clickEffect('.product-detail-link', (event, props, state) => {
        event.preventDefault()
        const productId =
          event.target.closest('[data-product-id]')?.dataset.productId
        if (productId) {
          window.location.href = `product-details.html?id=${productId}`
        }
      }),
    ],

    lifecycle: {
      created: (instance, props, state, context) => {
        // Create store
        const store = createCatalogStore()

        // Add store to state using setState
        instance.setState((currentState) => ({
          ...currentState,
          store,
        }))

        // Subscribe to store changes
        store.subscribe((newState) => {
          instance.setState((currentState) => ({
            ...currentState,
            ...newState,
          }))
        })

        // Create context methods
        Object.assign(context, {
          loadProducts: async (filters = {}) => {
            const currentState = instance.getState()
            const store = currentState.store
            if (!store) return

            const storeState = store.getState()
            const finalFilters = { ...storeState.currentFilters, ...filters }
            await loadProducts(service, finalFilters, store.dispatch)
          },

          updateFilters: (filters) => {
            const currentState = instance.getState()
            const store = currentState.store
            if (store) {
              store.dispatch(catalogActions.UPDATE_FILTERS(filters))
            }
          },

          updateSort: (sort) => {
            const currentState = instance.getState()
            const store = currentState.store
            if (store) {
              store.dispatch(catalogActions.UPDATE_SORT(sort))
            }
          },

          updateView: (view) => {
            const currentState = instance.getState()
            const store = currentState.store
            if (store) {
              store.dispatch(catalogActions.UPDATE_VIEW(view))
            }
          },

          goToPage: (page) => {
            const currentState = instance.getState()
            const store = currentState.store
            if (store) {
              store.dispatch(catalogActions.UPDATE_PAGE(page))
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }
          },

          clearFilters: () => {
            const currentState = instance.getState()
            const store = currentState.store
            if (store) {
              store.dispatch(catalogActions.CLEAR_FILTERS())
            }
          },

          search: (query) => {
            const currentState = instance.getState()
            const store = currentState.store
            if (store) {
              store.dispatch(catalogActions.SET_SEARCH_QUERY(query))
              const storeState = store.getState()
              const filters = { ...storeState.currentFilters, search: query }
              store.dispatch(catalogActions.UPDATE_FILTERS(filters))
            }
          },

          showSamples: () => {
            const currentState = instance.getState()
            const store = currentState.store
            if (store) {
              // Load sample data for fallback
              const sampleProducts = getSampleProducts(props.category)
              store.dispatch(
                catalogActions.LOAD_PRODUCTS_SUCCESS({
                  products: sampleProducts,
                  filters: extractFiltersFromProducts(sampleProducts),
                }),
              )
            }
          },
        })

        // Initial load (delayed to ensure store is ready)
        setTimeout(() => {
          context.loadProducts()
        }, 0)
      },
    },
  })
}

// ============================================================================
// SAMPLE DATA
// ============================================================================

/**
 * Get sample products for fallback
 */
const getSampleProducts = (category) => {
  const baseProducts = [
    {
      id: 1,
      brand: 'Rolex',
      model: 'Submariner',
      name: 'Rolex Submariner',
      price: 8500,
      imageUrl: '/img/products/1-1-450x450.jpg',
      category: 'watch',
      inStock: true,
      formattedPrice: '$8,500',
      sku: 'rolex-submariner',
    },
    {
      id: 2,
      brand: 'Cartier',
      model: 'Love Ring',
      name: 'Cartier Love Ring',
      price: 1200,
      imageUrl: '/img/products/2-2-450x450.jpg',
      category: 'jewelry',
      inStock: true,
      formattedPrice: '$1,200',
      sku: 'cartier-love-ring',
    },
  ]

  return baseProducts.filter((p) => p.category === category)
}

/**
 * Extract filters from products
 */
const extractFiltersFromProducts = (products) => {
  const brands = [...new Set(products.map((p) => p.brand))]
  const categories = [...new Set(products.map((p) => p.category))]
  const priceRange = products.reduce(
    (acc, p) => ({
      min: Math.min(acc.min, p.price),
      max: Math.max(acc.max, p.price),
    }),
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

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  createCatalogComponent,
  CATALOG_ACTIONS,
  catalogActions,
  catalogAsyncActions,
}
