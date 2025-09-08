/**
 * Declarative Template System
 * Virtual DOM-like template rendering with functional composition
 */

import {
  curry,
  pipe,
  map,
  filter,
  isNil,
  isNotNil,
} from './functional.utils.js'

// ============================================================================
// VIRTUAL DOM PRIMITIVES
// ============================================================================

/**
 * Create a virtual DOM element
 */
export const h = (tag, props = {}, ...children) => ({
  type: 'element',
  tag,
  props: { ...props },
  children: children.flat().filter(isNotNil),
})

/**
 * Create a text node
 */
export const text = (content) => ({
  type: 'text',
  content: String(content),
})

/**
 * Create a fragment (container for multiple elements)
 */
export const Fragment = (...children) => ({
  type: 'fragment',
  children: children.flat().filter(isNotNil),
})

/**
 * Create a comment node
 */
export const comment = (content) => ({
  type: 'comment',
  content: String(content),
})

// ============================================================================
// CONDITIONAL RENDERING
// ============================================================================

/**
 * Conditional rendering - render template only if condition is true
 */
export const when = curry((condition, template) =>
  condition ? template : null,
)

/**
 * Conditional rendering with else clause
 */
export const ifElse = curry((condition, trueTemplate, falseTemplate) =>
  condition ? trueTemplate : falseTemplate,
)

/**
 * Switch-case style conditional rendering
 */
export const switchCase = (value, cases, defaultCase = null) => {
  return cases[value] || defaultCase
}

// ============================================================================
// LIST RENDERING
// ============================================================================

/**
 * Map over array and render template for each item
 */
export const mapTemplate = curry((template, items) =>
  items.map((item, index) => template(item, index)),
)

/**
 * Render template for each item with key support
 */
export const forEach = curry(
  (template, items, keyFn = (item, index) => index) =>
    items.map((item, index) => ({
      ...template(item, index),
      key: keyFn(item, index),
    })),
)

// ============================================================================
// SLOTS AND COMPOSITION
// ============================================================================

/**
 * Create a slot for content injection
 */
export const slot = (name, fallback = null) => ({
  type: 'slot',
  name,
  fallback,
})

/**
 * Fill slots with content
 */
export const withSlots = curry((slots, template) => {
  const fillSlots = (node) => {
    if (!node || typeof node !== 'object') return node

    if (node.type === 'slot') {
      return slots[node.name] || node.fallback
    }

    if (node.children) {
      return {
        ...node,
        children: node.children.map(fillSlots),
      }
    }

    return node
  }

  return fillSlots(template)
})

// ============================================================================
// TEMPLATE COMPOSITION
// ============================================================================

/**
 * Compose multiple templates into one
 */
export const compose =
  (...templates) =>
  (...args) =>
    Fragment(...templates.map((template) => template(...args)))

/**
 * Wrap template with another template
 */
export const wrap = curry(
  (wrapper, template) =>
    (...args) =>
      wrapper(template(...args), ...args),
)

/**
 * Apply higher-order template function
 */
export const withTemplate = curry((hoc, template) => hoc(template))

// ============================================================================
// ATTRIBUTE HELPERS
// ============================================================================

/**
 * Merge class names
 */
export const classNames = (...classes) => {
  return classes
    .flat()
    .filter(Boolean)
    .map((cls) => {
      if (typeof cls === 'string') return cls
      if (typeof cls === 'object') {
        return Object.keys(cls)
          .filter((key) => cls[key])
          .join(' ')
      }
      return ''
    })
    .join(' ')
    .trim()
}

/**
 * Merge styles
 */
export const styles = (...styleObjects) => {
  return Object.assign({}, ...styleObjects.filter(Boolean))
}

/**
 * Create data attributes
 */
export const dataAttrs = (obj) => {
  return Object.keys(obj).reduce((attrs, key) => {
    attrs[`data-${key}`] = obj[key]
    return attrs
  }, {})
}

// ============================================================================
// EVENT HANDLING
// ============================================================================

/**
 * Create event handler with automatic binding
 */
export const on = curry((event, handler, element) => {
  if (element && element.addEventListener) {
    element.addEventListener(event, handler)
    return () => element.removeEventListener(event, handler)
  }
  return () => {}
})

/**
 * Create delegated event handler
 */
export const delegate = curry((selector, event, handler, container) => {
  const delegatedHandler = (e) => {
    const target = e.target.closest(selector)
    if (target && container.contains(target)) {
      handler(e, target)
    }
  }

  container.addEventListener(event, delegatedHandler)
  return () => container.removeEventListener(event, delegatedHandler)
})

// ============================================================================
// TEMPLATE RENDERING
// ============================================================================

/**
 * Render virtual DOM to actual DOM elements
 */
