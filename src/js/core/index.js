/**
 * Core Functional Infrastructure - Main Export
 * Unified entry point for all core functional utilities
 */

// Import all modules
import FunctionalUtils from './functional.utils.js'
import StateManagement from './state.management.js'
import TemplateSystem from './template.system.js'
import ComponentSystem from './component.system.js'
import EventSystem from './event.system.js'

// Re-export with specific names to avoid conflicts
export {
  // Functional utilities
  pipe,
  curry,
  compose as functionalCompose,
  map,
  filter,
  reduce,
  tap,
  trace,
  memoize,
  isNil,
  isNotNil,
  merge,
} from './functional.utils.js'

export {
  // State management
  createState,
  createStore,
  createComputed as stateCreateComputed,
  createEffect,
  combineStores,
  withPersistence,
  createActions,
  createAsyncActions,
  loggerMiddleware,
  thunkMiddleware,
  asyncMiddleware,
  validationMiddleware,
} from './state.management.js'

export {
  // Template system
  h,
  render,
  mount,
  update,
  Fragment,
  when,
  mapTemplate,
  classNames,
} from './template.system.js'

export {
  // Component system
  createComponent,
  withProps,
  withState,
  withContext,
  withCondition,
  withErrorBoundary,
  clickEffect,
  submitEffect,
  inputEffect,
  visibilityEffect,
  focusEffect,
  composeComponents,
  createContainer,
  createComponentRegistry,
  createComponentFactory,
  Button,
  Input,
} from './component.system.js'

export {
  // Event system
  createEventEmitter,
  createComputed as eventCreateComputed,
} from './event.system.js'

// Named exports
export {
  FunctionalUtils,
  StateManagement,
  TemplateSystem,
  ComponentSystem,
  EventSystem,
}

// ============================================================================
// UNIFIED CORE API
// ============================================================================

/**
 * Create the unified core API
 */
export const createCore = () => {
  return {
    // Functional utilities
    functional: FunctionalUtils,

    // State management
    state: StateManagement,

    // Template system
    template: TemplateSystem,

    // Component system
    component: ComponentSystem,

    // Event system
    event: EventSystem,

    // Version info
    version: '1.0.0',
    name: 'Time-Sphere Functional Core',
  }
}

// ============================================================================
// DEFAULT EXPORT
// ============================================================================

export default createCore()
