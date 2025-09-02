/**
 * GLightbox Initialization
 * Uses webpack externals to get GLightbox from global scope
 * This function is safe to call even if GLightbox is not loaded
 */
export const initLightbox = () => {
  try {
    // GLightbox is available through webpack externals
    const lightbox = GLightbox({
      selector: '.glightbox',
      touchNavigation: true,
      loop: true,
      autoplayVideos: false,
      zoomable: true,
      draggable: true,
      openEffect: 'zoom',
      closeEffect: 'fade',
      slideEffect: 'slide',
      moreText: 'Подробнее',
      moreLength: 60,
      cssEfects: {
        fade: { in: 'fadeIn', out: 'fadeOut' },
        zoom: { in: 'zoomIn', out: 'zoomOut' },
      },
    })

    console.log('✅ GLightbox initialized successfully')
    return lightbox
  } catch (error) {
    console.error('❌ Error initializing GLightbox:', error)
    console.log('ℹ️ GLightbox not loaded - lightbox functionality disabled')
    return null
  }
}

// Quick View functionality moved to quickView.js
// This prevents code duplication and conflicts
