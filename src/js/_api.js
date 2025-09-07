import './api/renderer-watch-catalog.js'
import './api/render-jewerly-catalog.js'
import { initializeCatalog } from './api/renderer-watch-catalog.js'

// import './pages/product-details.js'

// import { initializeCatalog } from './api/renderer.js'
import {
  initAOS,
  initAOSResponsive,
  configureAOSForElements,
} from './functions/aos.js'
import { initLightbox } from './functions/lightbox.js'
import './functions/helpers.js'

// Import dynamic product details renderer
import {
  initializeProductCardHandlers,
  initProductDetailsPage,
} from './api/product-details-dynamic-renderer.js'

// Import test functionality in development
if (
  window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1'
) {
  console.log('🔧 Development mode - Debug enabled')
}

// Auto-initialize catalog on pages that include the products container
document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 Time-Sphere Catalog - Initializing...')

  // Initialize AOS animations with responsive settings
  initAOSResponsive()

  // Configure specific elements for better viewport detection
  configureAOSForElements('.single-banner', {
    offset: 30, // Earlier trigger for banners
    duration: 800,
  })

  configureAOSForElements('.section-pt', {
    offset: 40, // Custom offset for sections
    duration: 1000,
  })

  // Initialize lightbox (will work if GLightbox CDN is loaded)
  initLightbox()

  // Initialize product card click handlers for navigation to details page
  initializeProductCardHandlers()

  // Check if we're on product details page
  if (window.location.pathname.includes('product-details')) {
    console.log(
      '📄 Product details page detected - Initializing dynamic renderer',
    )
    initProductDetailsPage()
  } else {
    // Initialize catalog for other pages
    console.log('🛍️ Catalog page detected - Initializing catalog')
    const productsContainer = document.getElementById('products')
    if (productsContainer) {
      console.log('📦 Products container found - Loading catalog')
      console.log('📍 Current page:', window.location.pathname)
      console.log('🔍 Container element:', productsContainer)
      console.log('🚀 Calling initializeCatalog...')
      initializeCatalog('products')
    } else {
      console.log('ℹ️ No products container found on this page')
      console.log('📍 Current page:', window.location.pathname)
      console.log(
        '🔍 Available elements with "product" in id:',
        Array.from(document.querySelectorAll('[id*="product"]')).map(
          (el) => el.id,
        ),
      )
    }
  }

  // Initialize search functionality if search input exists
  const searchInput = document.getElementById('product-search')
  if (searchInput) {
    let searchTimeout
    searchInput.addEventListener('input', (e) => {
      clearTimeout(searchTimeout)
      searchTimeout = setTimeout(() => {
        if (window.productCatalog) {
          window.productCatalog.search(e.target.value)
        }
      }, 300) // Debounce search for 300ms
    })
  }
})
