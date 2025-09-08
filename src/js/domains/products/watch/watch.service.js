/**
 * Watch Service - Functional Watch-Specific Operations
 * Domain service for watch-related business logic
 */

import {
  curry,
  pipe,
  compose,
  map,
  filter,
  merge,
  prop,
  isNil,
  isNotNil,
} from '../../../core/functional.utils.js'
import { createProductService } from '../shared/product.service.js'
import { createCockpitAdapter } from '../../api/cockpit/cockpit.adapter.js'

// ============================================================================
// WATCH-SPECIFIC CONFIGURATION
// ============================================================================

/**
 * Watch service configuration
 */
export const watchServiceConfig = {
  category: 'watch',
  endpoint: '/content/items/watch',
  endpointById: '/content/item/watch',
}

// ============================================================================
// WATCH DATA TRANSFORMATIONS
// ============================================================================

/**
 * Add watch-specific computed fields
 */
export const addWatchComputedFields = (watch) => ({
  ...watch,
  isLuxury: watch.price > 10000,
  isVintage: watch.year && new Date().getFullYear() - watch.year > 20,
  hasComplications: watch.complications && watch.complications.length > 0,
  waterResistanceLevel: getWaterResistanceLevel(watch.waterResistance),
  movementType: getMovementType(watch.movement),
})

/**
 * Get water resistance level
 */
const getWaterResistanceLevel = (waterResistance) => {
  if (!waterResistance) return 'none'

  const resistance = parseInt(waterResistance)
  if (resistance >= 300) return 'diving'
  if (resistance >= 100) return 'swimming'
  if (resistance >= 50) return 'splash'
  return 'basic'
}

/**
 * Get movement type category
 */
const getMovementType = (movement) => {
  if (!movement) return 'unknown'

  const movementLower = movement.toLowerCase()
  if (
    movementLower.includes('automatic') ||
    movementLower.includes('self-winding')
  ) {
    return 'automatic'
  }
  if (
    movementLower.includes('manual') ||
    movementLower.includes('hand-wound')
  ) {
    return 'manual'
  }
  if (movementLower.includes('quartz') || movementLower.includes('battery')) {
    return 'quartz'
  }
  return 'mechanical'
}

/**
 * Normalize watch data
 */
export const normalizeWatch = (watch) => {
  if (!watch) return null

  return pipe(addWatchComputedFields, (w) => ({
    ...w,
    category: 'watch',
    // Watch-specific fields
    movement: w.movement || 'Unknown',
    caseMaterial: w.caseMaterial || w.case_material || 'Unknown',
    dialColor: w.dialColor || w.dial_color || 'Unknown',
    strapMaterial: w.strapMaterial || w.strap_material || 'Unknown',
    waterResistance: w.waterResistance || w.water_resistance || 0,
    caseSize: w.caseSize || w.case_size || 'Unknown',
    complications: w.complications || [],
    year: w.year || w.production_year,
    warranty: w.warranty || 0,
  }))(watch)
}

// ============================================================================
// WATCH-SPECIFIC FILTERING
// ============================================================================

/**
 * Create watch filter function
 */
export const createWatchFilter = (criteria) => (watch) => {
  // Movement filter
  if (criteria.movement && watch.movementType !== criteria.movement) {
    return false
  }

  // Case material filter
  if (criteria.caseMaterial && watch.caseMaterial !== criteria.caseMaterial) {
    return false
  }

  // Dial color filter
  if (criteria.dialColor && watch.dialColor !== criteria.dialColor) {
    return false
  }

  // Water resistance level filter
  if (
    criteria.waterResistanceLevel &&
    watch.waterResistanceLevel !== criteria.waterResistanceLevel
  ) {
    return false
  }

  // Luxury filter
  if (criteria.luxuryOnly && !watch.isLuxury) {
    return false
  }

  // Vintage filter
  if (criteria.vintageOnly && !watch.isVintage) {
    return false
  }

  // Complications filter
  if (
    criteria.hasComplications !== undefined &&
    watch.hasComplications !== criteria.hasComplications
  ) {
    return false
  }

  return true
}

/**
 * Filter watches by criteria
 */
export const filterWatches = curry((criteria, watches) =>
  watches.filter(createWatchFilter(criteria)),
)

// ============================================================================
// WATCH-SPECIFIC AGGREGATIONS
// ============================================================================

/**
 * Extract watch-specific filter options
 */
export const extractWatchFilterOptions = (watches) => {
  const movements = [
    ...new Set(watches.map(prop('movementType')).filter(isNotNil)),
  ]
  const caseMaterials = [
    ...new Set(watches.map(prop('caseMaterial')).filter(isNotNil)),
  ]
  const dialColors = [
    ...new Set(watches.map(prop('dialColor')).filter(isNotNil)),
  ]
  const waterResistanceLevels = [
    ...new Set(watches.map(prop('waterResistanceLevel')).filter(isNotNil)),
  ]
  const complications = [
    ...new Set(watches.flatMap(prop('complications')).filter(isNotNil)),
  ]

  return {
    movements: movements.sort(),
    caseMaterials: caseMaterials.sort(),
    dialColors: dialColors.sort(),
    waterResistanceLevels: waterResistanceLevels.sort(),
    complications: complications.sort(),
  }
}

