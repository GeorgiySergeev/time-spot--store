/**
 * Functional Swiper Wrapper
 * Pure functional interface for Swiper.js with composition
 */

import Swiper from 'swiper'
import {
  Autoplay,
  Thumbs,
  Pagination,
  Navigation,
  Keyboard,
  EffectFade,
} from 'swiper/modules'
import {
  curry,
  pipe,
  compose,
  merge,
  tap,
  isNil,
} from '../../core/functional.utils.js'

// Configure Swiper to use modules
Swiper.use([Autoplay, Thumbs, Pagination, Navigation, Keyboard, EffectFade])

// ============================================================================
// SWIPER FACTORY
// ============================================================================

/**
 * Create a Swiper instance with functional configuration
 */
export const createSwiper = curry((selector, config) => {
  const element =
    typeof selector === 'string' ? document.querySelector(selector) : selector

  if (!element) {
    console.warn(`Swiper element not found: ${selector}`)
    return null
  }

  try {
    const swiper = new Swiper(element, config)
    console.log(`✅ Swiper initialized: ${selector}`)
    return swiper
  } catch (error) {
    console.error(`❌ Swiper initialization failed: ${selector}`, error)
    return null
  }
})

// ============================================================================
// CONFIGURATION BUILDERS
// ============================================================================

/**
 * Base configuration with common defaults
 */
export const baseConfig = {
  direction: 'horizontal',
  loop: false,
  grabCursor: true,
  watchOverflow: true,
  observer: true,
  observeParents: true,
}

/**
 * Navigation configuration
 */
export const withNavigation = (
  nextEl = '.swiper-button-next',
  prevEl = '.swiper-button-prev',
) => ({
  navigation: {
    nextEl,
    prevEl,
    disabledClass: 'swiper-button-disabled',
  },
})

/**
 * Pagination configuration
 */
export const withPagination = (el = '.swiper-pagination', options = {}) => ({
  pagination: {
    el,
    clickable: true,
    dynamicBullets: true,
    ...options,
  },
})

/**
 * Autoplay configuration
 */
export const withAutoplay = (delay = 3000, options = {}) => ({
  autoplay: {
    delay,
    disableOnInteraction: false,
    pauseOnMouseEnter: true,
    ...options,
  },
})

/**
 * Keyboard navigation configuration
 */
export const withKeyboard = (enabled = true, onlyInViewport = true) => ({
  keyboard: {
    enabled,
    onlyInViewport,
  },
})

/**
 * Responsive breakpoints configuration
 */
export const withBreakpoints = (breakpoints) => ({
  breakpoints,
})

/**
 * Effect configuration
 */
export const withEffect = (effect, options = {}) => {
  const config = { effect }

  switch (effect) {
    case 'fade':
      config.fadeEffect = {
        crossFade: true,
        ...options,
      }
      break
    case 'cube':
      config.cubeEffect = {
        shadow: true,
        slideShadows: true,
        shadowOffset: 20,
        shadowScale: 0.94,
        ...options,
      }
      break
    case 'coverflow':
      config.coverflowEffect = {
        rotate: 50,
        stretch: 0,
        depth: 100,
        modifier: 1,
        slideShadows: true,
        ...options,
      }
      break
    case 'flip':
      config.flipEffect = {
        slideShadows: true,
        limitRotation: true,
        ...options,
      }
      break
  }

  return config
}

/**
 * Thumbs configuration
 */
export const withThumbs = (thumbsSwiper) => ({
  thumbs: {
    swiper: thumbsSwiper,
  },
})

// ============================================================================
// PRESET CONFIGURATIONS
// ============================================================================

/**
 * Hero slider configuration
 */
export const heroConfig = merge(
  baseConfig,
  withEffect('fade'),
  withAutoplay(5000),
  withPagination(),
  withNavigation(),
  withKeyboard(),
  {
    loop: true,
    speed: 800,
  },
)

/**
 * Product slider configuration
 */
export const productConfig = merge(
  baseConfig,
  withNavigation(),
  withBreakpoints({
    320: {
      slidesPerView: 1,
      spaceBetween: 10,
    },
    480: {
      slidesPerView: 2,
      spaceBetween: 15,
    },
    768: {
      slidesPerView: 3,
      spaceBetween: 15,
    },
    992: {
      slidesPerView: 4,
      spaceBetween: 20,
    },
  }),
  {
    loop: true,
    slidesPerView: 4,
    spaceBetween: 20,
  },
)

/**
 * Brand slider configuration
 */
