/**
 * Core Functional Programming Utilities
 * Pure functions for composition, transformation, and data manipulation
 */

// ============================================================================
// CORE FUNCTIONAL PRIMITIVES
// ============================================================================

/**
 * Identity function - returns its argument unchanged
 */
export const identity = (x) => x

/**
 * Constant function - returns a function that always returns the same value
 */
export const constant = (value) => () => value

/**
 * Compose functions from right to left
 * compose(f, g, h)(x) === f(g(h(x)))
 */
export const compose =
  (...fns) =>
  (value) =>
    fns.reduceRight((acc, fn) => fn(acc), value)

/**
 * Pipe functions from left to right
 * pipe(f, g, h)(x) === h(g(f(x)))
 */
export const pipe =
  (...fns) =>
  (value) =>
    fns.reduce((acc, fn) => fn(acc), value)

/**
 * Curry a function - convert f(a, b, c) to f(a)(b)(c)
 */
export const curry = (fn) => {
  const arity = fn.length
  return function curried(...args) {
    if (args.length >= arity) {
      return fn.apply(this, args)
    }
    return (...nextArgs) => curried.apply(this, [...args, ...nextArgs])
  }
}

/**
 * Partial application - fix some arguments of a function
 */
export const partial =
  (fn, ...args1) =>
  (...args2) =>
    fn(...args1, ...args2)

// ============================================================================
// ARRAY UTILITIES
// ============================================================================

/**
 * Functional map with currying support
 */
export const map = curry((fn, array) => array.map(fn))

/**
 * Functional filter with currying support
 */
export const filter = curry((predicate, array) => array.filter(predicate))

/**
 * Functional reduce with currying support
 */
export const reduce = curry((reducer, initial, array) =>
  array.reduce(reducer, initial),
)

/**
 * Find first element matching predicate
 */
export const find = curry((predicate, array) => array.find(predicate))

/**
 * Check if any element matches predicate
 */
export const some = curry((predicate, array) => array.some(predicate))

/**
 * Check if all elements match predicate
 */
export const every = curry((predicate, array) => array.every(predicate))

/**
 * Sort array by a key function
 */
export const sortBy = curry((keyFn, array) =>
  [...array].sort((a, b) => {
    const aKey = keyFn(a)
    const bKey = keyFn(b)
    if (aKey < bKey) return -1
    if (aKey > bKey) return 1
    return 0
  }),
)

/**
 * Group array elements by a key function
 */
export const groupBy = curry((keyFn, array) =>
  array.reduce((groups, item) => {
    const key = keyFn(item)
    return {
      ...groups,
      [key]: [...(groups[key] || []), item],
    }
  }, {}),
)

/**
 * Take first n elements from array
 */
export const take = curry((n, array) => array.slice(0, n))

/**
 * Skip first n elements from array
 */
export const skip = curry((n, array) => array.slice(n))

/**
 * Chunk array into smaller arrays of specified size
 */
export const chunk = curry((size, array) => {
  const chunks = []
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size))
  }
  return chunks
})

// ============================================================================
// OBJECT UTILITIES
// ============================================================================

/**
 * Get property from object
 */
export const prop = curry((key, obj) => obj?.[key])

/**
 * Get nested property from object using path
 */
export const path = curry((pathArray, obj) =>
  pathArray.reduce((current, key) => current?.[key], obj),
)

/**
 * Pick specified properties from object
 */
export const pick = curry((keys, obj) =>
  keys.reduce((result, key) => {
    if (key in obj) {
      result[key] = obj[key]
    }
    return result
  }, {}),
)

/**
 * Omit specified properties from object
 */
export const omit = curry((keys, obj) => {
  const keysSet = new Set(keys)
  return Object.keys(obj).reduce((result, key) => {
    if (!keysSet.has(key)) {
      result[key] = obj[key]
    }
    return result
  }, {})
})

/**
 * Map over object values
 */
export const mapValues = curry((fn, obj) =>
  Object.keys(obj).reduce((result, key) => {
    result[key] = fn(obj[key], key, obj)
    return result
  }, {}),
)

/**
 * Deep merge objects
 */
export const merge = (...objects) => {
  const isObject = (obj) =>
    obj && typeof obj === 'object' && !Array.isArray(obj)

  return objects.reduce((result, obj) => {
    Object.keys(obj).forEach((key) => {
      if (isObject(result[key]) && isObject(obj[key])) {
        result[key] = merge(result[key], obj[key])
      } else {
        result[key] = obj[key]
      }
    })
    return result
  }, {})
}

// ============================================================================
// PREDICATE UTILITIES
// ============================================================================

/**
 * Check if value is null or undefined
 */
export const isNil = (value) => value == null

/**
 * Check if value is not null or undefined
 */
export const isNotNil = (value) => value != null

/**
 * Check if value is empty (null, undefined, empty string, empty array, empty object)
 */
export const isEmpty = (value) => {
  if (isNil(value)) return true
  if (typeof value === 'string' || Array.isArray(value))
    return value.length === 0
  if (typeof value === 'object') return Object.keys(value).length === 0
  return false
}

/**
 * Check if value is not empty
 */
export const isNotEmpty = (value) => !isEmpty(value)

/**
 * Logical AND for predicates
 */
export const and = curry((pred1, pred2, value) => pred1(value) && pred2(value))

