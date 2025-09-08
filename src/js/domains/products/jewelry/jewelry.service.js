/**
 * Jewelry Service - Functional Jewelry-Specific Operations
 * Domain service for jewelry-related business logic
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
// JEWELRY-SPECIFIC CONFIGURATION
// ============================================================================

/**
 * Jewelry service configuration
 */
export const jewelryServiceConfig = {
  category: 'jewelry',
  endpoint: '/content/items/jewelry',
  endpointById: '/content/item/jewelry',
}

// ============================================================================
// JEWELRY DATA TRANSFORMATIONS
// ============================================================================

/**
 * Add jewelry-specific computed fields
 */
export const addJewelryComputedFields = (jewelry) => ({
  ...jewelry,
  isFinejewelry: jewelry.price > 5000,
  isPrecious: jewelry.material && isPreciousMaterial(jewelry.material),
  hasGemstones: jewelry.gemstones && jewelry.gemstones.length > 0,
  materialType: getMaterialType(jewelry.material),
  jewelryType: getJewelryType(jewelry.type || jewelry.category),
  karatLevel: getKaratLevel(jewelry.karat),
})

/**
 * Check if material is precious
 */
const isPreciousMaterial = (material) => {
  if (!material) return false

  const materialLower = material.toLowerCase()
  return (
    materialLower.includes('gold') ||
    materialLower.includes('silver') ||
    materialLower.includes('platinum') ||
    materialLower.includes('palladium')
  )
}

/**
 * Get material type category
 */
const getMaterialType = (material) => {
  if (!material) return 'unknown'

  const materialLower = material.toLowerCase()
  if (materialLower.includes('gold')) return 'gold'
  if (materialLower.includes('silver')) return 'silver'
  if (materialLower.includes('platinum')) return 'platinum'
  if (materialLower.includes('palladium')) return 'palladium'
  if (materialLower.includes('titanium')) return 'titanium'
  if (materialLower.includes('steel')) return 'steel'
  return 'other'
}

/**
 * Get jewelry type category
 */
const getJewelryType = (type) => {
  if (!type) return 'unknown'

  const typeLower = type.toLowerCase()
  if (typeLower.includes('ring')) return 'ring'
  if (typeLower.includes('necklace') || typeLower.includes('chain'))
    return 'necklace'
  if (typeLower.includes('earring')) return 'earrings'
  if (typeLower.includes('bracelet')) return 'bracelet'
  if (typeLower.includes('pendant')) return 'pendant'
  if (typeLower.includes('brooch')) return 'brooch'
  if (typeLower.includes('cufflink')) return 'cufflinks'
  return 'other'
}

/**
 * Get karat level category
 */
const getKaratLevel = (karat) => {
  if (!karat) return 'unknown'

  const karatNum = parseInt(karat)
  if (karatNum >= 22) return 'high'
  if (karatNum >= 18) return 'medium'
  if (karatNum >= 14) return 'standard'
  if (karatNum >= 10) return 'low'
  return 'unknown'
}

/**
 * Normalize jewelry data
 */
export const normalizeJewelry = (jewelry) => {
  if (!jewelry) return null

  return pipe(addJewelryComputedFields, (j) => ({
    ...j,
    category: 'jewelry',
    // Jewelry-specific fields
    material: j.material || 'Unknown',
    karat: j.karat || j.gold_karat || 0,
    gemstones: j.gemstones || j.stones || [],
    setting: j.setting || j.stone_setting || 'Unknown',
    size: j.size || j.ring_size || 'Unknown',
    weight: j.weight || j.total_weight || 0,
    certification: j.certification || j.certificate || null,
    origin: j.origin || j.country_of_origin || 'Unknown',
  }))(jewelry)
}

// ============================================================================
// JEWELRY-SPECIFIC FILTERING
// ============================================================================

/**
 * Create jewelry filter function
 */
