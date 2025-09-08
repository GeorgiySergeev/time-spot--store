/**
 * Functional State Management System
 * Immutable state containers with reactive updates
 */

import { pipe, curry, tap, trace } from './functional.utils.js'

// ============================================================================
// CORE STATE CONTAINER
// ============================================================================

/**
 * Create an immutable state container with reactive updates
 */
export const createState = (initialState = {}) => {
  let state = Object.freeze({ ...initialState })
  const subscribers = new Set()
  const middleware = []

  // Internal state update function
  const updateState = (newState) => {
    if (newState !== state) {
      const previousState = state
      state = Object.freeze(newState)
      notifySubscribers(state, previousState)
    }
    return state
  }

  // Notify all subscribers of state changes
  const notifySubscribers = (currentState, previousState) => {
    subscribers.forEach(({ selector, callback, lastValue }) => {
      const currentValue = selector ? selector(currentState) : currentState
      if (currentValue !== lastValue) {
        // Update stored last value
        const subscriber = [...subscribers].find((s) => s.callback === callback)
        if (subscriber) {
          subscriber.lastValue = currentValue
        }
        callback(currentValue, currentState, previousState)
      }
    })
  }

  return {
    // Get current state
    get: () => state,

    // Update state with a function
    update: (updater) => {
      const newState =
        typeof updater === 'function'
          ? updater(state)
          : { ...state, ...updater }
      return updateState(newState)
    },

    // Set state directly (replaces entire state)
    set: (newState) => updateState(newState),

    // Subscribe to state changes
    subscribe: (callback, selector = null) => {
      const subscription = {
        callback,
        selector,
        lastValue: selector ? selector(state) : state,
      }

      subscribers.add(subscription)

      // Return unsubscribe function
      return () => subscribers.delete(subscription)
    },

    // Add middleware for state updates
    addMiddleware: (middlewareFn) => {
      middleware.push(middlewareFn)
    },

    // Reset state to initial value
    reset: () => updateState({ ...initialState }),

    // Destroy state container
    destroy: () => {
      subscribers.clear()
      middleware.length = 0
    },
  }
}

// ============================================================================
// STORE WITH REDUCERS
// ============================================================================

/**
 * Create a store with reducer-based state management
 */
export const createStore = (initialState, reducers = {}) => {
  const state = createState(initialState)
  const actionHistory = []
  const middleware = []

  // Dispatch an action through reducers
  const dispatch = (action) => {
    // Apply middleware to action
    const finalAction = middleware.reduce(
      (acc, mw) => mw(acc, state.get(), dispatch),
      action,
    )

    // Find and apply reducer
    const reducer = reducers[finalAction.type]
    if (reducer) {
      const currentState = state.get()
      const newState = reducer(currentState, finalAction)

      // Only update if state actually changed
      if (newState !== currentState) {
        state.set(newState)

        // Store action in history (for debugging/time travel)
        actionHistory.push({
          action: finalAction,
          timestamp: Date.now(),
          previousState: currentState,
          newState,
        })
      }
    } else {
      console.warn(`No reducer found for action type: ${finalAction.type}`)
    }

    return finalAction
  }

  return {
    // Get current state
    getState: state.get,

    // Dispatch action
    dispatch,

    // Subscribe to state changes
    subscribe: state.subscribe,

    // Add middleware
    addMiddleware: (mw) => middleware.push(mw),

    // Get action history
    getHistory: () => [...actionHistory],

    // Reset store
    reset: () => {
      state.reset()
      actionHistory.length = 0
    },

    // Destroy store
    destroy: state.destroy,
  }
}

// ============================================================================
// COMMON MIDDLEWARE
// ============================================================================

/**
 * Logger middleware - logs all actions and state changes
 */
export const loggerMiddleware = (action, state, dispatch) => {
  console.group(`Action: ${action.type}`)
  console.log('Previous State:', state)
  console.log('Action:', action)

  const result = action

  // Log new state after action is processed
  setTimeout(() => {
    console.log('New State:', state)
    console.groupEnd()
  }, 0)

  return result
}

/**
 * Thunk middleware - allows dispatching functions
 */
export const thunkMiddleware = (action, state, dispatch) => {
  if (typeof action === 'function') {
    return action(dispatch, state)
  }
  return action
}

/**
 * Async middleware - handles promises in actions
 */
export const asyncMiddleware = (action, state, dispatch) => {
  if (action && typeof action.then === 'function') {
    return action.then(dispatch)
  }
  return action
}

/**
 * Validation middleware - validates actions before processing
 */
export const validationMiddleware =
  (validators = {}) =>
  (action, state, dispatch) => {
    const validator = validators[action.type]
    if (validator) {
      const validation = validator(action, state)
      if (!validation.isValid) {
        console.error(
          `Action validation failed for ${action.type}:`,
          validation.error,
        )
        return action
      }
    }
    return action
  }

// ============================================================================
// COMPUTED VALUES
// ============================================================================

/**
 * Create computed values that automatically update when dependencies change
 */
