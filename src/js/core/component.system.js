/**
 * Functional Component System
 * Pure functional components with lifecycle management and effects
 */

import {
  curry,
  pipe,
  compose,
  memoize,
  tap,
  isNil,
  isNotNil,
  merge,
} from './functional.utils.js'
import {
  h,
  render,
  mount,
  update,
  Fragment,
  when,
  classNames,
} from './template.system.js'
import { createState } from './state.management.js'

// ============================================================================
// COMPONENT CREATION
// ============================================================================

/**
 * Create a functional component
 */
export const createComponent = (name, template, options = {}) => {
  const {
    effects = [],
    lifecycle = {},
    defaultProps = {},
    propTypes = {},
    memoize: shouldMemoize = false,
  } = options

  const componentFunction = (props = {}, context = {}) => {
    // Merge with default props
    const finalProps = { ...defaultProps, ...props }

    // Validate props if propTypes provided
    if (Object.keys(propTypes).length > 0) {
      validateProps(finalProps, propTypes, name)
    }

    // Create component state
    const componentState = createState(finalProps.initialState || {})

    // Component instance (extensible object)
    const instance = {
      name,
      props: finalProps,
      state: componentState,
      context,
    }

    // Add methods to instance
    instance.render = (container = null) => {
      lifecycle.beforeRender?.(finalProps, componentState.get(), context)

      const vdom = template(finalProps, componentState.get(), context)
      const element = container ? mount(vdom, container) : render(vdom)

      // Apply effects after render
      if (element && effects.length > 0) {
        const cleanupFunctions = effects
          .map((effect) => effect(element, finalProps, componentState, context))
          .filter(isNotNil)

        // Store cleanup functions for later
        instance._cleanup = cleanupFunctions
      }

      lifecycle.afterRender?.(
        element,
        finalProps,
        componentState.get(),
        context,
      )

      return element
    }

    // Update component with new props
    instance.update = (newProps = {}) => {
      const updatedProps = { ...finalProps, ...newProps }
      return createComponent(name, template, options)(updatedProps, context)
    }

    // Update component state
    instance.setState = (updater) => {
      componentState.update(updater)
      return instance
    }

    // Get current state
    instance.getState = () => componentState.get()

    // Subscribe to state changes
    instance.subscribe = (callback, selector) =>
      componentState.subscribe(callback, selector)

    // Mount component to DOM
    instance.mount = (container) => {
      lifecycle.beforeMount?.(finalProps, componentState.get(), context)
      const element = instance.render(container)
      lifecycle.afterMount?.(element, finalProps, componentState.get(), context)
      return element
    }

    // Unmount component
    instance.unmount = () => {
      lifecycle.beforeUnmount?.(finalProps, componentState.get(), context)

      // Run cleanup functions
      if (instance._cleanup) {
        instance._cleanup.forEach((cleanup) => {
          if (typeof cleanup === 'function') {
            cleanup()
          }
        })
      }

      componentState.destroy()
      lifecycle.afterUnmount?.(finalProps, context)
    }

    // Destroy component
    instance.destroy = () => {
      instance.unmount()
    }

    // Call lifecycle hook
    lifecycle.created?.(instance, finalProps, componentState.get(), context)

    return instance
  }

  // Add component metadata
  componentFunction.componentName = name
  componentFunction.isComponent = true

  // Apply memoization if requested
  if (shouldMemoize) {
    return memoize(componentFunction, (props, context) =>
      JSON.stringify({ props, context }),
    )
  }

  return componentFunction
}

// ============================================================================
// HIGHER-ORDER COMPONENTS
// ============================================================================

/**
 * Higher-order component for adding props
 */
export const withProps = curry(
  (additionalProps, Component) => (props, context) =>
    Component({ ...additionalProps, ...props }, context),
)

/**
 * Higher-order component for adding state
 */
export const withState = curry(
  (initialState, Component) => (props, context) =>
    Component(
      {
        ...props,
        initialState: { ...initialState, ...props.initialState },
      },
      context,
    ),
)

/**
 * Higher-order component for adding context
 */
export const withContext = curry(
  (contextProvider, Component) => (props, context) => {
    const enhancedContext = { ...context, ...contextProvider(props, context) }
    return Component(props, enhancedContext)
  },
)

/**
 * Higher-order component for conditional rendering
 */
export const withCondition = curry(
  (condition, Component, fallback = null) =>
    (props, context) => {
      if (condition(props, context)) {
        return Component(props, context)
      }
      return fallback ? fallback(props, context) : null
    },
)

/**
 * Higher-order component for error boundaries
 */
export const withErrorBoundary = curry(
  (ErrorComponent, Component) => (props, context) => {
    try {
      return Component(props, context)
    } catch (error) {
      console.error('Component error:', error)
      return ErrorComponent({ error, props, context })
    }
  },
)

// ============================================================================
// COMPONENT EFFECTS
// ============================================================================

/**
 * Effect for handling click events
 */
export const clickEffect = curry(
  (selector, handler) => (element, props, state, context) => {
    const targets = selector ? element.querySelectorAll(selector) : [element]

    const clickHandler = (event) => handler(event, props, state.get(), context)

    targets.forEach((target) => {
      target.addEventListener('click', clickHandler)
    })

    // Return cleanup function
    return () => {
      targets.forEach((target) => {
        target.removeEventListener('click', clickHandler)
      })
    }
  },
)

/**
 * Effect for handling form submissions
 */
export const submitEffect = curry(
  (selector, handler) => (element, props, state, context) => {
    const form = selector ? element.querySelector(selector) : element

    if (form && form.tagName === 'FORM') {
      const submitHandler = (event) => {
        event.preventDefault()
        const formData = new FormData(form)
        const data = Object.fromEntries(formData.entries())
        handler(data, event, props, state.get(), context)
      }

      form.addEventListener('submit', submitHandler)

      return () => form.removeEventListener('submit', submitHandler)
    }
  },
)

