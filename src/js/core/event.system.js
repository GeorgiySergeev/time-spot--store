/**
 * Functional Event System
 * Reactive event streams and functional event handling
 */

import {
  curry,
  pipe,
  compose,
  filter,
  map,
  reduce,
  tap,
  isNil,
  isNotNil,
} from './functional.utils.js'

// ============================================================================
// EVENT EMITTER
// ============================================================================

/**
 * Create a functional event emitter
 */
export const createEventEmitter = () => {
  const listeners = new Map()
  const onceListeners = new Map()

  return {
    // Emit an event
    emit: (event, ...args) => {
      // Call regular listeners
      const eventListeners = listeners.get(event) || []
      eventListeners.forEach((listener) => {
        try {
          listener(...args)
        } catch (error) {
          console.error(`Error in event listener for '${event}':`, error)
        }
      })

      // Call and remove once listeners
      const onceEventListeners = onceListeners.get(event) || []
      if (onceEventListeners.length > 0) {
        onceEventListeners.forEach((listener) => {
          try {
            listener(...args)
          } catch (error) {
            console.error(`Error in once listener for '${event}':`, error)
          }
        })
        onceListeners.delete(event)
      }

      return true
    },

    // Add event listener
    on: (event, listener) => {
      if (!listeners.has(event)) {
        listeners.set(event, [])
      }
      listeners.get(event).push(listener)

      // Return unsubscribe function
      return () => {
        const eventListeners = listeners.get(event) || []
        const index = eventListeners.indexOf(listener)
        if (index > -1) {
          eventListeners.splice(index, 1)
        }
      }
    },

    // Add one-time event listener
    once: (event, listener) => {
      if (!onceListeners.has(event)) {
        onceListeners.set(event, [])
      }
      onceListeners.get(event).push(listener)

      // Return unsubscribe function
      return () => {
        const eventListeners = onceListeners.get(event) || []
        const index = eventListeners.indexOf(listener)
        if (index > -1) {
          eventListeners.splice(index, 1)
        }
      }
    },

    // Remove event listener
    off: (event, listener) => {
      if (listener) {
        // Remove specific listener
        const eventListeners = listeners.get(event) || []
        const index = eventListeners.indexOf(listener)
        if (index > -1) {
          eventListeners.splice(index, 1)
        }
      } else {
        // Remove all listeners for event
        listeners.delete(event)
        onceListeners.delete(event)
      }
    },

    // Remove all listeners
    removeAllListeners: () => {
      listeners.clear()
      onceListeners.clear()
    },

    // Get listener count for event
    listenerCount: (event) => {
      const regular = listeners.get(event)?.length || 0
      const once = onceListeners.get(event)?.length || 0
      return regular + once
    },

    // Get all event names
    eventNames: () => {
      const regularEvents = Array.from(listeners.keys())
      const onceEvents = Array.from(onceListeners.keys())
      return [...new Set([...regularEvents, ...onceEvents])]
    },
  }
}

// ============================================================================
// EVENT STREAMS
// ============================================================================

/**
 * Create an event stream
 */
