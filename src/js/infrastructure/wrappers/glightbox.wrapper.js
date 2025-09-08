
/**
 * Functional GLightbox Wrapper
 * Pure functional interface for GLightbox with composition
 */

import {
  curry,
  pipe,
  compose,
  merge,
  tap,
  isNil
} from '../../core/functional.utils.js'

// ============================================================================
// GLIGHTBOX FACTORY
// ============================================================================

/**
 * Create a GLightbox instance with functional configuration
 */
export const createGLightbox = (config = {}) => {
  if (typeof GLightbox === 'undefined') {
    console.warn('GLightbox is not loaded')
    return null
  }

  try {
    const lightbox = GLightbox(config)
    console.log('✅ GLightbox initialized')
    return lightbox
  } catch (error) {
    console.error('❌ GLightbox initialization failed:', error)
    return null
  }
}

// ============================================================================
// CONFIGURATION BUILDERS
// ============================================================================

/**
 * Base configuration with common defaults
 */
export const baseConfig = {
  touchNavigation: true,
  loop: true,
  autoplayVideos: false,
  zoomable: true,
  draggable: true,
  openEffect: 'zoom',
  closeEffect: 'fade',
  slideEffect: 'slide'
}

/**
 * Selector configuration
 */
export const withSelector = (selector = '.glightbox') => ({
  selector
})

/**
 * Effects configuration
 */
export const withEffects = (openEffect = 'zoom', closeEffect = 'fade', slideEffect = 'slide') => ({
  openEffect,
  closeEffect,
  slideEffect,
  cssEfects: {
    fade: { in: 'fadeIn', out: 'fadeOut' },
    zoom: { in: 'zoomIn', out: 'zoomOut' },
    slide: { in: 'slideInRight', out: 'slideOutLeft' }
  }
})

/**
 * Video configuration
 */
export const withVideo = (autoplay = false, muted = false) => ({
  autoplayVideos: autoplay,
  videosWidth: '960px',
  beforeSlideLoad: (slide, data) => {
    if (slide.slideType === 'video') {
      slide.video = slide.video || {}
      slide.video.muted = muted
    }
  }
})

/**
 * Gallery configuration
 */
export const withGallery = (gallery = 'gallery') => ({
  gallery
})

/**
 * Skin configuration
 */
export const withSkin = (skin = 'clean') => ({
  skin
})

/**
 * More text configuration
 */
export const withMoreText = (moreText = 'See more', moreLength = 60) => ({
  moreText,
  moreLength
})

/**
 * Lightbox size configuration
 */
export const withSize = (width = '900px', height = '506px') => ({
  width,
  height
})

// ============================================================================
// PRESET CONFIGURATIONS
// ============================================================================

/**
 * Product gallery configuration
 */
export const productGalleryConfig = merge(
  baseConfig,
  withSelector('.glightbox'),
  withEffects('zoom', 'fade', 'slide'),
  withGallery('product-gallery'),
  withMoreText('Подробнее', 60),
  {
    touchNavigation: true,
    keyboardNavigation: true,
    closeOnOutsideClick: true,
    startAt: 0,
    descPosition: 'bottom'
  }
)

/**
 * Image zoom configuration
 */
export const imageZoomConfig = merge(
  baseConfig,
  withSelector('.zoom-image'),
  withEffects('zoom', 'zoom', 'slide'),
  {
    zoomable: true,
    draggable: true,
    touchNavigation: true,
    loop: false
  }
)

/**
 * Video lightbox configuration
 */
export const videoLightboxConfig = merge(
  baseConfig,
  withSelector('.video-lightbox'),
  withVideo(true, false),
  withSize('80vw', '80vh'),
  {
    openEffect: 'fade',
    closeEffect: 'fade'
  }
)

/**
 * Simple lightbox configuration
 */
export const simpleLightboxConfig = merge(
  baseConfig,
  withSelector('.simple-lightbox'),
  {
    touchNavigation: true,
    loop: true,
    zoomable: false,
    draggable: false
  }
)

// ============================================================================
// LIGHTBOX CREATORS
// ============================================================================

/**
 * Create product gallery lightbox
 */
