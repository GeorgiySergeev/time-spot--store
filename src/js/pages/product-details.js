// Product Details Page JavaScript
// Handles dynamic product rendering on the product-details page using data attributes

import { renderProductDetails } from '../api/product-details-renderer.js'
import {
  getStoredProductId,
  clearStoredProductId,
} from '../components/product-detail-navigation.js'

// Initialize product details page
const initProductDetailsPage = () => {
  console.log('🔍 Product Details Page - Initializing...')
  console.log('Current URL:', window.location.href)

  // Try multiple sources for product ID (URL has priority for page reloads)
  let productId = getProductIdFromUrl() || getStoredProductId()

  console.log('Product ID from URL:', getProductIdFromUrl())
  console.log('Product ID from storage:', getStoredProductId())
  console.log('Final product ID:', productId)

  if (!productId) {
    console.warn('No product ID found in URL or storage')
    showNoProductError()
    return
  }

  console.log(`Loading product details for ID: ${productId}`)

  // Update URL if product ID came from storage (for bookmark support)
  if (!getProductIdFromUrl() && productId) {
    updateUrlWithProductId(productId)
  }

  // Clear sessionStorage once we have established the product ID
  if (productId) {
    clearStoredProductId()
  }

  // Set up global function for navigation component
  window.renderProductDetails = renderProductDetails

  // Render the product details
  renderProductDetails(productId)
}

// Fallback: Get product ID from URL parameters (for direct links and page reloads)
const getProductIdFromUrl = () => {
  const urlParams = new URLSearchParams(window.location.search)
  return urlParams.get('id') || urlParams.get('productId')
}

// Update URL with product ID for bookmark support and page reload persistence
const updateUrlWithProductId = (productId) => {
  const newUrl = `${window.location.pathname}?id=${encodeURIComponent(productId)}`
  window.history.replaceState({ productId }, '', newUrl)
  console.log('🔗 Updated URL for bookmark support:', newUrl)
}

// Show error when no product ID is provided
const showNoProductError = () => {
  const container = document.querySelector('.product-details-inner')
  if (container) {
    container.innerHTML = `
      <div class="col-12 text-center" style="padding: 3rem;">
        <div style="color: #ff6b6b; font-size: 1.4rem; margin-bottom: 1rem;">
          <i class="fa fa-exclamation-triangle"></i> Товар не найден
        </div>
        <div style="color: #666; font-size: 1.1rem; margin-bottom: 2rem;">
          Не указан идентификатор товара в URL.<br>
          Пожалуйста, выберите товар из каталога.
        </div>
        <a href="shop.html"
           style="background: #28a745; color: white; text-decoration: none;
                  padding: 1rem 2rem; border-radius: 4px; display: inline-block;">
          <i class="fa fa-arrow-left"></i> Перейти к каталогу
        </a>
      </div>
    `
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Only run on product-details page
  if (
    window.location.pathname.includes('product-details') ||
    document.querySelector('.product-details-inner')
  ) {
    initProductDetailsPage()
  }
})

// Export for potential use by other modules
export { initProductDetailsPage }
