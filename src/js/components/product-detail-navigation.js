// Product Detail Navigation Component
// Handles clicking on product cards and navigating to product details with ID in URL

/**
 * Initialize product detail navigation
 * Sets up click handlers for all product detail links
 */
export const initProductDetailNavigation = () => {
  console.log('🔗 Initializing product detail navigation...')

  // Use event delegation to handle dynamically created product cards
  document.addEventListener('click', handleProductDetailClick)

  console.log('✅ Product detail navigation initialized')
}

/**
 * Handle clicks on product detail links
 * @param {Event} event - Click event
 */
const handleProductDetailClick = (event) => {
  // Check if clicked element is a product detail link or inside one
  const productLink = event.target.closest('.product-detail-link')

  if (!productLink) return

  // Prevent default navigation
  event.preventDefault()

  // Get product ID from data attribute
  const productId = productLink.getAttribute('data-product-id')

  if (!productId) {
    console.warn('⚠️ Product ID not found in data-product-id attribute')
    return
  }

  console.log(`🔗 Navigating to product details for ID: ${productId}`)

  // Navigate to product details page with ID in URL
  navigateToProductDetails(productId)
}

/**
 * Navigate to product details page with product ID in URL
 * @param {string} productId - Product ID to pass in URL
 */
const navigateToProductDetails = (productId) => {
  // Create URL with product ID as query parameter
  const productDetailsUrl = `product-details.html?id=${encodeURIComponent(productId)}`

  console.log(`🔗 Navigating to: ${productDetailsUrl}`)

  // Navigate to the product details page
  window.location.href = productDetailsUrl
}

/**
 * Get product ID from current URL parameters
 * @returns {string|null} Product ID from URL or null if not found
 */
export const getProductIdFromUrl = () => {
  const urlParams = new URLSearchParams(window.location.search)
  return urlParams.get('id')
}

/**
 * Store product ID in sessionStorage for navigation between pages
 * @param {string} productId - Product ID to store
 */
export const storeProductId = (productId) => {
  if (productId) {
    sessionStorage.setItem('selectedProductId', productId)
    console.log(`💾 Stored product ID: ${productId}`)
  }
}

/**
 * Get stored product ID from sessionStorage
 * @returns {string|null} Stored product ID or null if not found
 */
export const getStoredProductId = () => {
  return sessionStorage.getItem('selectedProductId')
}

/**
 * Clear stored product ID from sessionStorage
 */
export const clearStoredProductId = () => {
  sessionStorage.removeItem('selectedProductId')
  console.log('🗑️ Cleared stored product ID')
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  initProductDetailNavigation()
})

export default {
  initProductDetailNavigation,
  getProductIdFromUrl,
  storeProductId,
  getStoredProductId,
  clearStoredProductId,
  navigateToProductDetails,
}