export const createProductGallery = () =>
  createGLightbox(productGalleryConfig)

/**
 * Create image zoom lightbox
 */
export const createImageZoom = () =>
  createGLightbox(imageZoomConfig)

/**
 * Create video lightbox
 */
export const createVideoLightbox = () =>
  createGLightbox(videoLightboxConfig)

/**
 * Create simple lightbox
 */
export const createSimpleLightbox = () =>
  createGLightbox(simpleLightboxConfig)

/**
 * Create custom lightbox
 */
export const createCustomLightbox = curry((config) =>
  createGLightbox(merge(baseConfig, config))
)

// ============================================================================
// LIGHTBOX UTILITIES
// ============================================================================

/**
 * Destroy lightbox safely
 */
export const destroyLightbox = (lightbox) => {
  if (lightbox && typeof lightbox.destroy === 'function') {
    try {
      lightbox.destroy()
      return true
    } catch (error) {
      console.error('Error destroying lightbox:', error)
      return false
    }
  }
  return false
}

/**
 * Open lightbox at specific index
 */
export const openAt = curry((index, lightbox) => {
  if (lightbox && typeof lightbox.openAt === 'function') {
    try {
      lightbox.openAt(index)
      return true
    } catch (error) {
      console.error('Error opening lightbox at index:', error)
      return false
    }
  }
  return false
})

/**
 * Open lightbox
 */
export const open = (lightbox) => {
  if (lightbox && typeof lightbox.open === 'function') {
    try {
      lightbox.open()
      return true
    } catch (error) {
      console.error('Error opening lightbox:', error)
      return false
    }
  }
  return false
}

/**
 * Close lightbox
 */
export const close = (lightbox) => {
  if (lightbox && typeof lightbox.close === 'function') {
    try {
      lightbox.close()
      return true
    } catch (error) {
      console.error('Error closing lightbox:', error)
      return false
    }
  }
  return false
}

/**
 * Go to next slide
 */
export const next = (lightbox) => {
  if (lightbox && typeof lightbox.nextSlide === 'function') {
    try {
      lightbox.nextSlide()
      return true
    } catch (error) {
      console.error('Error going to next slide:', error)
      return false
    }
  }
  return false
}

/**
 * Go to previous slide
 */
export const prev = (lightbox) => {
  if (lightbox && typeof lightbox.prevSlide === 'function') {
    try {
      lightbox.prevSlide()
      return true
    } catch (error) {
      console.error('Error going to previous slide:', error)
      return false
    }
  }
  return false
}

/**
 * Reload lightbox
 */
export const reload = (lightbox) => {
  if (lightbox && typeof lightbox.reload === 'function') {
    try {
      lightbox.reload()
      return true
    } catch (error) {
      console.error('Error reloading lightbox:', error)
      return false
    }
  }
  return false
}

// ============================================================================
// EVENT HANDLERS
// ============================================================================

/**
 * Create event handler configuration
 */
export const withEventHandlers = (handlers = {}) => {
  const config = {}

  if (handlers.onOpen) {
    config.onOpen = handlers.onOpen
  }

  if (handlers.onClose) {
    config.onClose = handlers.onClose
  }

  if (handlers.onSlideChange) {
    config.onSlideChange = handlers.onSlideChange
  }

  if (handlers.onBeforeSlideChange) {
    config.onBeforeSlideChange = handlers.onBeforeSlideChange
  }

  if (handlers.onAfterSlideChange) {
    config.onAfterSlideChange = handlers.onAfterSlideChange
  }

  if (handlers.onSlideLoad) {
    config.onSlideLoad = handlers.onSlideLoad
  }

  if (handlers.onBeforeSlideLoad) {
    config.onBeforeSlideLoad = handlers.onBeforeSlideLoad
  }

  return config
}

/**
 * Common event handlers
 */
export const commonEventHandlers = {
  onOpen: () => {
    console.log('🔍 Lightbox opened')
    document.body.classList.add('lightbox-open')
  },

  onClose: () => {
    console.log('❌ Lightbox closed')
    document.body.classList.remove('lightbox-open')
  },

  onSlideChange: (slide, data) => {
    console.log('🔄 Slide changed:', slide.index)
  },

  onSlideLoad: (slide, data) => {
    console.log('📷 Slide loaded:', slide.index)
  }
}

