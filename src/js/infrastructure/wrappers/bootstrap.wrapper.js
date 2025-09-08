/**
 * Functional Bootstrap Wrapper
 * Pure functional interface for Bootstrap components
 */

import {
  curry,
  pipe,
  compose,
  tap,
  isNil,
} from '../../core/functional.utils.js'

// ============================================================================
// BOOTSTRAP UTILITIES
// ============================================================================

/**
 * Check if Bootstrap is available
 */
export const isBootstrapAvailable = () => typeof bootstrap !== 'undefined'

/**
 * Get Bootstrap instance from element
 */
export const getInstance = curry((Component, element) => {
  if (!isBootstrapAvailable()) {
    console.warn('Bootstrap is not available')
    return null
  }

  const el =
    typeof element === 'string' ? document.querySelector(element) : element

  if (!el) {
    console.warn('Element not found for Bootstrap component')
    return null
  }

  return Component.getInstance(el)
})

/**
 * Get or create Bootstrap instance
 */
export const getOrCreateInstance = curry((Component, element, options = {}) => {
  if (!isBootstrapAvailable()) {
    console.warn('Bootstrap is not available')
    return null
  }

  const el =
    typeof element === 'string' ? document.querySelector(element) : element

  if (!el) {
    console.warn('Element not found for Bootstrap component')
    return null
  }

  return Component.getOrCreateInstance(el, options)
})

// ============================================================================
// MODAL UTILITIES
// ============================================================================

/**
 * Create modal instance
 */
export const createModal = curry((element, options = {}) => {
  if (!isBootstrapAvailable()) return null

  const el =
    typeof element === 'string' ? document.querySelector(element) : element

  if (!el) return null

  try {
    return new bootstrap.Modal(el, options)
  } catch (error) {
    console.error('Error creating modal:', error)
    return null
  }
})

/**
 * Show modal
 */
export const showModal = (elementOrInstance) => {
  if (elementOrInstance && typeof elementOrInstance.show === 'function') {
    // It's already a modal instance
    elementOrInstance.show()
    return elementOrInstance
  }

  // It's an element selector or element
  const modal = createModal(elementOrInstance)
  if (modal) {
    modal.show()
    return modal
  }

  return null
}

/**
 * Hide modal
 */
export const hideModal = (elementOrInstance) => {
  if (elementOrInstance && typeof elementOrInstance.hide === 'function') {
    // It's already a modal instance
    elementOrInstance.hide()
    return elementOrInstance
  }

  // It's an element selector or element
  const modal = getInstance(bootstrap.Modal, elementOrInstance)
  if (modal) {
    modal.hide()
    return modal
  }

  return null
}

/**
 * Toggle modal
 */
export const toggleModal = (elementOrInstance) => {
  if (elementOrInstance && typeof elementOrInstance.toggle === 'function') {
    // It's already a modal instance
    elementOrInstance.toggle()
    return elementOrInstance
  }

  // It's an element selector or element
  const modal = getOrCreateInstance(bootstrap.Modal, elementOrInstance)
  if (modal) {
    modal.toggle()
    return modal
  }

  return null
}

/**
 * Dispose modal
 */
export const disposeModal = (elementOrInstance) => {
  if (elementOrInstance && typeof elementOrInstance.dispose === 'function') {
    elementOrInstance.dispose()
    return true
  }

  const modal = getInstance(bootstrap.Modal, elementOrInstance)
  if (modal) {
    modal.dispose()
    return true
  }

  return false
}

// ============================================================================
// OFFCANVAS UTILITIES
// ============================================================================

/**
 * Create offcanvas instance
 */
export const createOffcanvas = curry((element, options = {}) => {
  if (!isBootstrapAvailable()) return null

  const el =
    typeof element === 'string' ? document.querySelector(element) : element

  if (!el) return null

  try {
    return new bootstrap.Offcanvas(el, options)
  } catch (error) {
    console.error('Error creating offcanvas:', error)
    return null
  }
})

/**
 * Show offcanvas
 */
export const showOffcanvas = (elementOrInstance) => {
  if (elementOrInstance && typeof elementOrInstance.show === 'function') {
    elementOrInstance.show()
    return elementOrInstance
  }

  const offcanvas = createOffcanvas(elementOrInstance)
  if (offcanvas) {
    offcanvas.show()
    return offcanvas
  }

  return null
}

/**
 * Hide offcanvas
 */
export const hideOffcanvas = (elementOrInstance) => {
  if (elementOrInstance && typeof elementOrInstance.hide === 'function') {
    elementOrInstance.hide()
    return elementOrInstance
  }

  const offcanvas = getInstance(bootstrap.Offcanvas, elementOrInstance)
  if (offcanvas) {
    offcanvas.hide()
    return offcanvas
  }

  return null
}

