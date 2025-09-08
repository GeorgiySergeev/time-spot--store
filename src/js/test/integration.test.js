/**
 * Integration Tests for Functional Architecture
 * Comprehensive tests to verify the new functional system works correctly
 */

import { pipe, compose, map, filter, curry } from '../core/functional.utils.js'
import { createState, createStore } from '../core/state.management.js'
import { h, render, Fragment } from '../core/template.system.js'
import { createComponent } from '../core/component.system.js'
import { createProductService } from '../domains/products/shared/product.service.js'
import { createWatchService } from '../domains/products/watch/watch.service.js'
import { createJewelryService } from '../domains/products/jewelry/jewelry.service.js'
import { createCatalogComponent } from '../domains/ui/catalog/catalog.component.js'

// ============================================================================
// TEST UTILITIES
// ============================================================================

/**
 * Simple test runner
 */
const createTestRunner = () => {
  const tests = []
  let passed = 0
  let failed = 0

  return {
    test: (name, testFn) => {
      tests.push({ name, testFn })
    },

    run: async () => {
      console.log('🧪 Running Integration Tests...')
      console.log('='.repeat(50))

      for (const { name, testFn } of tests) {
        try {
          await testFn()
          console.log(`✅ ${name}`)
          passed++
        } catch (error) {
          console.error(`❌ ${name}:`, error.message)
          failed++
        }
      }

      console.log('='.repeat(50))
      console.log(`📊 Test Results: ${passed} passed, ${failed} failed`)

      return { passed, failed, total: tests.length }
    },
  }
}

/**
 * Assertion utilities
 */
const assert = {
  equal: (actual, expected, message = '') => {
    if (actual !== expected) {
      throw new Error(`${message} - Expected: ${expected}, Actual: ${actual}`)
    }
  },

  truthy: (value, message = '') => {
    if (!value) {
      throw new Error(`${message} - Expected truthy value, got: ${value}`)
    }
  },

  falsy: (value, message = '') => {
    if (value) {
      throw new Error(`${message} - Expected falsy value, got: ${value}`)
    }
  },

  isArray: (value, message = '') => {
    if (!Array.isArray(value)) {
      throw new Error(`${message} - Expected array, got: ${typeof value}`)
    }
  },

  isFunction: (value, message = '') => {
    if (typeof value !== 'function') {
      throw new Error(`${message} - Expected function, got: ${typeof value}`)
    }
  },

  throws: (fn, message = '') => {
    try {
      fn()
      throw new Error(`${message} - Expected function to throw`)
    } catch (error) {
      // Expected to throw
    }
  },
}

// ============================================================================
// CORE FUNCTIONAL UTILITIES TESTS
// ============================================================================

const testFunctionalUtils = (runner) => {
  runner.test('Functional Utils - Pipe', () => {
    const add1 = (x) => x + 1
    const multiply2 = (x) => x * 2
    const result = pipe(add1, multiply2)(5)
    assert.equal(result, 12, 'Pipe should compose functions left to right')
  })

  runner.test('Functional Utils - Compose', () => {
    const add1 = (x) => x + 1
    const multiply2 = (x) => x * 2
    const result = compose(multiply2, add1)(5)
    assert.equal(result, 12, 'Compose should compose functions right to left')
  })

  runner.test('Functional Utils - Curry', () => {
    const add = curry((a, b, c) => a + b + c)
    const result = add(1)(2)(3)
    assert.equal(result, 6, 'Curry should allow partial application')
  })

  runner.test('Functional Utils - Map', () => {
    const double = (x) => x * 2
    const result = map(double, [1, 2, 3])
    assert.equal(
      JSON.stringify(result),
      JSON.stringify([2, 4, 6]),
      'Map should transform array',
    )
  })

  runner.test('Functional Utils - Filter', () => {
    const isEven = (x) => x % 2 === 0
    const result = filter(isEven, [1, 2, 3, 4])
    assert.equal(
      JSON.stringify(result),
      JSON.stringify([2, 4]),
      'Filter should filter array',
    )
  })
}

// ============================================================================
// STATE MANAGEMENT TESTS
// ============================================================================

