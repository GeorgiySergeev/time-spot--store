// Product details page rendering functionality - Functional approach

import { getProductById } from './api.js'
import {
  createProductInfo,
  createProductDetails,
  createProductGallery,
  createThumbnail,
  createProductLoadingState,
  createProductErrorState,
  createFallbackNotice,
} from './templates.js'

const BASE_IMAGE_URL = 'https://websphere.miy.link/admin/storage/uploads'

// Pure function to normalize product data
const normalizeProductData = (data) => {
  if (!data) return null

  // Handle different API response structures
  const product = Array.isArray(data)
    ? data[0]
    : data.data || data.product || data.item || data

  // Validate product has essential properties
  if (!product || typeof product !== 'object') return null
  if (
    !(
      product.id ||
      product._id ||
      product.model ||
      product.name ||
      product.title
    )
  )
    return null

  return product
}

// Pure function to create fallback product data
const createFallbackProduct = (productId) => ({
  id: productId,
  brand: 'Time Sphere',
  model: 'Classic Watch',
  name: 'Time Sphere Classic Watch',
  price: 299,
  description:
    'Этот товар временно недоступен через API. Показываются образцы данных.',
  img: { path: '/img/products/1-450x450.jpg' },
  category: 'watch',
  inStock: true,
  sku: 'TS-CLASSIC-001',
  rating: 5,
})

// Higher-order function for error handling
const withErrorHandling =
  (fn) =>
  async (...args) => {
    try {
      return await fn(...args)
    } catch (error) {
      console.error('Error in function:', fn.name, error)
      throw error
    }
  }

// Pure functions for DOM updates
const updateElement = (selector, content) => {
  const element = document.querySelector(selector)
  if (element) {
    if (typeof content === 'string') {
      element.innerHTML = content
    } else {
      element.textContent = content
    }
  }
  return element
}

const updateAttribute = (selector, attribute, value) => {
  const element = document.querySelector(selector)
  if (element) {
    element.setAttribute(attribute, value)
  }
  return element
}

const updateStyle = (selector, styles) => {
  const element = document.querySelector(selector)
  if (element) {
    Object.assign(element.style, styles)
  }
  return element
}

// Functional composition for DOM updates
const compose =
  (...fns) =>
  (value) =>
    fns.reduceRight((acc, fn) => fn(acc), value)

// Pure function to create DOM update instructions
const createUpdateInstructions = (product) => [
  () => updateElement('.product-info', createProductInfo(product)),
  () =>
    updateElement(
      '.product-info h3',
      product.model || product.name || product.title || 'Product Name',
    ),
  () =>
    updateElement(
      '.price-box .new-price',
      formatPrice(product.price || product.currentPrice),
    ),
  () => updateOldPrice(product),
  () =>
    updateElement(
      '.product-info p',
      product.description || product.shortDescription || 'Product description',
    ),
  () => updateProductRating(product.rating || product.stars || 5),
  () => updateProductImages(product),
  () => updateProductActions(product),
  () =>
    updateBreadcrumb(
      product.model || product.name || product.title || 'Product Details',
    ),
]

// Helper functions
const updateOldPrice = (product) => {
  const oldPrice = product.oldPrice || product.originalPrice
  if (oldPrice) {
    updateElement('.price-box .old-price', formatPrice(oldPrice))
    updateStyle('.price-box .old-price', { display: 'inline' })
  } else {
    updateStyle('.price-box .old-price', { display: 'none' })
  }
}

const updateProductRating = (rating) => {
  const stars = document.querySelectorAll('.product-rating ul li')
  stars.forEach((star, index) => {
    const icon = star.querySelector('i')
    if (icon) {
      icon.className = 'icon-star'
      star.classList.toggle('bad-reting', index >= rating)
    }
  })
}

const updateProductImages = (product) => {
  const gallery = createProductGallery(product, BASE_IMAGE_URL)

  // Update main image
  updateAttribute('#main-product-image', 'src', gallery.mainImage)
  updateAttribute(
    '#main-product-image',
    'alt',
    product.model || 'Product Image',
  )

  // Update thumbnail gallery
  const thumbnailContainer = document.querySelector('.product-nav')
  if (thumbnailContainer) {
    thumbnailContainer.innerHTML = gallery.thumbnails
      .map((image, index) => createThumbnail(image, index))
      .join('')

    // Add click handlers for thumbnails
    thumbnailContainer.addEventListener('click', handleThumbnailClick)
  }
}

