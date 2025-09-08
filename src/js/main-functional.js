/**
 * Time-Sphere Functional Architecture - Main Entry Point
 * Modern ES6+ functional implementation replacing legacy code
 */

// Core functional infrastructure
import Core from './core/index.js'
import Infrastructure from './infrastructure/index.js'

// Domain services
import ProductsDomain from './domains/products/index.js'
import ApiDomain from './domains/api/index.js'

// UI Components
import { createCatalogComponent } from './domains/ui/catalog/catalog.component.js'

// Legacy compatibility
import { initializeAllSwipers } from './infrastructure/wrappers/swiper.wrapper.js'
import { initializeAllLightboxes } from './infrastructure/wrappers/glightbox.wrapper.js'
import { initializeBootstrapComponents } from './infrastructure/wrappers/bootstrap.wrapper.js'

// ============================================================================
// APPLICATION FACTORY
// ============================================================================

/**
 * Create the main application instance
 */
const createTimeSphereApp = (config = {}) => {
  const {
    debug = false,
    enableLegacyCompatibility = true,
    autoInitialize = true,
  } = config

  // Application state
  const appState = {
    initialized: false,
    components: new Map(),
    services: new Map(),
    config,
  }

  return {
    // Core systems
    core: Core,
    infrastructure: Infrastructure,

    // Domain services
    products: ProductsDomain,
    api: ApiDomain,

    // Application methods
    initialize: async () => {
      if (appState.initialized) {
        console.warn('Application already initialized')
        return
      }

      console.log('🚀 Initializing Time-Sphere Functional Architecture...')

      try {
        // Initialize infrastructure
        if (debug) console.log('📦 Initializing infrastructure...')
        const swiperManager = initializeAllSwipers()
        const lightboxManager = initializeAllLightboxes()
        const bootstrapManager = initializeBootstrapComponents()

        // Store managers
        appState.services.set('swiper', swiperManager)
        appState.services.set('lightbox', lightboxManager)
        appState.services.set('bootstrap', bootstrapManager)

        // Initialize catalog components based on current page
        if (debug) console.log('🛍️ Initializing catalog components...')
        await initializeCatalogComponents()

        // Setup legacy compatibility if enabled
        if (enableLegacyCompatibility) {
          if (debug) console.log('🔄 Setting up legacy compatibility...')
          setupLegacyCompatibility()
        }

        appState.initialized = true
        console.log('✅ Time-Sphere application initialized successfully')

        return true
      } catch (error) {
        console.error('❌ Failed to initialize application:', error)
        throw error
      }
    },

    // Component management
    createCatalog: (containerId, options = {}) => {
      const catalogComponent = createCatalogComponent({
        containerId,
        ...options,
      })

      appState.components.set(containerId, catalogComponent)
      return catalogComponent
    },

    // Service access
    getService: (name) => appState.services.get(name),

    // Component access
    getComponent: (name) => appState.components.get(name),

    // State access
    getState: () => ({ ...appState }),

    // Cleanup
    destroy: () => {
      console.log('🧹 Cleaning up application...')

      // Destroy components
      appState.components.forEach((component, name) => {
        if (component.destroy) {
          component.destroy()
        }
      })
      appState.components.clear()

      // Destroy services
      appState.services.forEach((service, name) => {
        if (service.destroyAll) {
          service.destroyAll()
        }
      })
      appState.services.clear()

      appState.initialized = false
      console.log('✅ Application cleanup complete')
    },
  }
}

// ============================================================================
// CATALOG INITIALIZATION
// ============================================================================

/**
 * Initialize catalog components based on current page
 */
const initializeCatalogComponents = async () => {
  const currentPath = window.location.pathname

  // Check for products container
  const productsContainer = document.getElementById('products')
  if (productsContainer) {
    console.log('📦 Products container found, initializing catalog...')

    // Determine category based on URL or container attributes
    let category = 'watch' // default
    if (currentPath.includes('jewelry')) {
      category = 'jewelry'
    } else if (productsContainer.dataset.category) {
      category = productsContainer.dataset.category
    }

    // Create and mount catalog component
    const catalogComponent = createCatalogComponent({
      category,
      containerId: 'products',
      productsPerPage: currentPath.includes('shop') ? 24 : 12,
    })

    // Mount the component
    const instance = catalogComponent()
    instance.mount(productsContainer)

    console.log(`✅ Catalog component initialized for category: ${category}`)
    return instance
  }

  console.log('ℹ️ No products container found on this page')
  return null
}

// ============================================================================
// LEGACY COMPATIBILITY
// ============================================================================

/**
 * Setup backward compatibility with legacy code
 */
const setupLegacyCompatibility = () => {
  // Create global productCatalog object for backward compatibility
  window.productCatalog = {
    refresh: (containerId) => {
      const component = timeSphereApp.getComponent(containerId)
      if (component) {
        // Trigger reload through component context
        console.log(`🔄 Refreshing catalog: ${containerId}`)
      }
    },

    showSamples: (containerId) => {
      const component = timeSphereApp.getComponent(containerId)
      if (component) {
        // Show sample data through component context
        console.log(`📋 Showing samples: ${containerId}`)
      }
    },

    clearFilters: () => {
      // Clear filters on all catalog components
      timeSphereApp.getState().components.forEach((component, name) => {
        if (component.clearFilters) {
          component.clearFilters()
        }
      })
    },

    goToPage: (page) => {
      // Navigate to page on active catalog
      const activeComponent = Array.from(
        timeSphereApp.getState().components.values(),
      )[0]
      if (activeComponent && activeComponent.goToPage) {
        activeComponent.goToPage(page)
      }
    },

    search: (query) => {
      // Search on active catalog
      const activeComponent = Array.from(
        timeSphereApp.getState().components.values(),
      )[0]
      if (activeComponent && activeComponent.search) {
        activeComponent.search(query)
      }
    },
  }

  // Legacy function aliases
  window.clearAllFilters = window.productCatalog.clearFilters
  window.goToPage = window.productCatalog.goToPage

  // Make managers globally available (for debugging)
  if (
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1'
  ) {
    window.swiperManager = timeSphereApp.getService('swiper')
    window.lightboxManager = timeSphereApp.getService('lightbox')
    window.bootstrapManager = timeSphereApp.getService('bootstrap')
  }

  console.log('🔄 Legacy compatibility layer activated')
}

// ============================================================================
// AUTO-INITIALIZATION
// ============================================================================

/**
 * Auto-initialize when DOM is ready
 */
const autoInitialize = () => {
  // Create global app instance
  window.timeSphereApp = createTimeSphereApp({
    debug:
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1',
    enableLegacyCompatibility: true,
    autoInitialize: true,
  })

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      window.timeSphereApp.initialize()
    })
  } else {
    window.timeSphereApp.initialize()
  }
}

// ============================================================================
// SEARCH FUNCTIONALITY
// ============================================================================

/**
 * Initialize search functionality
 */
const initializeSearch = () => {
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

    console.log('🔍 Search functionality initialized')
  }
}

// ============================================================================
// INITIALIZATION
// ============================================================================

// Auto-initialize the application
autoInitialize()

// Initialize search after DOM is ready
document.addEventListener('DOMContentLoaded', initializeSearch)

// ============================================================================
// EXPORTS
// ============================================================================

export {
  createTimeSphereApp,
  initializeCatalogComponents,
  setupLegacyCompatibility,
}

export default createTimeSphereApp
