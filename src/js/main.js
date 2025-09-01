import './_components.js'
import { initializeCatalog } from './api/renderer.js'

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