export const createComputed = (store, selector, dependencies = []) => {
  let cachedValue
  let isInitialized = false
  const computedSubscribers = new Set()

  // Subscribe to store changes
  const unsubscribe = store.subscribe((state) => {
    const newValue = selector(state)

    if (!isInitialized || newValue !== cachedValue) {
      cachedValue = newValue
      isInitialized = true

      // Notify computed subscribers
      computedSubscribers.forEach((callback) => callback(newValue))
    }
  })

  return {
    // Get current computed value
    get: () => {
      if (!isInitialized) {
        cachedValue = selector(store.getState())
        isInitialized = true
      }
      return cachedValue
    },

    // Subscribe to computed value changes
    subscribe: (callback) => {
      computedSubscribers.add(callback)
      return () => computedSubscribers.delete(callback)
    },

    // Destroy computed value
    destroy: () => {
      unsubscribe()
      computedSubscribers.clear()
    },
  }
}

// ============================================================================
// REACTIVE EFFECTS
// ============================================================================

/**
 * Create reactive effects that run when dependencies change
 */
export const createEffect = (store, effectFn, dependencies = []) => {
  let cleanup = null
  let isInitialized = false

  const runEffect = (state) => {
    // Run cleanup from previous effect
    if (cleanup && typeof cleanup === 'function') {
      cleanup()
    }

    // Run the effect
    cleanup = effectFn(state) || null
  }

  // Subscribe to store changes
  const unsubscribe = store.subscribe((state) => {
    if (!isInitialized) {
      runEffect(state)
      isInitialized = true
    } else {
      // Check if dependencies changed
      const shouldRun =
        dependencies.length === 0 || dependencies.some((dep) => dep(state))

      if (shouldRun) {
        runEffect(state)
      }
    }
  })

  // Run initial effect
  if (!isInitialized) {
    runEffect(store.getState())
    isInitialized = true
  }

  return {
    // Destroy effect
    destroy: () => {
      if (cleanup && typeof cleanup === 'function') {
        cleanup()
      }
      unsubscribe()
    },
  }
}

// ============================================================================
// STORE COMPOSITION
// ============================================================================

/**
 * Combine multiple stores into one
 */
export const combineStores = (stores) => {
  const combinedState = createState(
    Object.keys(stores).reduce((acc, key) => {
      acc[key] = stores[key].getState()
      return acc
    }, {}),
  )

  // Subscribe to all individual stores
  const unsubscribers = Object.keys(stores).map((key) =>
    stores[key].subscribe((storeState) => {
      combinedState.update((state) => ({
        ...state,
        [key]: storeState,
      }))
    }),
  )

  return {
    getState: combinedState.get,
    subscribe: combinedState.subscribe,

    // Get individual store
    getStore: (key) => stores[key],

    // Destroy combined store
    destroy: () => {
      unsubscribers.forEach((unsub) => unsub())
      combinedState.destroy()
    },
  }
}

// ============================================================================
// PERSISTENCE
// ============================================================================

/**
 * Add persistence to a store using localStorage
 */
export const withPersistence = (store, key, options = {}) => {
  const {
    serialize = JSON.stringify,
    deserialize = JSON.parse,
    debounceMs = 300,
  } = options

  // Load initial state from localStorage
  try {
    const saved = localStorage.getItem(key)
    if (saved) {
      const parsedState = deserialize(saved)
      store.dispatch({ type: '@@HYDRATE', payload: parsedState })
    }
  } catch (error) {
    console.warn('Failed to load persisted state:', error)
  }

  // Debounced save function
  let saveTimeout
  const debouncedSave = (state) => {
    clearTimeout(saveTimeout)
    saveTimeout = setTimeout(() => {
      try {
        localStorage.setItem(key, serialize(state))
      } catch (error) {
        console.warn('Failed to persist state:', error)
      }
    }, debounceMs)
  }

  // Subscribe to state changes
  const unsubscribe = store.subscribe(debouncedSave)

  return {
    ...store,
    destroy: () => {
      clearTimeout(saveTimeout)
      unsubscribe()
      store.destroy?.()
    },
  }
}

// ============================================================================
// UTILITIES
// ============================================================================

/**
 * Create action creators
 */
export const createActions = (actionTypes) => {
  return Object.keys(actionTypes).reduce((actions, key) => {
    const type = actionTypes[key]
    actions[key] = (payload) => ({ type, payload })
    return actions
  }, {})
}

/**
 * Create async action creators
 */
export const createAsyncActions = (actionTypes) => {
  return Object.keys(actionTypes).reduce((actions, key) => {
    const baseType = actionTypes[key]

    actions[key] = (asyncFn) => async (dispatch, getState) => {
      dispatch({ type: `${baseType}_START` })

      try {
        const result = await asyncFn(dispatch, getState)
        dispatch({ type: `${baseType}_SUCCESS`, payload: result })
        return result
      } catch (error) {
        dispatch({ type: `${baseType}_ERROR`, payload: error })
        throw error
      }
    }

    return actions
  }, {})
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  createState,
  createStore,
  createComputed,
  createEffect,
  combineStores,
  withPersistence,
  createActions,
  createAsyncActions,

  // Middleware
  loggerMiddleware,
  thunkMiddleware,
  asyncMiddleware,
  validationMiddleware,
}
