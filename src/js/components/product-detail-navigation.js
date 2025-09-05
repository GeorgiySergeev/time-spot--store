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
      if (event.target.tagName === 'A' && event.target.href && event.target.href.includes('product-details.html')) {
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
  const isProductDetailsPath = window.location.pathname.includes('product-details')
  const hasProductDetailsContainer = document.querySelector('.product-details-inner') !== null
  
  // Primarily rely on URL path, only use container as fallback for SPA scenarios
  const result = isProductDetailsPath
  
  console.log('🔍 Page detection:', {
    path: window.location.pathname,
    isProductDetailsPath,
    hasProductDetailsContainer,
    result: result
  })
  
  return result
}

// Navigate to product detail page and store product ID for later use
const navigateToProductDetail = (productId) => {
  console.log('🗺 Starting navigation to product details page...')
  console.log('💾 Storing product ID in sessionStorage:', productId)
  
  // Store the product ID in sessionStorage for the details page to pick up
  sessionStorage.setItem('selectedProductId', productId)
  
  console.log('💾 Verification - stored value:', sessionStorage.getItem('selectedProductId'))

  // Navigate to product details page
  const detailUrl = 'product-details.html'
  console.log('🚀 Navigating to:', detailUrl)
  window.location.href = detailUrl
}

// Get stored product ID (for use by product details page)
export const getStoredProductId = () => {
  const productId = sessionStorage.getItem('selectedProductId')
  if (productId) {
    // Clear it after use to avoid stale data
    sessionStorage.removeItem('selectedProductId')
  }
  return productId
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  initProductDetailNavigation()
})

// Handle browser back/forward buttons
window.addEventListener('popstate', (event) => {
  if (isProductDetailsPage() && event.state && event.state.productId) {
    renderProductDetails(event.state.productId)
  }
})