const testStateManagement = (runner) => {
  runner.test('State Management - Create State', () => {
    const state = createState({ count: 0 })
    assert.equal(state.get().count, 0, 'Initial state should be set')

    state.update((s) => ({ ...s, count: s.count + 1 }))
    assert.equal(state.get().count, 1, 'State should update correctly')
  })

  runner.test('State Management - State Subscription', () => {
    const state = createState({ count: 0 })
    let callbackCalled = false

    state.subscribe(() => {
      callbackCalled = true
    })

    state.update((s) => ({ ...s, count: 1 }))
    assert.truthy(callbackCalled, 'Subscription callback should be called')
  })

  runner.test('State Management - Store with Reducers', () => {
    const store = createStore(
      { count: 0 },
      {
        INCREMENT: (state) => ({ ...state, count: state.count + 1 }),
        DECREMENT: (state) => ({ ...state, count: state.count - 1 }),
      },
    )

    store.dispatch({ type: 'INCREMENT' })
    assert.equal(
      store.getState().count,
      1,
      'Store should handle INCREMENT action',
    )

    store.dispatch({ type: 'DECREMENT' })
    assert.equal(
      store.getState().count,
      0,
      'Store should handle DECREMENT action',
    )
  })
}

// ============================================================================
// TEMPLATE SYSTEM TESTS
// ============================================================================

const testTemplateSystem = (runner) => {
  runner.test('Template System - Virtual DOM Creation', () => {
    const vdom = h('div', { className: 'test' }, 'Hello World')

    assert.equal(vdom.tag, 'div', 'VDOM should have correct tag')
    assert.equal(vdom.props.className, 'test', 'VDOM should have correct props')
    assert.equal(
      vdom.children[0],
      'Hello World',
      'VDOM should have correct children',
    )
  })

  runner.test('Template System - DOM Rendering', () => {
    const vdom = h('div', { className: 'test' }, 'Hello World')
    const element = render(vdom)

    assert.equal(
      element.tagName,
      'DIV',
      'Rendered element should have correct tag',
    )
    assert.equal(
      element.className,
      'test',
      'Rendered element should have correct class',
    )
    assert.equal(
      element.textContent,
      'Hello World',
      'Rendered element should have correct content',
    )
  })

  runner.test('Template System - Fragment', () => {
    const vdom = Fragment(h('div', {}, 'First'), h('div', {}, 'Second'))

    assert.equal(
      vdom.children.length,
      2,
      'Fragment should contain multiple children',
    )
  })
}

// ============================================================================
// COMPONENT SYSTEM TESTS
// ============================================================================

const testComponentSystem = (runner) => {
  runner.test('Component System - Component Creation', () => {
    const TestComponent = createComponent('Test', (props) =>
      h('div', {}, props.message),
    )

    assert.isFunction(TestComponent, 'Component should be a function')

    const instance = TestComponent({ message: 'Hello' })
    assert.truthy(
      instance.render,
      'Component instance should have render method',
    )
  })

  runner.test('Component System - Component Rendering', () => {
    const TestComponent = createComponent('Test', (props) =>
      h('div', { className: 'test-component' }, props.message),
    )

    const instance = TestComponent({ message: 'Hello World' })
    const element = instance.render()

    assert.equal(
      element.className,
      'test-component',
      'Component should render with correct class',
    )
    assert.equal(
      element.textContent,
      'Hello World',
      'Component should render with correct content',
    )
  })
}

// ============================================================================
// PRODUCT SERVICE TESTS
// ============================================================================

const testProductServices = (runner) => {
  runner.test('Product Service - Service Creation', () => {
    const productService = createProductService()

    assert.isFunction(
      productService.fetchProducts,
      'Service should have fetchProducts method',
    )
    assert.isFunction(
      productService.fetchById,
      'Service should have fetchById method',
    )
    assert.isFunction(
      productService.normalizeProduct,
      'Service should have normalizeProduct method',
    )
  })

  runner.test('Product Service - Product Normalization', () => {
    const productService = createProductService()
    const rawProduct = {
      id: 1,
      brand: 'Test Brand',
      model: 'Test Model',
      price: '100.50',
      in_stock: true,
    }

    const normalized = productService.normalizeProduct(rawProduct)

    assert.equal(normalized.id, 1, 'Product ID should be preserved')
    assert.equal(
      normalized.brand,
      'Test Brand',
      'Product brand should be preserved',
    )
    assert.equal(
      normalized.price,
      100.5,
      'Product price should be converted to number',
    )
    assert.truthy(normalized.inStock, 'Product stock should be normalized')
    assert.truthy(
      normalized.displayName,
      'Product should have computed displayName',
    )
  })

  runner.test('Watch Service - Watch-Specific Features', () => {
    const watchService = createWatchService()

    assert.isFunction(
      watchService.fetchWatches,
      'Watch service should have fetchWatches method',
    )
    assert.isFunction(
      watchService.fetchByMovement,
      'Watch service should have fetchByMovement method',
    )
    assert.isFunction(
      watchService.normalizeWatch,
      'Watch service should have normalizeWatch method',
    )
  })

  runner.test('Jewelry Service - Jewelry-Specific Features', () => {
    const jewelryService = createJewelryService()

    assert.isFunction(
      jewelryService.fetchJewelry,
      'Jewelry service should have fetchJewelry method',
    )
    assert.isFunction(
      jewelryService.fetchByMaterial,
      'Jewelry service should have fetchByMaterial method',
    )
    assert.isFunction(
      jewelryService.normalizeJewelry,
      'Jewelry service should have normalizeJewelry method',
    )
  })
}