/**
 * Toggle offcanvas
 */
export const toggleOffcanvas = (elementOrInstance) => {
  if (elementOrInstance && typeof elementOrInstance.toggle === 'function') {
    elementOrInstance.toggle()
    return elementOrInstance
  }

  const offcanvas = getOrCreateInstance(bootstrap.Offcanvas, elementOrInstance)
  if (offcanvas) {
    offcanvas.toggle()
    return offcanvas
  }

  return null
}

// ============================================================================
// TOOLTIP UTILITIES
// ============================================================================

/**
 * Create tooltip instance
 */
export const createTooltip = curry((element, options = {}) => {
  if (!isBootstrapAvailable()) return null

  const el =
    typeof element === 'string' ? document.querySelector(element) : element

  if (!el) return null

  try {
    return new bootstrap.Tooltip(el, options)
  } catch (error) {
    console.error('Error creating tooltip:', error)
    return null
  }
})

/**
 * Initialize tooltips for selector
 */
export const initTooltips = (
  selector = '[data-bs-toggle="tooltip"]',
  options = {},
) => {
  if (!isBootstrapAvailable()) return []

  const elements = document.querySelectorAll(selector)
  const tooltips = []

  elements.forEach((element) => {
    const tooltip = createTooltip(element, options)
    if (tooltip) {
      tooltips.push(tooltip)
    }
  })

  console.log(`✅ Initialized ${tooltips.length} tooltips`)
  return tooltips
}

/**
 * Show tooltip
 */
export const showTooltip = (elementOrInstance) => {
  if (elementOrInstance && typeof elementOrInstance.show === 'function') {
    elementOrInstance.show()
    return elementOrInstance
  }

  const tooltip = getInstance(bootstrap.Tooltip, elementOrInstance)
  if (tooltip) {
    tooltip.show()
    return tooltip
  }

  return null
}

/**
 * Hide tooltip
 */
export const hideTooltip = (elementOrInstance) => {
  if (elementOrInstance && typeof elementOrInstance.hide === 'function') {
    elementOrInstance.hide()
    return elementOrInstance
  }

  const tooltip = getInstance(bootstrap.Tooltip, elementOrInstance)
  if (tooltip) {
    tooltip.hide()
    return tooltip
  }

  return null
}

/**
 * Dispose tooltip
 */
export const disposeTooltip = (elementOrInstance) => {
  if (elementOrInstance && typeof elementOrInstance.dispose === 'function') {
    elementOrInstance.dispose()
    return true
  }

  const tooltip = getInstance(bootstrap.Tooltip, elementOrInstance)
  if (tooltip) {
    tooltip.dispose()
    return true
  }

  return false
}

// ============================================================================
// POPOVER UTILITIES
// ============================================================================

/**
 * Create popover instance
 */
export const createPopover = curry((element, options = {}) => {
  if (!isBootstrapAvailable()) return null

  const el =
    typeof element === 'string' ? document.querySelector(element) : element

  if (!el) return null

  try {
    return new bootstrap.Popover(el, options)
  } catch (error) {
    console.error('Error creating popover:', error)
    return null
  }
})

/**
 * Initialize popovers for selector
 */
export const initPopovers = (
  selector = '[data-bs-toggle="popover"]',
  options = {},
) => {
  if (!isBootstrapAvailable()) return []

  const elements = document.querySelectorAll(selector)
  const popovers = []

  elements.forEach((element) => {
    const popover = createPopover(element, options)
    if (popover) {
      popovers.push(popover)
    }
  })

  console.log(`✅ Initialized ${popovers.length} popovers`)
  return popovers
}

// ============================================================================
// DROPDOWN UTILITIES
// ============================================================================

/**
 * Create dropdown instance
 */
export const createDropdown = curry((element, options = {}) => {
  if (!isBootstrapAvailable()) return null

  const el =
    typeof element === 'string' ? document.querySelector(element) : element

  if (!el) return null

  try {
    return new bootstrap.Dropdown(el, options)
  } catch (error) {
    console.error('Error creating dropdown:', error)
    return null
  }
})

/**
 * Show dropdown
 */
export const showDropdown = (elementOrInstance) => {
  if (elementOrInstance && typeof elementOrInstance.show === 'function') {
    elementOrInstance.show()
    return elementOrInstance
  }

  const dropdown = getInstance(bootstrap.Dropdown, elementOrInstance)
  if (dropdown) {
    dropdown.show()
    return dropdown
  }

  return null
}

/**
 * Hide dropdown
 */
