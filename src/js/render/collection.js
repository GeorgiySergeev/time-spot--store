// Collection/Gallery Renderer for Watches
// Functional approach with ES6 standard

import { getProducts } from '../api/api.js'
import {
  createProductCard,
  createProductListItem,
  createLoadingState,
  createErrorState,
  createEmptyState,
} from '../api/templates.js'

// DOM Elements
const containerElement = document.getElementById('products')
const totalEl = document.getElementById('total_products')

// Helper Functions
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

// Render Strategies
const renderGrid = (products) =>
  products
    .map(
      (product) => `
      <div class="col-lg-3 col-md-6">
        ${createProductCard(product)}
      </div>
    `,
    )
    .join('')

const renderList = (products) => products.map(createProductListItem).join('')

const renderStrategies = {
  grid: renderGrid,
  list: renderList,
}

// Main Rendering Functions
export const renderProducts = (
  products,
  containerId = 'products',
  viewType = 'grid',
) => {
  const container = getContainer(containerId)
  if (!container) return

  try {
    if (!products.length) {
      setContent(container, createEmptyState())
      return
    }

    const renderStrategy = renderStrategies[viewType] || renderStrategies.grid
    const content = renderStrategy(products)

    if (totalEl) {
      totalEl.textContent = products.length
    }

    setContent(container, content)
    console.log(`Rendered ${products.length} products (${viewType} view)`)
  } catch (error) {
    console.error('Rendering error:', error)
    showError(container, error.message, containerId, viewType)
  }
}

export const showLoading = (containerId = 'products') => {
  const container = getContainer(containerId)
  setContent(container, createLoadingState())
}

export const showError = (containerOrId, message, containerId, viewType) => {
  const container =
    typeof containerOrId === 'string'
      ? getContainer(containerOrId)
      : containerOrId

  const onRetry = `loadProducts('${containerId}', '${viewType}')`
  setContent(
    container,
    createErrorState(
      message,
      onRetry,
      `showSampleProducts('${containerId}', '${viewType}')`,
    ),
  )
}

export const clearProducts = (containerId = 'products') => {
  const container = getContainer(containerId)
  setContent(container, '')
}

// Async Rendering
export const renderProductsAsync = async (
  productsPromise,
  containerId = 'products',
  viewType = 'grid',
) => {
  showLoading(containerId)

  try {
    const result = await productsPromise
    const products = Array.isArray(result) ? result : result.products || []
    renderProducts(products, containerId, viewType)
  } catch (error) {
    console.error('Failed to load products:', error)
    const container = getContainer(containerId)
    showError(container, error.message, containerId, viewType)
  }
}

// Load products from API
export const loadProducts = async (
  containerId = 'products',
  viewType = 'grid',
  filters = {},
) => {
  try {
    showLoading(containerId)
    const result = await getProducts(filters)
    const products = result.products || []
    renderProducts(products, containerId, viewType)
    return products
  } catch (error) {
    console.error('Failed to load products:', error)
    const container = getContainer(containerId)
    showError(container, error.message, containerId, viewType)
  }
}

// Show sample products (fallback)
export const showSampleProducts = (
  containerId = 'products',
  viewType = 'grid',
) => {
  // Sample product data for fallback
  const sampleProducts = [
    {
      id: 'sample-1',
      brand: 'Rolex',
      model: 'Submariner',
      price: 12000,
      imageUrl:
        'https://websphere.miy.link/admin/storage/uploads/66f0a7c76a199submariner.jpg',
      category: 'watch',
      inStock: true,
      formattedPrice: '$12,000',
      description: 'Iconic dive watch with exceptional performance',
    },
    {
      id: 'sample-2',
      brand: 'Omega',
      model: 'Speedmaster',
      price: 8000,
      imageUrl:
        'https://websphere.miy.link/admin/storage/uploads/66f0a7c76a199speedmaster.jpg',
      category: 'watch',
      inStock: true,
      formattedPrice: '$8,000',
      description: 'The first watch worn on the moon',
    },
    {
      id: 'sample-3',
      brand: 'Patek Philippe',
      model: 'Calatrava',
      price: 25000,
      imageUrl:
        'https://websphere.miy.link/admin/storage/uploads/66f0a7c76a199calatrava.jpg',
      category: 'watch',
      inStock: false,
      formattedPrice: '$25,000',
      description: 'Elegant dress watch with timeless design',
    },
    {
      id: 'sample-4',
      brand: 'Seiko',
      model: 'Prospex',
      price: 300,
      imageUrl:
        'https://websphere.miy.link/admin/storage/uploads/66f0a7c76a199prospex.jpg',
      category: 'watch',
      inStock: true,
      formattedPrice: '$300',
      description: 'Affordable diver with excellent build quality',
    },
  ]

  renderProducts(sampleProducts, containerId, viewType)
}

// Initialize the collection renderer
export const initCollectionRenderer = () => {
  if (containerElement) {
    console.log('Collection renderer initialized')
    // Load products on initialization
    loadProducts()
  } else {
    console.warn('Products container not found')
  }
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCollectionRenderer)
} else {
  initCollectionRenderer()
}
