/**
 * Infrastructure Layer - Main Export
 * Unified entry point for all infrastructure utilities and wrappers
 */

// Import dependency wrappers
import AxiosWrapper from './wrappers/axios.wrapper.js'
import SwiperWrapper from './wrappers/swiper.wrapper.js'
import GLightboxWrapper from './wrappers/glightbox.wrapper.js'
import BootstrapWrapper from './wrappers/bootstrap.wrapper.js'

// Re-export with specific names to avoid conflicts
export {
  // Axios wrapper
  createHttpClient,
} from './wrappers/axios.wrapper.js'

export {
  // Swiper wrapper
  initializeAllSwipers,
  createProductGallery as swiperCreateProductGallery,
  baseConfig as swiperBaseConfig,
} from './wrappers/swiper.wrapper.js'

export {
  // GLightbox wrapper
  initializeAllLightboxes,
  createProductGallery as lightboxCreateProductGallery,
  baseConfig as lightboxBaseConfig,
} from './wrappers/glightbox.wrapper.js'

export {
  // Bootstrap wrapper
  initializeBootstrapComponents,
  createModal,
  createTooltip,
  createPopover,
  createDropdown,
  createCollapse,
  createOffcanvas,
} from './wrappers/bootstrap.wrapper.js'

// Named exports
export { AxiosWrapper, SwiperWrapper, GLightboxWrapper, BootstrapWrapper }

// ============================================================================
// UNIFIED INFRASTRUCTURE API
// ============================================================================

/**
 * Create the unified infrastructure API
 */
export const createInfrastructure = () => {
  return {
    // HTTP client wrapper
    http: AxiosWrapper,

    // UI component wrappers
    swiper: SwiperWrapper,
    lightbox: GLightboxWrapper,
    bootstrap: BootstrapWrapper,

    // Version info
    version: '1.0.0',
    name: 'Time-Sphere Infrastructure Layer',
  }
}

// ============================================================================
// DEFAULT EXPORT
// ============================================================================

export default createInfrastructure()