/**
 * Logical OR for predicates
 */
export const or = curry((pred1, pred2, value) => pred1(value) || pred2(value))

/**
 * Logical NOT for predicates
 */
export const not = (predicate) => (value) => !predicate(value)

// ============================================================================
// ASYNC UTILITIES
// ============================================================================

/**
 * Compose async functions
 */
export const composeAsync =
  (...fns) =>
  (value) =>
    fns.reduceRight((acc, fn) => acc.then(fn), Promise.resolve(value))

/**
 * Pipe async functions
 */
export const pipeAsync =
  (...fns) =>
  (value) =>
    fns.reduce((acc, fn) => acc.then(fn), Promise.resolve(value))

/**
 * Map over array with async function
 */
export const mapAsync = curry(async (fn, array) => Promise.all(array.map(fn)))

/**
 * Filter array with async predicate
 */
export const filterAsync = curry(async (predicate, array) => {
  const results = await Promise.all(array.map(predicate))
  return array.filter((_, index) => results[index])
})

/**
 * Retry async function with exponential backoff
 */
export const retry = curry((maxAttempts, delay, fn) => async (...args) => {
  let lastError

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn(...args)
    } catch (error) {
      lastError = error
      if (attempt === maxAttempts) break

      const backoffDelay = delay * Math.pow(2, attempt - 1)
      await new Promise((resolve) => setTimeout(resolve, backoffDelay))
    }
  }

  throw lastError
})

// ============================================================================
// MEMOIZATION
// ============================================================================

/**
 * Memoize function results
 */
export const memoize = (fn, keyFn = (...args) => JSON.stringify(args)) => {
  const cache = new Map()

  return (...args) => {
    const key = keyFn(...args)

    if (cache.has(key)) {
      return cache.get(key)
    }

    const result = fn(...args)
    cache.set(key, result)
    return result
  }
}

/**
 * Memoize with TTL (time to live)
 */
export const memoizeWithTTL = (
  fn,
  ttl = 300000,
  keyFn = (...args) => JSON.stringify(args),
) => {
  const cache = new Map()

  return (...args) => {
    const key = keyFn(...args)
    const cached = cache.get(key)

    if (cached && Date.now() - cached.timestamp < ttl) {
      return cached.value
    }

    const result = fn(...args)
    cache.set(key, { value: result, timestamp: Date.now() })
    return result
  }
}

// ============================================================================
// VALIDATION UTILITIES
// ============================================================================

/**
 * Create a validator function
 */
export const validator = (predicate, errorMessage) => (value) => {
  if (predicate(value)) {
    return { isValid: true, value }
  }
  return { isValid: false, error: errorMessage, value }
}

/**
 * Combine multiple validators
 */
export const validateAll =
  (...validators) =>
  (value) => {
    for (const validate of validators) {
      const result = validate(value)
      if (!result.isValid) {
        return result
      }
    }
    return { isValid: true, value }
  }

/**
 * Common validators
 */
export const validators = {
  required: validator(isNotNil, 'Value is required'),
  notEmpty: validator(isNotEmpty, 'Value cannot be empty'),
  isString: validator(
    (value) => typeof value === 'string',
    'Value must be a string',
  ),
  isNumber: validator(
    (value) => typeof value === 'number' && !isNaN(value),
    'Value must be a number',
  ),
  isArray: validator(Array.isArray, 'Value must be an array'),
  isObject: validator(
    (value) => value && typeof value === 'object' && !Array.isArray(value),
    'Value must be an object',
  ),
  minLength: (min) =>
    validator(
      (value) => value?.length >= min,
      `Value must be at least ${min} characters`,
    ),
  maxLength: (max) =>
    validator(
      (value) => value?.length <= max,
      `Value must be at most ${max} characters`,
    ),
  min: (min) =>
    validator((value) => value >= min, `Value must be at least ${min}`),
  max: (max) =>
    validator((value) => value <= max, `Value must be at most ${max}`),
}

// ============================================================================
// DEBUGGING UTILITIES
// ============================================================================

/**
 * Tap function for debugging - executes side effect and returns original value
 */
export const tap = curry((fn, value) => {
  fn(value)
  return value
})

/**
 * Trace function for debugging - logs value and returns it
 */
export const trace = curry((label, value) => {
  console.log(`${label}:`, value)
  return value
})

/**
 * Time function execution
 */
export const timeFunction =
  (label, fn) =>
  (...args) => {
    console.time(label)
    const result = fn(...args)
    console.timeEnd(label)
    return result
  }

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  // Core primitives
  identity,
  constant,
  compose,
  pipe,
  curry,
  partial,

  // Array utilities
  map,
  filter,
  reduce,
  find,
  some,
  every,
  sortBy,
  groupBy,
  take,
  skip,
  chunk,

  // Object utilities
  prop,
  path,
  pick,
  omit,
  mapValues,
  merge,

  // Predicates
  isNil,
  isNotNil,
  isEmpty,
  isNotEmpty,
  and,
  or,
  not,

  // Async utilities
  composeAsync,
  pipeAsync,
  mapAsync,
  filterAsync,
  retry,

  // Memoization
  memoize,
  memoizeWithTTL,

  // Validation
  validator,
  validateAll,
  validators,

  // Debugging
  tap,
  trace,
  timeFunction,
}