export const createJewelryFilter = (criteria) => (jewelry) => {
  // Material filter
  if (criteria.material && jewelry.materialType !== criteria.material) {
    return false
  }

  // Jewelry type filter
  if (criteria.jewelryType && jewelry.jewelryType !== criteria.jewelryType) {
    return false
  }

  // Karat level filter
  if (criteria.karatLevel && jewelry.karatLevel !== criteria.karatLevel) {
    return false
  }

  // Gemstone filter
  if (
    criteria.gemstone &&
    !jewelry.gemstones.some((stone) =>
      stone.toLowerCase().includes(criteria.gemstone.toLowerCase()),
    )
  ) {
    return false
  }

  // Fine jewelry filter
  if (criteria.fineJewelryOnly && !jewelry.isFinejewelry) {
    return false
  }

  // Precious material filter
  if (criteria.preciousOnly && !jewelry.isPrecious) {
    return false
  }

  // Has gemstones filter
  if (
    criteria.hasGemstones !== undefined &&
    jewelry.hasGemstones !== criteria.hasGemstones
  ) {
    return false
  }

  return true
}

/**
 * Filter jewelry by criteria
 */
export const filterJewelry = curry((criteria, jewelry) =>
  jewelry.filter(createJewelryFilter(criteria)),
)

// ============================================================================
// JEWELRY-SPECIFIC AGGREGATIONS
// ============================================================================

/**
 * Extract jewelry-specific filter options
 */
export const extractJewelryFilterOptions = (jewelry) => {
  const materials = [
    ...new Set(jewelry.map(prop('materialType')).filter(isNotNil)),
  ]
  const jewelryTypes = [
    ...new Set(jewelry.map(prop('jewelryType')).filter(isNotNil)),
  ]
  const karatLevels = [
    ...new Set(jewelry.map(prop('karatLevel')).filter(isNotNil)),
  ]
  const gemstones = [
    ...new Set(jewelry.flatMap(prop('gemstones')).filter(isNotNil)),
  ]
  const settings = [...new Set(jewelry.map(prop('setting')).filter(isNotNil))]

  return {
    materials: materials.sort(),
    jewelryTypes: jewelryTypes.sort(),
    karatLevels: karatLevels.sort(),
    gemstones: gemstones.sort(),
    settings: settings.sort(),
  }
}

// ============================================================================
// JEWELRY SERVICE FACTORY
// ============================================================================

/**
 * Create jewelry service
 */
export const createJewelryService = (config = {}) => {
  const finalConfig = merge(jewelryServiceConfig, config)

  // Create base product service
  const productService = createProductService(finalConfig)

  // Create Cockpit adapter with jewelry-specific configuration
  const cockpitAdapter = createCockpitAdapter({
    ...finalConfig,
    normalizeProduct: normalizeJewelry,
  })

  return {
    // Inherit all product service methods
    ...productService,

    // Override with jewelry-specific implementations
    fetchJewelry: async (filters = {}) => {
      const jewelryFilters = { ...filters, category: 'jewelry' }

      try {
        const queryString = cockpitAdapter.buildQuery(jewelryFilters)
        const url = queryString
          ? `${cockpitAdapter.endpoints.jewelry}?${queryString}`
          : cockpitAdapter.endpoints.jewelry

        const response =
          await productService.adapter.config.baseApi.getWithMiddleware(url)
        const processedResponse = cockpitAdapter.processResponse(response)

        const jewelry = Array.isArray(processedResponse.data)
          ? processedResponse.data.map(normalizeJewelry).filter(isNotNil)
          : [normalizeJewelry(processedResponse.data)].filter(isNotNil)

        return {
          products: jewelry,
          meta: processedResponse.meta,
          filters: {
            ...productService.extractFilterOptions(jewelry),
            ...extractJewelryFilterOptions(jewelry),
          },
        }
      } catch (error) {
        throw cockpitAdapter.handleError(error)
      }
    },

    fetchJewelryById: async (id) => {
      try {
        const url = `${cockpitAdapter.endpoints.jewelryById}/${id}`
        const response =
          await productService.adapter.config.baseApi.getWithMiddleware(url)
        const processedResponse = cockpitAdapter.processResponse(response)

        return normalizeJewelry(processedResponse.data)
      } catch (error) {
        throw cockpitAdapter.handleError(error)
      }
    },

    // Jewelry-specific methods
    fetchByMaterial: async (material, filters = {}) => {
      const materialFilters = { ...filters, material }
      return await this.fetchJewelry(materialFilters)
    },

    fetchByJewelryType: async (jewelryType, filters = {}) => {
      const typeFilters = { ...filters, jewelryType }
      return await this.fetchJewelry(typeFilters)
    },

    fetchByGemstone: async (gemstone, filters = {}) => {
      const gemstoneFilters = { ...filters, gemstone }
      return await this.fetchJewelry(gemstoneFilters)
    },

    fetchByKarat: async (karatLevel, filters = {}) => {
      const karatFilters = { ...filters, karatLevel }
      return await this.fetchJewelry(karatFilters)
    },

    fetchFineJewelry: async (filters = {}) => {
      const fineFilters = { ...filters, fineJewelryOnly: true }
      return await this.fetchJewelry(fineFilters)
    },

    fetchPreciousJewelry: async (filters = {}) => {
      const preciousFilters = { ...filters, preciousOnly: true }
      return await this.fetchJewelry(preciousFilters)
    },

    fetchWithGemstones: async (filters = {}) => {
      const gemstoneFilters = { ...filters, hasGemstones: true }
      return await this.fetchJewelry(gemstoneFilters)
    },

    // Jewelry-specific transformations
    normalizeJewelry,
    filterJewelry,
    extractJewelryFilterOptions,

    // Jewelry-specific utilities
    getMaterialType,
    getJewelryType,
    getKaratLevel,
    isPreciousMaterial,
    addJewelryComputedFields,

    // Configuration
    jewelryConfig: finalConfig,
  }
}

