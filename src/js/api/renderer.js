// Unified Product Renderer for Time-Sphere Catalog
// Combines functionality from api/ and api-2/ folders

import { getProducts, getProductById, getBrands } from './api.js'
import {
  createProductCard,
  createProductListItem,
  createLoadingState,
  createErrorState,
  createEmptyState,
  createFilterSidebar,
  createSortControls,
  createProductCount,
  createPagination,
} from './templates.js'
import { API_CONFIG } from './config.js'

// State management
class ProductCatalogState {
  constructor() {
    this.currentFilters = {}
    this.currentSort = ''
    this.currentView = 'grid'
    this.currentPage = 1
    this.productsPerPage = API_CONFIG.UI.PRODUCTS_PER_PAGE
    this.allProducts = []
    this.filteredProducts = []
    this.availableFilters = {
      brands: [],
      categories: [],
      priceRange: { min: 0, max: 5000 },
    }
  }

  updateFilters(newFilters) {
    this.currentFilters = { ...this.currentFilters, ...newFilters }
    this.currentPage = 1 // Reset to first page when filters change
  }

  updateSort(sort) {
    this.currentSort = sort
    this.currentPage = 1
  }

  updateView(view) {
    this.currentView = view
  }

  reset() {
    this.currentFilters = {}
    this.currentSort = ''
    this.currentPage = 1
  }
}

// Global state instance
const catalogState = new ProductCatalogState()

// DOM helpers
const getContainer = (containerId) => {
  const container = document.getElementById(containerId)
  if (!container) {
    console.error(`Container #${containerId} not found`)
  }
  return container
}

const setContent = (container, content) => {
  if (container) {
    container.innerHTML = content
  }
}

// Filter products locally (for better UX)
const filterProducts = (products, filters) => {
  return products.filter((product) => {
    // Price filter
    if (filters.priceMin !== undefined && product.price < filters.priceMin)
      return false
    if (filters.priceMax !== undefined && product.price > filters.priceMax)
      return false

    // Brand filter
    if (
      filters.brands &&
      filters.brands.length > 0 &&
      !filters.brands.includes(product.brand)
    )
      return false

    // Category filter
    if (filters.category && product.category !== filters.category) return false

    // Stock filter
    if (filters.inStockOnly && !product.inStock) return false

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      const matchesName = product.name.toLowerCase().includes(searchLower)
      const matchesBrand = product.brand.toLowerCase().includes(searchLower)
      const matchesModel = product.model.toLowerCase().includes(searchLower)
      if (!matchesName && !matchesBrand && !matchesModel) return false
    }

    return true
  })
}

// Sort products
const sortProducts = (products, sortBy) => {
  if (!sortBy) return products

  const [field, direction] = sortBy.split('_')
  const isDesc = direction === 'desc'

  return [...products].sort((a, b) => {
    let aVal, bVal

    switch (field) {
      case 'price':
        aVal = a.price
        bVal = b.price
        break
      case 'name':
        aVal = a.name.toLowerCase()
        bVal = b.name.toLowerCase()
        break
      default:
        return 0
    }

    if (aVal < bVal) return isDesc ? 1 : -1
    if (aVal > bVal) return isDesc ? -1 : 1
    return 0
  })
}

// Paginate products
const paginateProducts = (products, page, perPage) => {
  const start = (page - 1) * perPage
  const end = start + perPage
  return {
    products: products.slice(start, end),
    totalPages: Math.ceil(products.length / perPage),
    start: start + 1,
    end: Math.min(end, products.length),
    total: products.length,
  }
}