/**
 * Effect for handling input changes
 */
export const inputEffect = curry(
  (selector, handler) => (element, props, state, context) => {
    const inputs = selector ? element.querySelectorAll(selector) : [element]

    const changeHandler = (event) => {
      const { name, value, type, checked } = event.target
      const inputValue = type === 'checkbox' ? checked : value
      handler(name, inputValue, event, props, state.get(), context)
    }

    inputs.forEach((input) => {
      input.addEventListener('input', changeHandler)
      input.addEventListener('change', changeHandler)
    })

    return () => {
      inputs.forEach((input) => {
        input.removeEventListener('input', changeHandler)
        input.removeEventListener('change', changeHandler)
      })
    }
  },
)

/**
 * Effect for observing element visibility
 */
export const visibilityEffect = curry(
  (handler, options = {}) =>
    (element, props, state, context) => {
      if (!window.IntersectionObserver) return

      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          handler(entry.isIntersecting, entry, props, state.get(), context)
        })
      }, options)

      observer.observe(element)

      return () => observer.disconnect()
    },
)

/**
 * Effect for auto-focus
 */
export const focusEffect =
  (selector = null) =>
  (element, props, state, context) => {
    const target = selector ? element.querySelector(selector) : element

    if (target && target.focus) {
      // Use setTimeout to ensure element is in DOM
      setTimeout(() => target.focus(), 0)
    }
  }

// ============================================================================
// COMPONENT COMPOSITION
// ============================================================================

/**
 * Compose multiple components into one
 */
export const composeComponents =
  (...components) =>
  (props, context) => {
    const instances = components.map((Component) => Component(props, context))

    return {
      render: (container) => {
        const elements = instances.map((instance) => instance.render())
        const fragment = document.createDocumentFragment()
        elements.forEach((element) => {
          if (element) fragment.appendChild(element)
        })

        if (container) {
          container.appendChild(fragment)
        }

        return fragment
      },

      destroy: () => {
        instances.forEach((instance) => instance.destroy?.())
      },
    }
  }

/**
 * Create a component that renders children
 */
export const createContainer = (containerTemplate) =>
  createComponent('Container', (props, state, context) => {
    const { children = [], ...otherProps } = props

    return containerTemplate(otherProps, state, context, children)
  })

// ============================================================================
// COMPONENT UTILITIES
// ============================================================================

/**
 * Validate component props
 */
const validateProps = (props, propTypes, componentName) => {
  Object.entries(propTypes).forEach(([key, validator]) => {
    if (key in props) {
      const result = validator(props[key])
      if (!result.isValid) {
        console.warn(`[${componentName}] Invalid prop '${key}':`, result.error)
      }
    }
  })
}

/**
 * Create a component registry
 */
export const createComponentRegistry = () => {
  const registry = new Map()

  return {
    register: (name, component) => {
      registry.set(name, component)
    },

    get: (name) => registry.get(name),

    has: (name) => registry.has(name),

    unregister: (name) => registry.delete(name),

    list: () => Array.from(registry.keys()),

    clear: () => registry.clear(),
  }
}

/**
 * Create a component factory
 */
export const createComponentFactory = (registry) => (name, props, context) => {
  const Component = registry.get(name)

  if (!Component) {
    console.warn(`Component '${name}' not found in registry`)
    return null
  }

  return Component(props, context)
}

// ============================================================================
// COMMON COMPONENTS
// ============================================================================

/**
 * Button component
 */
export const Button = createComponent(
  'Button',
  (props, state, context) => {
    const {
      children,
      variant = 'primary',
      size = 'medium',
      disabled = false,
      loading = false,
      onClick,
      ...otherProps
    } = props

    return h(
      'button',
      {
        className: classNames('btn', `btn-${variant}`, `btn-${size}`, {
          'btn-loading': loading,
        }),
        disabled: disabled || loading,
        ...otherProps,
      },
      when(loading, h('span', { className: 'spinner' })),
      h('span', { className: 'btn-content' }, children),
    )
  },
  {
    effects: [
      clickEffect(null, (event, props) => {
        if (props.onClick && !props.disabled && !props.loading) {
          props.onClick(event)
        }
      }),
    ],
  },
)

/**
 * Input component
 */
export const Input = createComponent(
  'Input',
  (props, state, context) => {
    const {
      type = 'text',
      placeholder = '',
      value = '',
      error = null,
      label = null,
      required = false,
      ...otherProps
    } = props

    return Fragment(
      when(
        label,
        h(
          'label',
          { className: 'form-label' },
          label,
          when(required, h('span', { className: 'required' }, ' *')),
        ),
      ),
      h('input', {
        type,
        className: classNames('form-control', { 'is-invalid': error }),
        placeholder,
        value,
        required,
        ...otherProps,
      }),
      when(error, h('div', { className: 'invalid-feedback' }, error)),
    )
  },
  {
    effects: [
      inputEffect(null, (name, value, event, props) => {
        if (props.onChange) {
          props.onChange(value, event)
        }
      }),
    ],
  },
)

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  // Core component system
  createComponent,

  // Higher-order components
  withProps,
  withState,
  withContext,
  withCondition,
  withErrorBoundary,

  // Effects
  clickEffect,
  submitEffect,
  inputEffect,
  visibilityEffect,
  focusEffect,

  // Composition
  composeComponents,
  createContainer,

  // Utilities
  createComponentRegistry,
  createComponentFactory,

  // Common components
  Button,
  Input,
}