// ============================================================================
// JEWELRY CATEGORIES AND CONSTANTS
// ============================================================================

/**
 * Material types
 */
export const MATERIAL_TYPES = {
  GOLD: 'gold',
  SILVER: 'silver',
  PLATINUM: 'platinum',
  PALLADIUM: 'palladium',
  TITANIUM: 'titanium',
  STEEL: 'steel',
  OTHER: 'other',
}

/**
 * Jewelry types
 */
export const JEWELRY_TYPES = {
  RING: 'ring',
  NECKLACE: 'necklace',
  EARRINGS: 'earrings',
  BRACELET: 'bracelet',
  PENDANT: 'pendant',
  BROOCH: 'brooch',
  CUFFLINKS: 'cufflinks',
  OTHER: 'other',
}

/**
 * Karat levels
 */
export const KARAT_LEVELS = {
  HIGH: 'high', // 22k+
  MEDIUM: 'medium', // 18k-21k
  STANDARD: 'standard', // 14k-17k
  LOW: 'low', // 10k-13k
}

/**
 * Common gemstones
 */
export const GEMSTONES = [
  'Diamond',
  'Ruby',
  'Sapphire',
  'Emerald',
  'Pearl',
  'Amethyst',
  'Topaz',
  'Garnet',
  'Opal',
  'Turquoise',
  'Jade',
  'Onyx',
  'Citrine',
  'Peridot',
  'Aquamarine',
]

/**
 * Popular jewelry brands
 */
export const JEWELRY_BRANDS = [
  'Tiffany & Co.',
  'Cartier',
  'Bulgari',
  'Van Cleef & Arpels',
  'Harry Winston',
  'Graff',
  'Chopard',
  'Boucheron',
  'Piaget',
  'David Yurman',
  'Mikimoto',
  'Pandora',
  'Swarovski',
]

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  // Service factory
  createJewelryService,

  // Configuration
  jewelryServiceConfig,

  // Transformations
  normalizeJewelry,
  addJewelryComputedFields,

  // Filtering
  createJewelryFilter,
  filterJewelry,

  // Aggregations
  extractJewelryFilterOptions,

  // Constants
  MATERIAL_TYPES,
  JEWELRY_TYPES,
  KARAT_LEVELS,
  GEMSTONES,
  JEWELRY_BRANDS,
}