// Render products with current state
const renderProducts = (containerId = API_CONFIG.UI.DEFAULT_CONTAINER) => {
  const container = getContainer(containerId)
  if (!container) return

  try {
    // Apply filters and sorting
    let processedProducts = filterProducts(
      catalogState.allProducts,
      catalogState.currentFilters,
    )
    processedProducts = sortProducts(
      processedProducts,
      catalogState.currentSort,
    )

    // Handle empty results
    if (processedProducts.length === 0) {
      setContent(container, createEmptyState(catalogState.currentFilters))
      updateProductCount(0, 0, 0, 0)
      return
    }

    // Paginate
    const paginated = paginateProducts(
      processedProducts,
      catalogState.currentPage,
      catalogState.productsPerPage,
    )

    // Render products based on view mode
    let content = ''
    if (catalogState.currentView === 'grid') {
      content = `<div class="row">${paginated.products
        .map(
          (product) =>
            `<div class="col-lg-3 col-md-6">${createProductCard(product)}</div>`,
        )
        .join('')}</div>`
    } else {
      content = paginated.products.map(createProductListItem).join('')
    }

    setContent(container, content)

    // Update pagination and product count
    updatePagination(paginated.totalPages)
    updateProductCount(
      paginated.total,
      paginated.start,
      paginated.end,
      catalogState.allProducts.length,
    )

    if (API_CONFIG.DEBUG) {
      console.log(
        `✅ Rendered ${paginated.products.length} products (${catalogState.currentView} view)`,
      )
    }
  } catch (error) {
    console.error('Error rendering products:', error)
    showError(container, error.message, containerId)
  }
}

// Load and render products from API
const loadAndRenderProducts = async (
  containerId = API_CONFIG.UI.DEFAULT_CONTAINER,
  filters = {},
) => {
  const container = getContainer(containerId)
  showLoading(containerId)

  try {
    // Merge with current filters
    const finalFilters = { ...catalogState.currentFilters, ...filters }

    const response = await getProducts(finalFilters)
    catalogState.allProducts = response.products
    catalogState.availableFilters = response.filters

    // Render products
    renderProducts(containerId)

    // Update filter sidebar if it exists
    updateFilterSidebar()
  } catch (error) {
    console.error('Error loading products:', error)
    showError(container, error.message, containerId)
  }
}

// Update filter sidebar
const updateFilterSidebar = () => {
  const sidebar = document.getElementById('filter-sidebar')
  if (sidebar) {
    sidebar.innerHTML = createFilterSidebar(
      catalogState.availableFilters,
      catalogState.currentFilters,
    )
    initializeFilterEvents()
  }
}

// Update pagination
const updatePagination = (totalPages) => {
  const paginationContainer = document.querySelector(
    '.paginatoin-area .pagination-box',
  )
  if (paginationContainer && totalPages > 1) {
    paginationContainer.innerHTML = createPagination(
      catalogState.currentPage,
      totalPages,
      'goToPage',
    )
      .replace('<ul class="pagination-box">', '')
      .replace('</ul>', '')
  }
}

// Update product count display
const updateProductCount = (showing, start, end, total) => {
  const countContainer = document.getElementById('product-count')
  if (countContainer) {
    countContainer.innerHTML = createProductCount(total, start, end)
  }
}

// Show loading state
const showLoading = (containerId) => {
  const container = getContainer(containerId)
  setContent(container, createLoadingState())
}

// Show error state
const showError = (containerOrId, message, containerId) => {
  const container =
    typeof containerOrId === 'string'
      ? getContainer(containerOrId)
      : containerOrId

  const onRetry = `productCatalog.refresh('${containerId}')`
  const onShowSamples = `productCatalog.showSamples('${containerId}')`

  setContent(container, createErrorState(message, onRetry, onShowSamples))
}

// Initialize filter event handlers
const initializeFilterEvents = () => {
  // Price range inputs
  const priceMin = document.getElementById('price-min')
  const priceMax = document.getElementById('price-max')

  if (priceMin && priceMax) {
    const updatePriceFilter = () => {
      catalogState.updateFilters({
        priceMin: parseFloat(priceMin.value) || 0,
        priceMax:
          parseFloat(priceMax.value) ||
          catalogState.availableFilters.priceRange.max,
      })
      renderProducts()
    }

    priceMin.addEventListener('change', updatePriceFilter)
    priceMax.addEventListener('change', updatePriceFilter)
  }

  // Brand checkboxes
  const brandCheckboxes = document.querySelectorAll('.brand-checkbox')
  brandCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener('change', () => {
      const selectedBrands = Array.from(brandCheckboxes)
        .filter((cb) => cb.checked)
        .map((cb) => cb.value)

      catalogState.updateFilters({ brands: selectedBrands })
      renderProducts()
    })
  })

  // Stock filter
  const stockCheckbox = document.getElementById('in-stock-only')
  if (stockCheckbox) {
    stockCheckbox.addEventListener('change', () => {
      catalogState.updateFilters({ inStockOnly: stockCheckbox.checked })
      renderProducts()
    })
  }
}