export const render = (vdom, container = null) => {
  if (isNil(vdom)) return null

  // Handle arrays of elements
  if (Array.isArray(vdom)) {
    const fragment = document.createDocumentFragment()
    vdom.forEach((child) => {
      const element = render(child)
      if (element) fragment.appendChild(element)
    })
    return fragment
  }

  // Handle text content
  if (typeof vdom === 'string' || typeof vdom === 'number') {
    return document.createTextNode(String(vdom))
  }

  // Handle virtual DOM objects
  switch (vdom.type) {
    case 'text':
      return document.createTextNode(vdom.content)

    case 'comment':
      return document.createComment(vdom.content)

    case 'fragment':
      const fragment = document.createDocumentFragment()
      vdom.children.forEach((child) => {
        const element = render(child)
        if (element) fragment.appendChild(element)
      })
      return fragment

    case 'element':
      const element = document.createElement(vdom.tag)

      // Set properties and attributes
      Object.entries(vdom.props).forEach(([key, value]) => {
        if (key === 'className') {
          element.className = value
        } else if (key === 'style' && typeof value === 'object') {
          Object.assign(element.style, value)
        } else if (key.startsWith('on') && typeof value === 'function') {
          const event = key.slice(2).toLowerCase()
          element.addEventListener(event, value)
        } else if (
          key.startsWith('data-') ||
          key === 'id' ||
          key === 'title' ||
          key === 'alt'
        ) {
          element.setAttribute(key, value)
        } else {
          element[key] = value
        }
      })

      // Render children
      vdom.children.forEach((child) => {
        const childElement = render(child)
        if (childElement) element.appendChild(childElement)
      })

      return element

    default:
      console.warn('Unknown virtual DOM node type:', vdom.type)
      return null
  }
}

/**
 * Mount template to DOM container
 */
export const mount = curry((template, container, props = {}) => {
  const vdom = typeof template === 'function' ? template(props) : template
  const element = render(vdom)

  if (element && container) {
    container.innerHTML = ''
    container.appendChild(element)
  }

  return element
})

/**
 * Update existing DOM with new template
 */
export const update = curry((template, container, props = {}) => {
  const vdom = typeof template === 'function' ? template(props) : template
  const newElement = render(vdom)

  if (newElement && container && container.firstChild) {
    container.replaceChild(newElement, container.firstChild)
  } else if (newElement && container) {
    container.appendChild(newElement)
  }

  return newElement
})

// ============================================================================
// TEMPLATE UTILITIES
// ============================================================================

/**
 * Create a template component with props validation
 */
export const createTemplate = (templateFn, propTypes = {}) => {
  return (props = {}) => {
    // Validate props if propTypes provided
    if (Object.keys(propTypes).length > 0) {
      Object.entries(propTypes).forEach(([key, validator]) => {
        if (key in props) {
          const result = validator(props[key])
          if (!result.isValid) {
            console.warn(`Invalid prop '${key}':`, result.error)
          }
        }
      })
    }

    return templateFn(props)
  }
}

/**
 * Memoize template rendering
 */
export const memoTemplate = (
  template,
  keyFn = (props) => JSON.stringify(props),
) => {
  const cache = new Map()

  return (props) => {
    const key = keyFn(props)

    if (cache.has(key)) {
      return cache.get(key)
    }

    const result = template(props)
    cache.set(key, result)
    return result
  }
}

/**
 * Create template with default props
 */
export const withDefaults = curry(
  (defaults, template) =>
    (props = {}) =>
      template({ ...defaults, ...props }),
)

// ============================================================================
// COMMON TEMPLATES
// ============================================================================

/**
 * Loading spinner template
 */
export const LoadingSpinner = (props = {}) => {
  const { size = 'medium', color = 'primary', text = 'Loading...' } = props

  return h(
    'div',
    {
      className: classNames('loading-spinner', `spinner-${size}`),
    },
    h(
      'div',
      {
        className: classNames('spinner-border', `text-${color}`),
        role: 'status',
      },
      h('span', { className: 'visually-hidden' }, text),
    ),
    when(text, h('div', { className: 'loading-text' }, text)),
  )
}

/**
 * Error message template
 */
export const ErrorMessage = (props = {}) => {
  const {
    message = 'An error occurred',
    type = 'danger',
    dismissible = false,
    onDismiss = null,
  } = props

  return h(
    'div',
    {
      className: classNames('alert', `alert-${type}`, {
        'alert-dismissible': dismissible,
      }),
    },
    h('div', { className: 'error-content' }, message),
    when(
      dismissible && onDismiss,
      h('button', {
        type: 'button',
        className: 'btn-close',
        onClick: onDismiss,
        'aria-label': 'Close',
      }),
    ),
  )
}

/**
 * Empty state template
 */
export const EmptyState = (props = {}) => {
  const {
    icon = 'search',
    title = 'No items found',
    description = 'Try adjusting your search or filters',
    action = null,
  } = props

  return h(
    'div',
    { className: 'empty-state text-center' },
    h(
      'div',
      { className: 'empty-icon' },
      h('i', { className: `fas fa-${icon}` }),
    ),
    h('h4', { className: 'empty-title' }, title),
    when(description, h('p', { className: 'empty-description' }, description)),
    when(action, h('div', { className: 'empty-action' }, action)),
  )
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  // Core primitives
  h,
  text,
  Fragment,
  comment,

  // Conditional rendering
  when,
  ifElse,
  switchCase,

  // List rendering
  mapTemplate,
  forEach,

  // Slots and composition
  slot,
  withSlots,
  compose,
  wrap,
  withTemplate,

  // Attribute helpers
  classNames,
  styles,
  dataAttrs,

  // Event handling
  on,
  delegate,

  // Rendering
  render,
  mount,
  update,

  // Template utilities
  createTemplate,
  memoTemplate,
  withDefaults,

  // Common templates
  LoadingSpinner,
  ErrorMessage,
  EmptyState,
}