const handleThumbnailClick = (event) => {
  const thumbnail = event.target.closest('.pro-nav-thumb')
  if (!thumbnail) return

  const img = thumbnail.querySelector('img')
  if (!img) return

  // Update main image
  updateAttribute('#main-product-image', 'src', img.src)
  updateAttribute('#main-product-image', 'alt', img.alt)

  // Update active thumbnail
  document
    .querySelectorAll('.pro-nav-thumb')
    .forEach((thumb) => thumb.classList.remove('active'))
  thumbnail.classList.add('active')
}

const updateProductActions = (product) => {
  updateAttribute(
    '.cart-quantity',
    'data-product-id',
    product.id || product._id,
  )
  updateAttribute(
    '.add_to_wishlist',
    'href',
    `wishlist.html?add=${product.id || product._id}`,
  )
  updateAttribute(
    '.compare-button a',
    'href',
    `compare.html?add=${product.id || product._id}`,
  )
}

const updateBreadcrumb = (productName) => {
  updateElement('.breadcrumb-item.active', productName)
}

const formatPrice = (price) => {
  if (typeof price === 'number') return `$${price.toFixed(2)}`
  if (typeof price === 'string') {
    const numPrice = parseFloat(price)
    if (!isNaN(numPrice)) return `$${numPrice.toFixed(2)}`
    return price
  }
  return '$0.00'
}

// State management functions
const showLoadingState = () => {
  const container = document.querySelector('.product-details-inner')
  if (!container) return

  const existingLoader = container.querySelector('.product-loading')
  if (existingLoader) return

  container.style.position = 'relative'
  container.insertAdjacentHTML('beforeend', createProductLoadingState())
}

const removeLoadingState = () => {
  document
    .querySelectorAll('.product-loading, .loading-overlay')
    .forEach((el) => el.remove())
}

const showErrorState = (errorMessage) => {
  removeLoadingState()
  const container = document.querySelector('.product-details-inner')
  if (container) {
    container.innerHTML = createProductErrorState(errorMessage)
  }
}

const showFallbackData = (productId) => {
  const fallbackProduct = createFallbackProduct(productId)

  // Show fallback notice
  const container = document.querySelector('.product-details-inner')
  if (container) {
    container.insertAdjacentHTML('afterbegin', createFallbackNotice())
  }

  // Apply updates using functional approach
  const updates = createUpdateInstructions(fallbackProduct)
  updates.forEach((update) => update())
}

// Main render function - now much simpler
export const renderProductDetails = withErrorHandling(async (productId) => {
  console.log('🔍 Fetching product details for ID:', productId)

  showLoadingState()

  try {
    const productData = await getProductById(productId)
    const normalizedData = normalizeProductData(productData)

    if (!normalizedData) {
      throw new Error('Product not found or invalid data structure')
    }

    removeLoadingState()

    // Apply all updates functionally
    const updates = createUpdateInstructions(normalizedData)
    updates.forEach((update) => update())

    console.log('✅ Successfully rendered product details for ID:', productId)
  } catch (error) {
    console.error('❌ Error rendering product details:', error)
    removeLoadingState()

    // Handle different error types
    if (
      error.message.includes('Network Error') ||
      error.response?.status >= 500
    ) {
      console.log('🔄 API failed, showing fallback data')
      showFallbackData(productId)
    } else {
      showErrorState(error.message)
    }
  }
})

// Utility function to get product ID from URL with multiple parameter support
const getProductIdFromUrl = () => {
  const urlParams = new URLSearchParams(window.location.search)
  return urlParams.get('id') || urlParams.get('productId')
}

// Initialize product details page - now simplified
export const initProductDetailsPage = () => {
  removeLoadingState()

  const productId = getProductIdFromUrl()

  if (!productId) {
    showErrorState('Не указан ID товара в URL')
    return
  }

  console.log('Initializing product details page for ID:', productId)
  renderProductDetails(productId)
}
