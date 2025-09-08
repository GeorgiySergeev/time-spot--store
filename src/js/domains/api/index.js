/**
 * API Domain - Main Export
 * Unified entry point for all API-related functionality
 */

// Import core API functionality
import ApiFactory from './core/api.factory.js'

// Import Cockpit CMS adapter
import CockpitAdapter from './cockpit/cockpit.adapter.js'

// Re-export everything
export * from './core/api.factory.js'
export * from './cockpit/cockpit.adapter.js'

// Named exports
export { ApiFactory, CockpitAdapter }

// ============================================================================
// UNIFIED API DOMAIN
// ============================================================================

/**
 * Create the unified API domain
 */
export const createApiDomain = (config = {}) => {
  return {
    // Factory functions
    createApiFactory: ApiFactory.createApiFactory,
    createBaseApi: ApiFactory.createBaseApi,
    createCrudApi: ApiFactory.createCrudApi,
    createProductApi: ApiFactory.createProductApi,
    createWatchApi: ApiFactory.createWatchApi,
    createJewelryApi: ApiFactory.createJewelryApi,

    // Cockpit adapter
    createCockpitAdapter: CockpitAdapter.createCockpitAdapter,

    // Composition utilities
    composeApiMethods: ApiFactory.composeApiMethods,
    withApiCache: ApiFactory.withApiCache,
    withApiRetry: ApiFactory.withApiRetry,

    // Cockpit utilities
    transformCockpitRequest: CockpitAdapter.transformCockpitRequest,
    transformCockpitResponse: CockpitAdapter.transformCockpitResponse,
    buildCockpitQuery: CockpitAdapter.buildCockpitQuery,
    normalizeCockpitProduct: CockpitAdapter.normalizeCockpitProduct,

    // Configuration
    defaultCockpitConfig: CockpitAdapter.defaultCockpitConfig,
    cockpitEndpoints: CockpitAdapter.cockpitEndpoints,

    // Version info
    version: '1.0.0',
    name: 'Time-Sphere API Domain',
  }
}

// ============================================================================
// DEFAULT EXPORT
// ============================================================================

export default createApiDomain()
