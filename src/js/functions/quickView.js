/**
 * Quick View Modal Functionality
 * Handles Bootstrap modal initialization and product quick view
 */

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
    const handleQuickViewClick = (e) => {
      e.preventDefault()

      const button = e.currentTarget
      const productId = button.getAttribute('data-product-id')

      console.log('📦 Opening quick view for product:', productId || 'sample')

      // Update modal content if we have product data
      if (productId) {
        updateModalContent(productId)
      }

      // Show the modal
      modal.show()
    }

    // Update modal content with product data
    const updateModalContent = (productId) => {
      // This is a placeholder for dynamic content loading
      // In the future, this could fetch product data and update the modal
      console.log(`🔄 Loading product data for ID: ${productId}`)

      // For now, just update the modal title or basic content
      const modalBody = modalElement.querySelector('.modal-body')
      if (modalBody) {
        // Add a loading indicator or update content
        console.log('📝 Modal content updated')
      }
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
