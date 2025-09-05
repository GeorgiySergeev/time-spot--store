import './_components.js'
import './_functions.js'
import './_api.js'

// Import page-specific modules
import './pages/product-details.js'

// ==============================

import { initializeCatalog } from './api/renderer.js'
import { initAOS } from './functions/aos.js'
import { initLightbox } from './functions/lightbox.js'
import './functions/helpers.js'

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

  // Initialize AOS animations
  initAOS()

  // Initialize lightbox (will work if GLightbox CDN is loaded)
  initLightbox()

  const productsContainer = document.getElementById('products')
  if (productsContainer) {
    console.log('📦 Products container found - Loading catalog')
    initializeCatalog('products')
  } else {
    console.log('ℹ️ No products container found on this page')
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