// ============================================================================
// WATCH SERVICE FACTORY
// ============================================================================

/**
 * Create watch service
 */
export const createWatchService = (config = {}) => {
  const finalConfig = merge(watchServiceConfig, config)

  // Create base product service
  const productService = createProductService(finalConfig)

  // Create Cockpit adapter with watch-specific configuration
  const cockpitAdapter = createCockpitAdapter({
    ...finalConfig,
    normalizeProduct: normalizeWatch,
  })

  return {
    // Inherit all product service methods
    ...productService,

    // Override with watch-specific implementations
    fetchWatches: async (filters = {}) => {
      const watchFilters = { ...filters, category: 'watch' }

      try {
        const queryString = cockpitAdapter.buildQuery(watchFilters)
        const url = queryString
          ? `${cockpitAdapter.endpoints.watch}?${queryString}`
          : cockpitAdapter.endpoints.watch

        const response =
          await productService.adapter.config.baseApi.getWithMiddleware(url)
        const processedResponse = cockpitAdapter.processResponse(response)

        const watches = Array.isArray(processedResponse.data)
          ? processedResponse.data.map(normalizeWatch).filter(isNotNil)
          : [normalizeWatch(processedResponse.data)].filter(isNotNil)

        return {
          products: watches,
          meta: processedResponse.meta,
          filters: {
            ...productService.extractFilterOptions(watches),
            ...extractWatchFilterOptions(watches),
          },
        }
      } catch (error) {
        throw cockpitAdapter.handleError(error)
      }
    },

    fetchWatchById: async (id) => {
      try {
        const url = `${cockpitAdapter.endpoints.watchById}/${id}`
        const response =
          await productService.adapter.config.baseApi.getWithMiddleware(url)
        const processedResponse = cockpitAdapter.processResponse(response)

        return normalizeWatch(processedResponse.data)
      } catch (error) {
        throw cockpitAdapter.handleError(error)
      }
    },

    // Watch-specific methods
    fetchByMovement: async (movement, filters = {}) => {
      const movementFilters = { ...filters, movement }
      return await this.fetchWatches(movementFilters)
    },

    fetchByCaseMaterial: async (caseMaterial, filters = {}) => {
      const materialFilters = { ...filters, caseMaterial }
      return await this.fetchWatches(materialFilters)
    },

    fetchByDialColor: async (dialColor, filters = {}) => {
      const colorFilters = { ...filters, dialColor }
      return await this.fetchWatches(colorFilters)
    },

    fetchByWaterResistance: async (level, filters = {}) => {
      const resistanceFilters = { ...filters, waterResistanceLevel: level }
      return await this.fetchWatches(resistanceFilters)
    },

    fetchLuxuryWatches: async (filters = {}) => {
      const luxuryFilters = { ...filters, luxuryOnly: true }
      return await this.fetchWatches(luxuryFilters)
    },

    fetchVintageWatches: async (filters = {}) => {
      const vintageFilters = { ...filters, vintageOnly: true }
      return await this.fetchWatches(vintageFilters)
    },

    fetchWithComplications: async (filters = {}) => {
      const complicationFilters = { ...filters, hasComplications: true }
      return await this.fetchWatches(complicationFilters)
    },

    // Watch-specific transformations
    normalizeWatch,
    filterWatches,
    extractWatchFilterOptions,

    // Watch-specific utilities
    getWaterResistanceLevel,
    getMovementType,
    addWatchComputedFields,

    // Configuration
    watchConfig: finalConfig,
  }
}

// ============================================================================
// WATCH CATEGORIES AND CONSTANTS
// ============================================================================

/**
 * Watch movement types
 */
export const MOVEMENT_TYPES = {
  AUTOMATIC: 'automatic',
  MANUAL: 'manual',
  QUARTZ: 'quartz',
  MECHANICAL: 'mechanical',
}

/**
 * Water resistance levels
 */
export const WATER_RESISTANCE_LEVELS = {
  NONE: 'none',
  BASIC: 'basic',
  SPLASH: 'splash',
  SWIMMING: 'swimming',
  DIVING: 'diving',
}

/**
 * Common watch complications
 */
export const WATCH_COMPLICATIONS = [
  'Date',
  'Day-Date',
  'GMT',
  'Chronograph',
  'Moon Phase',
  'Power Reserve',
  'Tourbillon',
  'Perpetual Calendar',
  'Annual Calendar',
  'Minute Repeater',
]

/**
 * Popular watch brands
 */
export const WATCH_BRANDS = [
  'Rolex',
  'Omega',
  'Cartier',
  'Patek Philippe',
  'Audemars Piguet',
  'Vacheron Constantin',
  'Jaeger-LeCoultre',
  'IWC',
  'Breitling',
  'TAG Heuer',
  'Hublot',
  'Panerai',
  'Tudor',
  'Seiko',
  'Citizen',
]

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  // Service factory
  createWatchService,

  // Configuration
  watchServiceConfig,

  // Transformations
  normalizeWatch,
  addWatchComputedFields,

  // Filtering
  createWatchFilter,
  filterWatches,

  // Aggregations
  extractWatchFilterOptions,

  // Constants
  MOVEMENT_TYPES,
  WATER_RESISTANCE_LEVELS,
  WATCH_COMPLICATIONS,
  WATCH_BRANDS,
}