export const createEventStream = (emitter, eventName) => {
  const subscribers = new Set()
  let isActive = true

  // Subscribe to the emitter
  const unsubscribe = emitter.on(eventName, (...args) => {
    if (isActive) {
      subscribers.forEach((subscriber) => {
        try {
          subscriber(...args)
        } catch (error) {
          console.error('Error in stream subscriber:', error)
        }
      })
    }
  })

  const stream = {
    // Subscribe to stream
    subscribe: (callback) => {
      subscribers.add(callback)
      return () => subscribers.delete(callback)
    },

    // Map stream values
    map: (mapper) => {
      const mappedStream = createEventStream(createEventEmitter(), 'mapped')

      stream.subscribe((...args) => {
        try {
          const mapped = mapper(...args)
          mappedStream.emit('mapped', mapped)
        } catch (error) {
          console.error('Error in stream map:', error)
        }
      })

      return mappedStream
    },

    // Filter stream values
    filter: (predicate) => {
      const filteredStream = createEventStream(createEventEmitter(), 'filtered')

      stream.subscribe((...args) => {
        try {
          if (predicate(...args)) {
            filteredStream.emit('filtered', ...args)
          }
        } catch (error) {
          console.error('Error in stream filter:', error)
        }
      })

      return filteredStream
    },

    // Take only first n events
    take: (count) => {
      const takenStream = createEventStream(createEventEmitter(), 'taken')
      let taken = 0

      const unsub = stream.subscribe((...args) => {
        if (taken < count) {
          taken++
          takenStream.emit('taken', ...args)

          if (taken >= count) {
            unsub()
            takenStream.complete()
          }
        }
      })

      return takenStream
    },

    // Skip first n events
    skip: (count) => {
      const skippedStream = createEventStream(createEventEmitter(), 'skipped')
      let skipped = 0

      stream.subscribe((...args) => {
        if (skipped >= count) {
          skippedStream.emit('skipped', ...args)
        } else {
          skipped++
        }
      })

      return skippedStream
    },

    // Debounce events
    debounce: (delay) => {
      const debouncedStream = createEventStream(
        createEventEmitter(),
        'debounced',
      )
      let timeoutId = null

      stream.subscribe((...args) => {
        clearTimeout(timeoutId)
        timeoutId = setTimeout(() => {
          debouncedStream.emit('debounced', ...args)
        }, delay)
      })

      return debouncedStream
    },

    // Throttle events
    throttle: (delay) => {
      const throttledStream = createEventStream(
        createEventEmitter(),
        'throttled',
      )
      let lastEmit = 0

      stream.subscribe((...args) => {
        const now = Date.now()
        if (now - lastEmit >= delay) {
          lastEmit = now
          throttledStream.emit('throttled', ...args)
        }
      })

      return throttledStream
    },

    // Combine with another stream
    combineWith: (otherStream) => {
      const combinedStream = createEventStream(createEventEmitter(), 'combined')
      let lastValue1 = null
      let lastValue2 = null
      let hasValue1 = false
      let hasValue2 = false

      stream.subscribe((...args) => {
        lastValue1 = args
        hasValue1 = true
        if (hasValue2) {
          combinedStream.emit('combined', lastValue1, lastValue2)
        }
      })

      otherStream.subscribe((...args) => {
        lastValue2 = args
        hasValue2 = true
        if (hasValue1) {
          combinedStream.emit('combined', lastValue1, lastValue2)
        }
      })

      return combinedStream
    },

    // Emit event manually
    emit: (eventName, ...args) => {
      emitter.emit(eventName, ...args)
    },

    // Complete the stream
    complete: () => {
      isActive = false
      unsubscribe()
      subscribers.clear()
    },

    // Check if stream is active
    isActive: () => isActive,
  }

  return stream
}

// ============================================================================
// DOM EVENT UTILITIES
// ============================================================================

/**
 * Create event stream from DOM element
 */
export const fromDOMEvent = curry((element, eventType, options = {}) => {
  const emitter = createEventEmitter()

  const handler = (event) => {
    emitter.emit('dom-event', event)
  }

  element.addEventListener(eventType, handler, options)

  const stream = createEventStream(emitter, 'dom-event')

  // Override complete to remove DOM listener
  const originalComplete = stream.complete
  stream.complete = () => {
    element.removeEventListener(eventType, handler, options)
    originalComplete()
  }

  return stream
})

/**
 * Create event stream from multiple DOM elements
 */
export const fromDOMEvents = curry((elements, eventType, options = {}) => {
  const emitter = createEventEmitter()
  const handlers = []

  elements.forEach((element, index) => {
    const handler = (event) => {
      emitter.emit('dom-events', event, element, index)
    }

    element.addEventListener(eventType, handler, options)
    handlers.push({ element, handler })
  })

  const stream = createEventStream(emitter, 'dom-events')

  // Override complete to remove all DOM listeners
  const originalComplete = stream.complete
  stream.complete = () => {
    handlers.forEach(({ element, handler }) => {
      element.removeEventListener(eventType, handler, options)
    })
    originalComplete()
  }

  return stream
})

/**
 * Create delegated event stream
 */