// ============================================================================
// LIGHTBOX MANAGER
// ============================================================================

/**
 * Create a lightbox manager for handling multiple lightboxes
 */
export const createLightboxManager = () => {
  const lightboxes = new Map()

  return {
    // Register a lightbox
    register: (name, lightbox) => {
      if (lightbox) {
        lightboxes.set(name, lightbox)
        console.log(`📝 Lightbox registered: ${name}`)
      }
    },

    // Get a lightbox by name
    get: (name) => lightboxes.get(name),

    // Check if lightbox exists
    has: (name) => lightboxes.has(name),

    // Open a lightbox
    open: (name, index = 0) => {
      const lightbox = lightboxes.get(name)
      return index > 0 ? openAt(index, lightbox) : open(lightbox)
    },

    // Close a lightbox
    close: (name) => {
      const lightbox = lightboxes.get(name)
      return close(lightbox)
    },

    // Reload a lightbox
    reload: (name) => {
      const lightbox = lightboxes.get(name)
      return reload(lightbox)
    },
    
    // Destroy a lightbox
    destroy: (name) => {
      const lightbox = lightboxes.get(name)
      if (destroyLightbox(lightbox)) {
        lightboxes.delete(name)
        console.log(`🗑️ Lightbox destroyed: ${name}`)
        return true
      }
      return false
    },
    
    // Destroy all lightboxes
    destroyAll: () => {
      let destroyed = 0
      lightboxes.forEach((lightbox, name) => {
        if (destroyLightbox(lightbox)) {
          destroyed++
        }
      })
      lightboxes.clear()
      console.log(`🗑️ All lightboxes destroyed: ${destroyed}`)
      return destroyed
    },
    
    // List all lightbox names
    list: () => Array.from(lightboxes.keys()),
    
    // Get lightbox count
    count: () => lightboxes.size
  }
}

// ============================================================================
// INITIALIZATION
// ============================================================================

/**
 * Initialize all lightboxes on page
 */
export const initializeAllLightboxes = () => {
  const manager = createLightboxManager()
  
  // Initialize product gallery lightbox
  const productGallery = createProductGallery()
  if (productGallery) manager.register('product-gallery', productGallery)
  
  // Initialize image zoom lightbox
  const imageZoom = createImageZoom()
  if (imageZoom) manager.register('image-zoom', imageZoom)
  
  // Initialize video lightbox
  const videoLightbox = createVideoLightbox()
  if (videoLightbox) manager.register('video', videoLightbox)
  
  // Initialize simple lightbox
  const simpleLightbox = createSimpleLightbox()
  if (simpleLightbox) manager.register('simple', simpleLightbox)
  
  // Make manager globally available
  window.lightboxManager = manager
  
  console.log(`💡 Initialized ${manager.count()} lightboxes:`, manager.list())
  
  return manager
}

/**
 * Reinitialize lightboxes (useful after dynamic content changes)
 */
export const reinitializeLightboxes = () => {
  // Destroy existing lightboxes
  if (window.lightboxManager) {
    window.lightboxManager.destroyAll()
  }
  
  // Initialize new ones
  return initializeAllLightboxes()
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  // Core functions
  createGLightbox,
  
  // Configuration builders
  baseConfig,
  withSelector,
  withEffects,
  withVideo,
  withGallery,
  withSkin,
  withMoreText,
  withSize,
  withEventHandlers,
  
  // Preset configurations
  productGalleryConfig,
  imageZoomConfig,
  videoLightboxConfig,
  simpleLightboxConfig,
  
  // Lightbox creators
  createProductGallery,
  createImageZoom,
  createVideoLightbox,
  createSimpleLightbox,
  createCustomLightbox,
  
  // Utilities
  destroyLightbox,
  openAt,
  open,
  close,
  next,
  prev,
  reload,
  
  // Event handlers
  commonEventHandlers,
  
  // Manager
  createLightboxManager,
  initializeAllLightboxes,
  reinitializeLightboxes
}