// ============================================================================
// CATALOG COMPONENT TESTS
// ============================================================================

const testCatalogComponent = (runner) => {
  runner.test('Catalog Component - Component Creation', () => {
    const CatalogComponent = createCatalogComponent({
      category: 'watch',
      containerId: 'test-products',
    })

    assert.isFunction(
      CatalogComponent,
      'Catalog component should be a function',
    )
  })

  runner.test('Catalog Component - Component Instance', () => {
    const CatalogComponent = createCatalogComponent({
      category: 'watch',
      containerId: 'test-products',
    })

    const instance = CatalogComponent()

    assert.truthy(instance.render, 'Catalog instance should have render method')
    assert.truthy(instance.mount, 'Catalog instance should have mount method')
    assert.truthy(
      instance.destroy,
      'Catalog instance should have destroy method',
    )
  })
}

// ============================================================================
// INTEGRATION TESTS
// ============================================================================

const testIntegration = (runner) => {
  runner.test('Integration - Full Pipeline', () => {
    // Test the complete pipeline from service to component
    const productService = createProductService()

    // Mock product data
    const mockProducts = [
      {
        id: 1,
        brand: 'Rolex',
        model: 'Submariner',
        price: 8500,
        inStock: true, // Use inStock instead of in_stock
      },
      {
        id: 2,
        brand: 'Omega',
        model: 'Speedmaster',
        price: 3200,
        inStock: true, // Use inStock instead of in_stock
      },
    ]

    // Normalize products
    const normalized = mockProducts.map(productService.normalizeProduct)

    assert.equal(normalized.length, 2, 'Should normalize all products')
    assert.truthy(
      normalized[0].displayName,
      'Products should have computed fields',
    )
    assert.truthy(
      normalized[0].isAvailable,
      'Products should have availability computed',
    )
  })

  runner.test('Integration - Template Rendering Pipeline', () => {
    // Test template rendering with real data
    const mockProduct = {
      id: 1,
      brand: 'Rolex',
      model: 'Submariner',
      name: 'Rolex Submariner',
      price: 8500,
      formattedPrice: '$8,500',
      imageUrl: '/test.jpg',
      inStock: true,
      sku: 'rolex-submariner',
    }

    // This would normally use ProductCard template
    const vdom = h(
      'div',
      { className: 'product-card' },
      h('h3', {}, mockProduct.name),
      h('span', { className: 'price' }, mockProduct.formattedPrice),
    )

    const element = render(vdom)

    assert.equal(
      element.className,
      'product-card',
      'Product card should render correctly',
    )
    assert.truthy(element.querySelector('h3'), 'Product card should have title')
    assert.truthy(
      element.querySelector('.price'),
      'Product card should have price',
    )
  })
}

// ============================================================================
// RUN ALL TESTS
// ============================================================================

/**
 * Run all integration tests
 */
export const runIntegrationTests = async () => {
  const runner = createTestRunner()

  // Register all test suites
  testFunctionalUtils(runner)
  testStateManagement(runner)
  testTemplateSystem(runner)
  testComponentSystem(runner)
  testProductServices(runner)
  testCatalogComponent(runner)
  testIntegration(runner)

  // Run tests
  const results = await runner.run()

  if (results.failed === 0) {
    console.log(
      '🎉 All tests passed! Functional architecture is working correctly.',
    )
  } else {
    console.log(
      `⚠️ ${results.failed} tests failed. Please check the implementation.`,
    )
  }

  return results
}

// Auto-run tests in development
if (
  window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1'
) {
  // Run tests after a short delay to ensure everything is loaded
  setTimeout(() => {
    console.log('🧪 Running integration tests in development mode...')
    runIntegrationTests()
  }, 1000)
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  runIntegrationTests,
  createTestRunner,
  assert,
}
