import { throttle } from './throttle.js'

/**
 * Parallax effect for banner elements
 * Creates smooth scrolling parallax animation
 */
export const initParallax = () => {
  const parallaxElements = document.querySelectorAll('.parallax-element')

  if (parallaxElements.length === 0) return

  const updateParallax = () => {
    const scrollTop = window.pageYOffset
    const windowHeight = window.innerHeight

    parallaxElements.forEach((element) => {
      const elementTop = element.offsetTop
      const elementHeight = element.offsetHeight
      const speed = element.dataset.parallaxSpeed || 0.5

      // Check if element is in viewport
      if (
        elementTop < scrollTop + windowHeight &&
        elementTop + elementHeight > scrollTop
      ) {
        // Calculate parallax offset
        const yPos = -(scrollTop - elementTop) * speed

        // Apply transform with GPU acceleration
        element.style.transform = `translate3d(0, ${yPos}px, 0)`
      }
    })
  }

  // Initialize parallax elements
  parallaxElements.forEach((element) => {
    // Set initial styles for smooth animation
    element.style.willChange = 'transform'
    element.style.transform = 'translate3d(0, 0, 0)'

    // Add transition for smooth effect
    if (!element.style.transition) {
      element.style.transition = 'transform 0.1s ease-out'
    }
  })

  // Throttled scroll handler for performance
  const throttledUpdate = throttle(updateParallax, 16) // ~60fps

  // Add scroll listener
  window.addEventListener('scroll', throttledUpdate, { passive: true })

  // Initial call
  updateParallax()

  console.log(
    '✨ Parallax initialized for',
    parallaxElements.length,
    'elements',
  )
}

/**
 * Advanced parallax with multiple layers and different speeds
 */
export const initAdvancedParallax = () => {
  const parallaxSections = document.querySelectorAll('.parallax-section')

  if (parallaxSections.length === 0) return

  const updateAdvancedParallax = () => {
    const scrollTop = window.pageYOffset
    const windowHeight = window.innerHeight

    parallaxSections.forEach((section) => {
      const sectionTop = section.offsetTop
      const sectionHeight = section.offsetHeight

      // Check if section is in viewport
      if (
        sectionTop < scrollTop + windowHeight &&
        sectionTop + sectionHeight > scrollTop
      ) {
        // Get all parallax layers within this section
        const layers = section.querySelectorAll('[data-parallax-speed]')

        layers.forEach((layer) => {
          const speed = parseFloat(layer.dataset.parallaxSpeed) || 0.5
          const yPos = -(scrollTop - sectionTop) * speed

          // Apply transform with different effects based on layer type
          if (layer.classList.contains('parallax-bg')) {
            // Background parallax with scale
            layer.style.transform = `translate3d(0, ${yPos}px, 0) scale(1.1)`
          } else if (layer.classList.contains('parallax-content')) {
            // Content parallax with opacity fade
            const opacity = Math.max(0, Math.min(1, 1 - Math.abs(yPos) / 200))
            layer.style.transform = `translate3d(0, ${yPos}px, 0)`
            layer.style.opacity = opacity
          } else {
            // Default parallax
            layer.style.transform = `translate3d(0, ${yPos}px, 0)`
          }
        })
      }
    })
  }

  // Initialize advanced parallax
  parallaxSections.forEach((section) => {
    const layers = section.querySelectorAll('[data-parallax-speed]')

    layers.forEach((layer) => {
      layer.style.willChange = 'transform'
      layer.style.transform = 'translate3d(0, 0, 0)'

      // Add specific transitions for different layer types
      if (layer.classList.contains('parallax-content')) {
        layer.style.transition =
          'transform 0.1s ease-out, opacity 0.1s ease-out'
      } else {
        layer.style.transition = 'transform 0.1s ease-out'
      }
    })
  })

  // Throttled scroll handler
  const throttledAdvancedUpdate = throttle(updateAdvancedParallax, 16)

  // Add scroll listener
  window.addEventListener('scroll', throttledAdvancedUpdate, { passive: true })

  // Initial call
  updateAdvancedParallax()

  console.log(
    '🌟 Advanced parallax initialized for',
    parallaxSections.length,
    'sections',
  )
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  initParallax()
  initAdvancedParallax()
})
