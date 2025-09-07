/**
 * Quick View Modal Functionality
 * Handles Bootstrap modal initialization and product quick view
 */

import { getWatchProductById } from '../api/api.js'
import {
  createModalContent,
  createModalLoadingState,
  createModalErrorState,
} from '../api/templates.js'

/**
 * Initialize Quick View Modal
 */
const initQuickView = () => {
  try {
    // Check if Bootstrap is available
    if (typeof bootstrap === 'undefined') {
      console.warn('⚠️ Bootstrap not loaded - Quick view modals disabled')
      return
    }

    // Get the modal element
    const modalElement = document.getElementById('exampleModalCenter')
    if (!modalElement) {
      console.warn('⚠️ Quick view modal element not found')
      return
    }

    // Initialize Bootstrap modal with proper configuration
    const modal = new bootstrap.Modal(modalElement, {
      backdrop: true,
      keyboard: true,
      focus: true,
    })

    // Add event listeners for quick view buttons
    const initQuickViewButtons = () => {
      const quickViewButtons = document.querySelectorAll('.quick-view')

      quickViewButtons.forEach((button) => {
        // Remove existing listeners to prevent duplicates
        button.removeEventListener('click', handleQuickViewClick)

        // Add click handler
        button.addEventListener('click', handleQuickViewClick)
      })

      console.log(
        `✅ Initialized ${quickViewButtons.length} quick view buttons`,
      )
    }

    // Handle quick view button clicks
    const handleQuickViewClick = async (e) => {
      e.preventDefault()

      const button = e.currentTarget
      const productId = button.getAttribute('data-product-id')

      console.log('📦 Opening quick view for product:', productId || 'sample')

      // Update modal content if we have product data
      if (productId) {
        await updateModalContent(productId)
      } else {
        // Show error if no product ID
        showModalError('Не удалось получить информацию о товаре')
      }

      // Show the modal
      modal.show()
    }

    // Update modal content with product data
    const updateModalContent = async (productId) => {
      const modalInnerArea = modalElement.querySelector('.modal-inner-area')

      if (!modalInnerArea) {
        console.error('❌ Modal inner area not found')
        return
      }

      try {
        // Show loading state
        showModalLoading()

        console.log(`🔄 Loading product data for ID: ${productId}`)

        // Fetch product data using the API
        const product = await getWatchProductById(productId)

        if (!product) {
          throw new Error('Товар не найден')
        }

        // Render the modal content with product data
        modalInnerArea.innerHTML = createModalContent(product)

        console.log('📝 Modal content updated successfully')

        // Initialize any additional components (like lightbox) after content is loaded
        initModalComponents()
      } catch (error) {
        console.error('❌ Error loading product data:', error)
        showModalError(error.message || 'Ошибка загрузки данных о товаре')
      }
    }

    // Show loading state in modal
    const showModalLoading = () => {
      const modalInnerArea = modalElement.querySelector('.modal-inner-area')
      if (modalInnerArea) {
        modalInnerArea.innerHTML = createModalLoadingState()
      }
    }

    // Show error state in modal
    const showModalError = (message) => {
      const modalInnerArea = modalElement.querySelector('.modal-inner-area')
      if (modalInnerArea) {
        modalInnerArea.innerHTML = createModalErrorState(message)
      }
    }

    // Initialize modal-specific components after content load
    const initModalComponents = () => {
      // Initialize GLightbox for modal gallery if available
      if (typeof GLightbox !== 'undefined') {
        try {
          const modalGallery = GLightbox({
            selector: '.modal-inner-area .glightbox',
            touchNavigation: true,
            loop: true,
            autoplayVideos: false,
          })
          console.log('✅ Modal lightbox gallery initialized')
        } catch (error) {
          console.warn('⚠️ Could not initialize modal lightbox:', error)
        }
      }

      // Initialize wishlist functionality for modal
      const wishlistButtons = modalElement.querySelectorAll('.add_to_wishlist')
      wishlistButtons.forEach((button) => {
        button.addEventListener('click', (e) => {
          e.preventDefault()
          const productId = button.getAttribute('data-product-id')
          console.log('💖 Adding product to wishlist:', productId)
          // Wishlist functionality can be implemented here
        })
      })
    }

    // Initialize buttons immediately
    initQuickViewButtons()

    // Re-initialize buttons when new content is loaded (for dynamic products)
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          // Check if any added nodes contain quick view buttons
          const hasQuickViewButtons = Array.from(mutation.addedNodes).some(
            (node) => {
              return (
                node.nodeType === 1 &&
                (node.classList?.contains('quick-view') ||
                  node.querySelector?.('.quick-view'))
              )
            },
          )

          if (hasQuickViewButtons) {
            console.log(
              '🔄 New quick view buttons detected, re-initializing...',
            )
            setTimeout(initQuickViewButtons, 100)
          }
        }
      })
    })

    // Observe the products container for dynamic content
    const productsContainer = document.getElementById('products')
    if (productsContainer) {
      observer.observe(productsContainer, {
        childList: true,
        subtree: true,
      })
    }

    // Also observe the entire document body for other dynamic content
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    })

    console.log('✅ Quick View modal initialized successfully')

    // Return the modal instance for external use
    return modal
  } catch (error) {
    console.error('❌ Error initializing Quick View modal:', error)
    return null
  }
}

/**
 * Auto-initialize when DOM is ready
 */
const autoInit = () => {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initQuickView)
  } else {
    // DOM already loaded
    initQuickView()
  }
}

// Auto-initialize
autoInit()

// Export for manual initialization
export { initQuickView }

console.log('📦 quickView.js loaded - Quick view functionality ready')
