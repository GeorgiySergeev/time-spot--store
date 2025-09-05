// Product Detail Navigation Component
// Handles clicks on product cards to render details dynamically using data attributes

// Initialize product detail navigation
export const initProductDetailNavigation = () => {
  console.log('🚀 Setting up product detail navigation event listeners...')

  // Handle product detail link clicks
  document.addEventListener('click', (event) => {
    console.log('🖱️ Click detected on:', event.target)
    const detailLink = event.target.closest('.product-detail-link')
    console.log('🔍 Looking for product-detail-link, found:', detailLink)

    if (detailLink) {
      console.log('👆 Product card clicked:', detailLink)
      const productId = detailLink.getAttribute('data-product-id')
      console.log('🏷️ Product ID extracted:', productId)
      console.log('📍 Current page path:', window.location.pathname)

      if (productId) {
        // Prevent default link behavior
        event.preventDefault()
        console.log('⚠️ Default link behavior prevented')
        console.log('📍 Checking if on product details page...')

        // Check if we're on product details page
        const onProductDetailsPage = isProductDetailsPage()
        console.log('📍 Are we on product details page?', onProductDetailsPage)

        if (onProductDetailsPage) {
          // Render product details directly without navigation
          console.log('🔄 Loading product details for ID:', productId)

          // Use dynamic import to avoid circular dependency
          import('../api/product-details-renderer.js')
            .then((module) => {
              console.log('✅ Product details renderer loaded')
              module.renderProductDetails(productId)
            })
            .catch((error) => {
              console.error(
                '❌ Failed to load product details renderer:',
                error,
              )
            })
        } else {
          // Navigate to product details page with the product ID
          console.log('📦 Navigating to product details page...')
          console.log('🗺 Using sessionStorage and navigation approach')
          navigateToProductDetail(productId)
        }
      } else {
        console.warn('⚠️ No product ID found in data attribute')
        console.log('🔗 Allowing normal link navigation as fallback')
        // Don't prevent default - allow normal navigation
      }
    } else {
      // Check if it's a product-details.html link (backup approach)
      if (
        event.target.tagName === 'A' &&
        event.target.href &&
        event.target.href.includes('product-details.html')
      ) {
        console.log('🔗 Product details link clicked (backup handler)')
        // For now, allow normal navigation to work
        // This ensures navigation works even if data attributes fail
      }
    }
  })

  console.log('✅ Product detail navigation initialized - with data attributes')
}

// Check if we're currently on the product details page
const isProductDetailsPage = () => {
  const isProductDetailsPath =
    window.location.pathname.includes('product-details')
  const hasProductDetailsContainer =
    document.querySelector('.product-details-inner') !== null

  // Primarily rely on URL path, only use container as fallback for SPA scenarios
  const result = isProductDetailsPath

  console.log('🔍 Page detection:', {
    path: window.location.pathname,
    isProductDetailsPath,
    hasProductDetailsContainer,
    result: result,
  })

  return result
}

// Navigate to product detail page with URL parameters (survives page reload)
const navigateToProductDetail = (productId) => {
  console.log('🗺 Starting navigation to product details page...')
  console.log('💾 Using URL parameter for product ID:', productId)

  // Store the product ID in sessionStorage as backup
  sessionStorage.setItem('selectedProductId', productId)

  // Navigate to product details page with product ID in URL
  const detailUrl = `product-details.html?id=${encodeURIComponent(productId)}`
  console.log('🚀 Navigating to:', detailUrl)

  // Update browser history to include product ID
  window.location.href = detailUrl
}

// Get stored product ID (for use by product details page)
export const getStoredProductId = () => {
  const productId = sessionStorage.getItem('selectedProductId')
  // Only clear sessionStorage if we successfully got a product ID from URL
  // This allows fallback to work if URL params are missing
  return productId
}

// Clear stored product ID (call this explicitly when no longer needed)
export const clearStoredProductId = () => {
  sessionStorage.removeItem('selectedProductId')
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  initProductDetailNavigation()
})

// Handle browser back/forward buttons
window.addEventListener('popstate', (event) => {
  console.log('🔙 Browser navigation detected')
  if (isProductDetailsPage()) {
    // Check for product ID in URL or history state
    const productId =
      getProductIdFromUrl() || (event.state && event.state.productId)
    if (productId) {
      console.log('🔄 Reloading product details for ID:', productId)
      // Use dynamic import to load renderer
      import('../api/product-details-renderer.js')
        .then((module) => {
          module.renderProductDetails(productId)
        })
        .catch((error) => {
          console.error('❌ Failed to load product details renderer:', error)
        })
    }
  }
})

// Helper function to get product ID from URL
const getProductIdFromUrl = () => {
  const urlParams = new URLSearchParams(window.location.search)
  return urlParams.get('id') || urlParams.get('productId')
}