export const fromDelegatedEvent = curry(
  (container, selector, eventType, options = {}) => {
    const emitter = createEventEmitter()

    const handler = (event) => {
      const target = event.target.closest(selector)
      if (target && container.contains(target)) {
        emitter.emit('delegated-event', event, target)
      }
    }

    container.addEventListener(eventType, handler, options)

    const stream = createEventStream(emitter, 'delegated-event')

    // Override complete to remove DOM listener
    const originalComplete = stream.complete
    stream.complete = () => {
      container.removeEventListener(eventType, handler, options)
      originalComplete()
    }

    return stream
  },
)

// ============================================================================
// REACTIVE UTILITIES
// ============================================================================

/**
 * Create a reactive value that emits when changed
 */
export const createReactiveValue = (initialValue) => {
  const emitter = createEventEmitter()
  let currentValue = initialValue

  return {
    // Get current value
    get: () => currentValue,

    // Set new value
    set: (newValue) => {
      if (newValue !== currentValue) {
        const oldValue = currentValue
        currentValue = newValue
        emitter.emit('change', newValue, oldValue)
      }
    },

    // Update value with function
    update: (updater) => {
      const newValue = updater(currentValue)
      if (newValue !== currentValue) {
        const oldValue = currentValue
        currentValue = newValue
        emitter.emit('change', newValue, oldValue)
      }
    },

    // Subscribe to changes
    subscribe: (callback) => emitter.on('change', callback),

    // Create stream of changes
    stream: () => createEventStream(emitter, 'change'),

    // Destroy reactive value
    destroy: () => emitter.removeAllListeners(),
  }
}

/**
 * Create computed reactive value
 */
export const createComputed = (dependencies, computeFn) => {
  const emitter = createEventEmitter()
  let currentValue = computeFn(...dependencies.map((dep) => dep.get()))

  // Subscribe to all dependencies
  const unsubscribers = dependencies.map((dep) =>
    dep.subscribe(() => {
      const newValue = computeFn(...dependencies.map((d) => d.get()))
      if (newValue !== currentValue) {
        const oldValue = currentValue
        currentValue = newValue
        emitter.emit('change', newValue, oldValue)
      }
    }),
  )

  return {
    get: () => currentValue,
    subscribe: (callback) => emitter.on('change', callback),
    stream: () => createEventStream(emitter, 'change'),
    destroy: () => {
      unsubscribers.forEach((unsub) => unsub())
      emitter.removeAllListeners()
    },
  }
}

// ============================================================================
// EVENT COMPOSITION
// ============================================================================

/**
 * Merge multiple event streams
 */
export const mergeStreams = (...streams) => {
  const emitter = createEventEmitter()
  const mergedStream = createEventStream(emitter, 'merged')

  const unsubscribers = streams.map((stream) =>
    stream.subscribe((...args) => {
      emitter.emit('merged', ...args)
    }),
  )

  // Override complete to unsubscribe from all streams
  const originalComplete = mergedStream.complete
  mergedStream.complete = () => {
    unsubscribers.forEach((unsub) => unsub())
    originalComplete()
  }

  return mergedStream
}

/**
 * Create event stream from Promise
 */
export const fromPromise = (promise) => {
  const emitter = createEventEmitter()
  const stream = createEventStream(emitter, 'promise')

  promise
    .then((result) => {
      emitter.emit('promise', { type: 'success', data: result })
      stream.complete()
    })
    .catch((error) => {
      emitter.emit('promise', { type: 'error', error })
      stream.complete()
    })

  return stream
}

/**
 * Create event stream from interval
 */
export const fromInterval = (interval) => {
  const emitter = createEventEmitter()
  const stream = createEventStream(emitter, 'interval')

  let count = 0
  const intervalId = setInterval(() => {
    emitter.emit('interval', count++)
  }, interval)

  // Override complete to clear interval
  const originalComplete = stream.complete
  stream.complete = () => {
    clearInterval(intervalId)
    originalComplete()
  }

  return stream
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  // Core event system
  createEventEmitter,
  createEventStream,

  // DOM events
  fromDOMEvent,
  fromDOMEvents,
  fromDelegatedEvent,

  // Reactive values
  createReactiveValue,
  createComputed,

  // Event composition
  mergeStreams,
  fromPromise,
  fromInterval,
}
