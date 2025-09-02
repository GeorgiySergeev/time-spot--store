import AOS from 'aos'

/**
 * Initialize AOS (Animate On Scroll) library
 * Adds smooth scroll animations to elements
 */
export function initAOS() {
  AOS.init({
    // Global settings
    duration: 1000, // Animation duration in milliseconds
    easing: 'ease-in-out', // Easing function for animations
    once: true, // Whether animation should happen only once
    mirror: false, // Whether elements should animate out while scrolling past them
    anchorPlacement: 'top-bottom', // Defines which position of the element triggers animation

    // Advanced settings
    offset: 120, // Offset (in px) from the original trigger point
    delay: 0, // Delay in milliseconds
    disable: false, // Conditions for disabling AOS

    // Settings that can be overridden on per-element basis
    startEvent: 'DOMContentLoaded', // Name of event that is fired on document
    animatedClassName: 'aos-animate', // Class applied on animation
    initClassName: 'aos-init', // Class applied after initialization
    useClassNames: false, // If true, will add content of `data-aos` as classes on scroll
    disableMutationObserver: false, // Disables automatic mutations' detections
    debounceDelay: 50, // Delay on debounce used while resizing window
    throttleDelay: 99, // Delay on throttle used while scrolling the page
  })

  console.log('🎨 AOS (Animate On Scroll) initialized')
}

/**
 * Refresh AOS - useful when dynamically adding content
 */
export function refreshAOS() {
  AOS.refresh()
  console.log('🔄 AOS refreshed')
}

/**
 * Common AOS animation configurations
 * Use these as data-aos attributes in HTML
 */
export const AOSAnimations = {
  // Fade animations
  FADE_UP: 'fade-up',
  FADE_DOWN: 'fade-down',
  FADE_LEFT: 'fade-left',
  FADE_RIGHT: 'fade-right',
  FADE_UP_RIGHT: 'fade-up-right',
  FADE_UP_LEFT: 'fade-up-left',
  FADE_DOWN_RIGHT: 'fade-down-right',
  FADE_DOWN_LEFT: 'fade-down-left',

  // Flip animations
  FLIP_LEFT: 'flip-left',
  FLIP_RIGHT: 'flip-right',
  FLIP_UP: 'flip-up',
  FLIP_DOWN: 'flip-down',

  // Slide animations
  SLIDE_UP: 'slide-up',
  SLIDE_DOWN: 'slide-down',
  SLIDE_LEFT: 'slide-left',
  SLIDE_RIGHT: 'slide-right',

  // Zoom animations
  ZOOM_IN: 'zoom-in',
  ZOOM_IN_UP: 'zoom-in-up',
  ZOOM_IN_DOWN: 'zoom-in-down',
  ZOOM_IN_LEFT: 'zoom-in-left',
  ZOOM_IN_RIGHT: 'zoom-in-right',
  ZOOM_OUT: 'zoom-out',
  ZOOM_OUT_UP: 'zoom-out-up',
  ZOOM_OUT_DOWN: 'zoom-out-down',
  ZOOM_OUT_LEFT: 'zoom-out-left',
  ZOOM_OUT_RIGHT: 'zoom-out-right',
}
