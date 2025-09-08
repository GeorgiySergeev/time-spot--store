/**
 * Products Domain - Main Export
 * Unified entry point for all product-related functionality
 */

// Import shared product functionality
import ProductService from './shared/product.service.js'

// Import watch-specific functionality
import WatchService from './watch/watch.service.js'

// Import jewelry-specific functionality
import JewelryService from './jewelry/jewelry.service.js'

// Re-export everything
export * from './shared/product.service.js'
export * from './watch/watch.service.js'
export * from './jewelry/jewelry.service.js'

// Named exports
export { ProductService, WatchService, JewelryService }

// ============================================================================
// UNIFIED PRODUCTS API
// ============================================================================

/**
 * Create the unified products domain API
 */
export const createProductsDomain = (config = {}) => {
  return {
    // Service factories
    createProductService: ProductService.createProductService,
    createWatchService: WatchService.createWatchService,
    createJewelryService: JewelryService.createJewelryService,

    // Shared utilities
    normalizeProduct: ProductService.normalizeProduct,
    filterProducts: ProductService.filterProducts,
    sortProducts: ProductService.sortProducts,
    createPagination: ProductService.createPagination,

    // Watch utilities
    normalizeWatch: WatchService.normalizeWatch,
    filterWatches: WatchService.filterWatches,

    // Jewelry utilities
    normalizeJewelry: JewelryService.normalizeJewelry,
    filterJewelry: JewelryService.filterJewelry,

    // Constants
    WATCH_BRANDS: WatchService.WATCH_BRANDS,
    JEWELRY_BRANDS: JewelryService.JEWELRY_BRANDS,
    MOVEMENT_TYPES: WatchService.MOVEMENT_TYPES,
    MATERIAL_TYPES: JewelryService.MATERIAL_TYPES,

    // Version info
    version: '1.0.0',
    name: 'Time-Sphere Products Domain',
  }
}

// ============================================================================
// DEFAULT EXPORT
// ============================================================================

export default createProductsDomain()