export const brandConfig = merge(
  baseConfig,
  withAutoplay(3000),
  withBreakpoints({
    320: {
      slidesPerView: 2,
      spaceBetween: 10,
    },
    480: {
      slidesPerView: 3,
      spaceBetween: 15,
    },
    768: {
      slidesPerView: 4,
      spaceBetween: 20,
    },
    1024: {
      slidesPerView: 5,
      spaceBetween: 25,
    },
    1200: {
      slidesPerView: 6,
      spaceBetween: 30,
    },
  }),
  {
    loop: true,
    slidesPerView: 6,
    spaceBetween: 30,
  },
)

/**
 * Testimonials slider configuration
 */
export const testimonialsConfig = merge(
  baseConfig,
  withAutoplay(5000),
  withPagination(),
  withNavigation(),
  withKeyboard(),
  {
    loop: true,
    slidesPerView: 1,
    spaceBetween: 20,
  },
)

/**
 * Product gallery main slider configuration
 */
export const galleryMainConfig = merge(baseConfig, withNavigation(), {
  loop: false,
  spaceBetween: 10,
})

/**
 * Product gallery thumbs configuration
 */
export const galleryThumbsConfig = merge(
  baseConfig,
  withBreakpoints({
    320: {
      slidesPerView: 'auto',
      spaceBetween: 8,
    },
    480: {
      slidesPerView: 'auto',
      spaceBetween: 10,
    },
    768: {
      slidesPerView: 'auto',
      spaceBetween: 12,
    },
  }),
  {
    spaceBetween: 10,
    slidesPerView: 'auto',
    freeMode: true,
    watchSlidesProgress: true,
    slideToClickedSlide: true,
    centerInsufficientSlides: true,
    allowTouchMove: true,
    simulateTouch: true,
    preventClicks: false,
    preventClicksPropagation: false,
  },
)

// ============================================================================
// SWIPER CREATORS
// ============================================================================

/**
 * Create hero swiper
 */
export const createHeroSwiper = createSwiper('.swiper', heroConfig)

/**
 * Create product swiper
 */
export const createProductSwiper = createSwiper(
  '.swiper-product',
  productConfig,
)

/**
 * Create brand swiper
 */
export const createBrandSwiper = createSwiper('.swiper-brands', brandConfig)

/**
 * Create testimonials swiper
 */
export const createTestimonialsSwiper = createSwiper(
  '.swiper-3',
  testimonialsConfig,
)

/**
 * Create product gallery swipers (main + thumbs)
 */
export const createProductGallery = () => {
  const thumbsSwiper = createSwiper(
    '.product-thumbs-swiper',
    galleryThumbsConfig,
  )

  if (!thumbsSwiper) {
    console.warn(
      'Thumbs swiper not created, main swiper will work without thumbs',
    )
  }

  const mainSwiper = createSwiper(
    '.product-main-swiper',
    merge(galleryMainConfig, thumbsSwiper ? withThumbs(thumbsSwiper) : {}),
  )

  // Add click handlers for thumbnails
  if (thumbsSwiper && mainSwiper) {
    const thumbnailSlides = document.querySelectorAll(
      '.product-thumbs-swiper .swiper-slide',
    )
    thumbnailSlides.forEach((slide, index) => {
      slide.addEventListener('click', (e) => {
        e.preventDefault()
        e.stopPropagation()
        mainSwiper.slideTo(index)

        // Update active state
        thumbnailSlides.forEach((s) =>
          s.classList.remove('swiper-slide-thumb-active'),
        )
        slide.classList.add('swiper-slide-thumb-active')
      })
    })
  }

  return { mainSwiper, thumbsSwiper }
}

// ============================================================================
// SWIPER UTILITIES
// ============================================================================

/**
 * Destroy swiper safely
 */
export const destroySwiper = (swiper) => {
  if (swiper && typeof swiper.destroy === 'function') {
    try {
      swiper.destroy(true, true)
      return true
    } catch (error) {
      console.error('Error destroying swiper:', error)
      return false
    }
  }
  return false
}

/**
 * Update swiper
 */
export const updateSwiper = (swiper) => {
  if (swiper && typeof swiper.update === 'function') {
    try {
      swiper.update()
      return true
    } catch (error) {
      console.error('Error updating swiper:', error)
      return false
    }
  }
  return false
}

/**
 * Slide to specific index
 */
export const slideTo = curry((index, speed, swiper) => {
  if (swiper && typeof swiper.slideTo === 'function') {
    try {
      swiper.slideTo(index, speed)
      return true
    } catch (error) {
      console.error('Error sliding to index:', error)
      return false
    }
  }
  return false
})

/**
 * Slide to next
 */
export const slideNext = (swiper, speed) => {
  if (swiper && typeof swiper.slideNext === 'function') {
    try {
      swiper.slideNext(speed)
      return true
    } catch (error) {
      console.error('Error sliding next:', error)
      return false
    }
  }
  return false
}

/**
 * Slide to previous
 */