// Initialize sort event handlers
const initializeSortEvents = () => {
  const sortSelect = document.getElementById('sort-select')
  if (sortSelect) {
    sortSelect.addEventListener('change', () => {
      catalogState.updateSort(sortSelect.value)
      renderProducts()
    })
  }
}

// Initialize view toggle handlers
const initializeViewToggle = () => {
  const gridView = document.querySelector('.grid-view')
  const listView = document.querySelector('.list-view')

  if (gridView) {
    gridView.addEventListener('click', (e) => {
      e.preventDefault()
      catalogState.updateView('grid')
      document
        .querySelector('.shop-item-filter-list .active')
        ?.classList.remove('active')
      gridView.parentElement.classList.add('active')
      renderProducts()
    })
  }

  if (listView) {
    listView.addEventListener('click', (e) => {
      e.preventDefault()
      catalogState.updateView('list')
      document
        .querySelector('.shop-item-filter-list .active')
        ?.classList.remove('active')
      listView.parentElement.classList.add('active')
      renderProducts()
    })
  }
}

// Global functions for HTML onclick events
const setupGlobalFunctions = () => {
  window.productCatalog = {
    refresh: (containerId) => loadAndRenderProducts(containerId),
    showSamples: (containerId) => {
      // Show sample products from config
      catalogState.allProducts = getSampleProducts()
      renderProducts(containerId)
    },
    clearFilters: () => {
      catalogState.reset()
      renderProducts()
      updateFilterSidebar()
    },
    goToPage: (page) => {
      catalogState.currentPage = page
      renderProducts()
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },
    search: (query) => {
      catalogState.updateFilters({ search: query })
      renderProducts()
    },
  }

  // Aliases for backward compatibility
  window.clearAllFilters = window.productCatalog.clearFilters
  window.goToPage = window.productCatalog.goToPage
}

// Sample products for testing
const getSampleProducts = () => [
  {
    id: 1,
    brand: 'Rolex',
    model: 'Submariner',
    name: 'Rolex Submariner',
    price: 8500,
    imageUrl: './img/products/1-450x450.jpg',
    category: 'watch',
    inStock: true,
    url: 'product-details.html?id=1',
    formattedPrice: '$8,500',
    sku: 'rolex-submariner',
  },
  {
    id: 2,
    brand: 'Omega',
    model: 'Speedmaster',
    name: 'Omega Speedmaster',
    price: 3200,
    imageUrl: './img/products/2-450x450.jpg',
    category: 'watch',
    inStock: true,
    url: 'product-details.html?id=2',
    formattedPrice: '$3,200',
    sku: 'omega-speedmaster',
  },
  {
    id: 3,
    brand: 'Cartier',
    model: 'Tank',
    name: 'Cartier Tank',
    price: 4500,
    imageUrl: './img/products/3-450x450.jpg',
    category: 'watch',
    inStock: false,
    url: 'product-details.html?id=3',
    formattedPrice: '$4,500',
    sku: 'cartier-tank',
  },
]

// Initialize catalog
const initializeCatalog = (containerId = API_CONFIG.UI.DEFAULT_CONTAINER) => {
  setupGlobalFunctions()
  initializeFilterEvents()
  initializeSortEvents()
  initializeViewToggle()

  // Auto-load products if container exists
  const container = getContainer(containerId)
  if (container) {
    loadAndRenderProducts(containerId)
  }
}

// Export functions
export {
  loadAndRenderProducts as renderProductsWithLoader,
  renderProducts,
  showLoading,
  showError,
  initializeCatalog,
  catalogState,
  getSampleProducts as testProductRendering,
}
