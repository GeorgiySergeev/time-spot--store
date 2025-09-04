/**
 * Product Tabs Component
 * Enhanced Bootstrap tab functionality for product sections
 */

/**
 * Initialize Product Tabs
 */
const initProductTabs = () => {
  try {
    console.log('🎯 Initializing Product Tabs...')

    // Check if Bootstrap is available
    if (typeof bootstrap === 'undefined') {
      console.warn(
        '⚠️ Bootstrap not loaded - Product tabs may not work properly',
      )
      // Try to initialize with basic event listeners as fallback
      initFallbackTabs()
      return
    }

    // Find all product tab containers
    const productTabContainers = document.querySelectorAll('.product-area')

    if (productTabContainers.length === 0) {
      console.log('ℹ️ No product tab containers found')
      return
    }

    productTabContainers.forEach((container, index) => {
      const tabMenu = container.querySelector('.product-tab-menu')
      const tabContent = container.querySelector('.product-tab__content')

      if (!tabMenu || !tabContent) {
        console.warn(
          `⚠️ Product tab structure incomplete in container ${index + 1}`,
        )
        return
      }

      // Initialize Bootstrap tabs
      const tabLinks = tabMenu.querySelectorAll('[data-bs-toggle="tab"]')

      tabLinks.forEach((tabLink, tabIndex) => {
        try {
          // Initialize Bootstrap Tab instance
          const tab = new bootstrap.Tab(tabLink)

          // Add custom event listeners for debugging
          tabLink.addEventListener('shown.bs.tab', (event) => {
            const activeTabId = event.target.getAttribute('href')
            console.log(`🎯 Tab switched to: ${activeTabId}`)

            // Update active states
            updateTabStates(container, activeTabId)
          })

          tabLink.addEventListener('show.bs.tab', (event) => {
            const previousTabId = event.relatedTarget?.getAttribute('href')
            const newTabId = event.target.getAttribute('href')

            console.log(
              `🔄 Switching from ${previousTabId || 'none'} to ${newTabId}`,
            )
          })

          console.log(
            `✅ Tab ${tabIndex + 1} initialized:`,
            tabLink.getAttribute('href'),
          )
        } catch (tabError) {
          console.error(`❌ Error initializing tab ${tabIndex + 1}:`, tabError)
        }
      })

      console.log(
        `✅ Product tabs initialized for container ${index + 1} (${tabLinks.length} tabs)`,
      )
    })

    console.log('🎉 Product tabs initialization complete!')
  } catch (error) {
    console.error('❌ Error initializing product tabs:', error)
    // Fallback to basic functionality
    initFallbackTabs()
  }
}

/**
 * Fallback tab initialization without Bootstrap
 */
const initFallbackTabs = () => {
  console.log('🔧 Initializing fallback tab functionality...')

  const tabLinks = document.querySelectorAll('[data-bs-toggle="tab"]')

  tabLinks.forEach((tabLink) => {
    tabLink.addEventListener('click', (event) => {
      event.preventDefault()

      const targetId = tabLink.getAttribute('href')
      const container = tabLink.closest('.product-area')

      if (container && targetId) {
        // Remove active classes from all tabs and panes
        const allTabLinks = container.querySelectorAll('[data-bs-toggle="tab"]')
        const allTabPanes = container.querySelectorAll('.tab-pane')

        allTabLinks.forEach((link) => {
          link.classList.remove('active')
          link.parentElement.classList.remove('active')
          link.setAttribute('aria-selected', 'false')
        })

        allTabPanes.forEach((pane) => {
          pane.classList.remove('show', 'active')
        })

        // Add active classes to clicked tab and target pane
        tabLink.classList.add('active')
        tabLink.parentElement.classList.add('active')
        tabLink.setAttribute('aria-selected', 'true')

        const targetPane = container.querySelector(targetId)
        if (targetPane) {
          targetPane.classList.add('show', 'active')
        }

        console.log(`🎯 Fallback tab switched to: ${targetId}`)
      }
    })
  })

  console.log('✅ Fallback tabs initialized')
}

/**
 * Update tab states for accessibility
 */
const updateTabStates = (container, activeTabId) => {
  const tabLinks = container.querySelectorAll('[data-bs-toggle="tab"]')

  tabLinks.forEach((link) => {
    const isActive = link.getAttribute('href') === activeTabId
    link.setAttribute('aria-selected', isActive ? 'true' : 'false')

    if (isActive) {
      link.classList.add('active')
      link.parentElement.classList.add('active')
    } else {
      link.classList.remove('active')
      link.parentElement.classList.remove('active')
    }
  })
}

/**
 * Trigger refresh for tab content
 * @param {HTMLElement} tabPane - The active tab pane
 */
const triggerTabContentRefresh = (tabPane) => {
  // Dispatch custom event for tab content refresh
  const refreshEvent = new CustomEvent('tabContentRefresh', {
    detail: { tabPane },
    bubbles: true,
  })

  tabPane.dispatchEvent(refreshEvent)

  // Re-initialize any sliders or carousels in the tab
  const sliders = tabPane.querySelectorAll('.product-active-row-4')
  sliders.forEach((slider) => {
    // Trigger slider refresh if needed
    if (window.Swiper && slider.swiper) {
      slider.swiper.update()
    }
  })
}

/**
 * Programmatically switch to a specific tab
 * @param {string} tabId - The ID of the tab to switch to
 */
const switchToTab = (tabId) => {
  const tabLink = document.querySelector(`[href="${tabId}"]`)
  if (tabLink) {
    if (typeof bootstrap !== 'undefined') {
      const tab = new bootstrap.Tab(tabLink)
      tab.show()
    } else {
      // Fallback click simulation
      tabLink.click()
    }
  }
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  console.log('📦 Product Tabs: DOM ready, initializing...')
  initProductTabs()
})

// Also try to initialize after a short delay in case of timing issues
setTimeout(() => {
  console.log('📦 Product Tabs: Delayed initialization check...')

  // Only re-initialize if tabs aren't working
  const activeTab = document.querySelector('.product-tab-menu .active')
  const activePane = document.querySelector(
    '.product-tab__content .tab-pane.active',
  )

  if (!activeTab || !activePane) {
    console.log(
      '🔧 Product Tabs: Re-initializing due to missing active states...',
    )
    initProductTabs()
  } else {
    console.log('✅ Product Tabs: Already working properly')
  }
}, 1000)

// Export for external use
window.productTabs = {
  init: initProductTabs,
  switchTo: switchToTab,
  fallback: initFallbackTabs,
}

console.log('📦 Product Tabs component loaded')