export const slidePrev = (swiper, speed) => {
  if (swiper && typeof swiper.slidePrev === 'function') {
    try {
      swiper.slidePrev(speed)
      return true
    } catch (error) {
      console.error('Error sliding previous:', error)
      return false
    }
  }
  return false
}

/**
 * Start autoplay
 */
export const startAutoplay = (swiper) => {
  if (swiper?.autoplay?.start) {
    swiper.autoplay.start()
    return true
  }
  return false
}

/**
 * Stop autoplay
 */
export const stopAutoplay = (swiper) => {
  if (swiper?.autoplay?.stop) {
    swiper.autoplay.stop()
    return true
  }
  return false
}

// ============================================================================
// SWIPER MANAGER
// ============================================================================

/**
 * Create a swiper manager for handling multiple swipers
 */
export const createSwiperManager = () => {
  const swipers = new Map()

  return {
    // Register a swiper
    register: (name, swiper) => {
      if (swiper) {
        swipers.set(name, swiper)
        console.log(`📝 Swiper registered: ${name}`)
      }
    },

    // Get a swiper by name
    get: (name) => swipers.get(name),

    // Check if swiper exists
    has: (name) => swipers.has(name),

    // Update a swiper
    update: (name) => {
      const swiper = swipers.get(name)
      return updateSwiper(swiper)
    },

    // Update all swipers
    updateAll: () => {
      let updated = 0
      swipers.forEach((swiper, name) => {
        if (updateSwiper(swiper)) {
          updated++
        }
      })
      return updated
    },

    // Destroy a swiper
    destroy: (name) => {
      const swiper = swipers.get(name)
      if (destroySwiper(swiper)) {
        swipers.delete(name)
        console.log(`🗑️ Swiper destroyed: ${name}`)
        return true
      }
      return false
    },

    // Destroy all swipers
    destroyAll: () => {
      let destroyed = 0
      swipers.forEach((swiper, name) => {
        if (destroySwiper(swiper)) {
          destroyed++
        }
      })
      swipers.clear()
      console.log(`🗑️ All swipers destroyed: ${destroyed}`)
      return destroyed
    },

    // List all swiper names
    list: () => Array.from(swipers.keys()),

    // Get swiper count
    count: () => swipers.size,
  }
}

// ============================================================================
// INITIALIZATION
// ============================================================================

/**
 * Initialize all swipers on page
 */
export const initializeAllSwipers = () => {
  const manager = createSwiperManager()

  // Initialize hero swiper
  try {
    const heroSwiper = createSwiper('.swiper', heroConfig)
    if (heroSwiper) manager.register('hero', heroSwiper)
  } catch (error) {
    console.warn('Hero swiper initialization failed:', error.message)
  }

  // Initialize product swiper
  try {
    const productSwiper = createSwiper('.swiper-product', productConfig)
    if (productSwiper) manager.register('product', productSwiper)
  } catch (error) {
    console.warn('Product swiper initialization failed:', error.message)
  }

  // Initialize brand swiper
  try {
    const brandSwiper = createSwiper('.swiper-brands', brandConfig)
    if (brandSwiper) manager.register('brand', brandSwiper)
  } catch (error) {
    console.warn('Brand swiper initialization failed:', error.message)
  }

  // Initialize testimonials swiper
  try {
    const testimonialsSwiper = createSwiper('.swiper-3', testimonialsConfig)
    if (testimonialsSwiper) manager.register('testimonials', testimonialsSwiper)
  } catch (error) {
    console.warn('Testimonials swiper initialization failed:', error.message)
  }

  // Initialize product gallery
  try {
    const gallery = createProductGallery()
    if (gallery.mainSwiper) manager.register('gallery-main', gallery.mainSwiper)
    if (gallery.thumbsSwiper)
      manager.register('gallery-thumbs', gallery.thumbsSwiper)
  } catch (error) {
    console.warn('Product gallery initialization failed:', error.message)
  }

  // Make manager globally available
  window.swiperManager = manager

  console.log(`🎠 Initialized ${manager.count()} swipers:`, manager.list())

  return manager
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  // Core functions
  createSwiper,

  // Configuration builders
  baseConfig,
  withNavigation,
  withPagination,
  withAutoplay,
  withKeyboard,
  withBreakpoints,
  withEffect,
  withThumbs,

  // Preset configurations
  heroConfig,
  productConfig,
  brandConfig,
  testimonialsConfig,
  galleryMainConfig,
  galleryThumbsConfig,

  // Swiper creators
  createHeroSwiper,
  createProductSwiper,
  createBrandSwiper,
  createTestimonialsSwiper,
  createProductGallery,

  // Utilities
  destroySwiper,
  updateSwiper,
  slideTo,
  slideNext,
  slidePrev,
  startAutoplay,
  stopAutoplay,

  // Manager
  createSwiperManager,
  initializeAllSwipers,
}