export const hideDropdown = (elementOrInstance) => {
  if (elementOrInstance && typeof elementOrInstance.hide === 'function') {
    elementOrInstance.hide()
    return elementOrInstance
  }

  const dropdown = getInstance(bootstrap.Dropdown, elementOrInstance)
  if (dropdown) {
    dropdown.hide()
    return dropdown
  }

  return null
}

// ============================================================================
// COLLAPSE UTILITIES
// ============================================================================

/**
 * Create collapse instance
 */
export const createCollapse = curry((element, options = {}) => {
  if (!isBootstrapAvailable()) return null

  const el =
    typeof element === 'string' ? document.querySelector(element) : element

  if (!el) return null

  try {
    return new bootstrap.Collapse(el, options)
  } catch (error) {
    console.error('Error creating collapse:', error)
    return null
  }
})

/**
 * Show collapse
 */
export const showCollapse = (elementOrInstance) => {
  if (elementOrInstance && typeof elementOrInstance.show === 'function') {
    elementOrInstance.show()
    return elementOrInstance
  }

  const collapse = getInstance(bootstrap.Collapse, elementOrInstance)
  if (collapse) {
    collapse.show()
    return collapse
  }

  return null
}

/**
 * Hide collapse
 */
export const hideCollapse = (elementOrInstance) => {
  if (elementOrInstance && typeof elementOrInstance.hide === 'function') {
    elementOrInstance.hide()
    return elementOrInstance
  }

  const collapse = getInstance(bootstrap.Collapse, elementOrInstance)
  if (collapse) {
    collapse.hide()
    return collapse
  }

  return null
}

/**
 * Toggle collapse
 */
export const toggleCollapse = (elementOrInstance) => {
  if (elementOrInstance && typeof elementOrInstance.toggle === 'function') {
    elementOrInstance.toggle()
    return elementOrInstance
  }

  const collapse = getOrCreateInstance(bootstrap.Collapse, elementOrInstance)
  if (collapse) {
    collapse.toggle()
    return collapse
  }

  return null
}

// ============================================================================
// BOOTSTRAP MANAGER
// ============================================================================

/**
 * Create a Bootstrap component manager
 */
export const createBootstrapManager = () => {
  const components = new Map()

  return {
    // Register a component
    register: (name, component) => {
      if (component) {
        components.set(name, component)
        console.log(`📝 Bootstrap component registered: ${name}`)
      }
    },

    // Get a component by name
    get: (name) => components.get(name),

    // Check if component exists
    has: (name) => components.has(name),

    // Dispose a component
    dispose: (name) => {
      const component = components.get(name)
      if (component && typeof component.dispose === 'function') {
        component.dispose()
        components.delete(name)
        console.log(`🗑️ Bootstrap component disposed: ${name}`)
        return true
      }
      return false
    },

    // Dispose all components
    disposeAll: () => {
      let disposed = 0
      components.forEach((component, name) => {
        if (component && typeof component.dispose === 'function') {
          component.dispose()
          disposed++
        }
      })
      components.clear()
      console.log(`🗑️ All Bootstrap components disposed: ${disposed}`)
      return disposed
    },

    // List all component names
    list: () => Array.from(components.keys()),

    // Get component count
    count: () => components.size,
  }
}

// ============================================================================
// INITIALIZATION
// ============================================================================

/**
 * Initialize all Bootstrap components
 */
export const initializeBootstrapComponents = () => {
  if (!isBootstrapAvailable()) {
    console.warn('Bootstrap is not available')
    return null
  }

  const manager = createBootstrapManager()

  // Initialize tooltips
  const tooltips = initTooltips()
  tooltips.forEach((tooltip, index) => {
    manager.register(`tooltip-${index}`, tooltip)
  })

  // Initialize popovers
  const popovers = initPopovers()
  popovers.forEach((popover, index) => {
    manager.register(`popover-${index}`, popover)
  })

  // Make manager globally available
  window.bootstrapManager = manager

  console.log(`🅱️ Initialized ${manager.count()} Bootstrap components`)

  return manager
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  // Utilities
  isBootstrapAvailable,
  getInstance,
  getOrCreateInstance,

  // Modal
  createModal,
  showModal,
  hideModal,
  toggleModal,
  disposeModal,

  // Offcanvas
  createOffcanvas,
  showOffcanvas,
  hideOffcanvas,
  toggleOffcanvas,

  // Tooltip
  createTooltip,
  initTooltips,
  showTooltip,
  hideTooltip,
  disposeTooltip,

  // Popover
  createPopover,
  initPopovers,

  // Dropdown
  createDropdown,
  showDropdown,
  hideDropdown,

  // Collapse
  createCollapse,
  showCollapse,
  hideCollapse,
  toggleCollapse,

  // Manager
  createBootstrapManager,
  initializeBootstrapComponents,
}
