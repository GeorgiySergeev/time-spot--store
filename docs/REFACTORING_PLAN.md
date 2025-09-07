# JavaScript Refactoring Plan - Functional & Declarative Architecture

## Current State Analysis

### 🔍 **Complexity Assessment: Level 4**

The current JavaScript architecture has significant complexity issues that require comprehensive refactoring:

#### **Current Problems:**

1. **Dual API Structure**: Confusing `api/` and `api-2/` folders with overlapping functionality
2. **Class-Based Architecture**: Heavy use of classes (`ProductCatalogState`, etc.) making code harder to test and maintain
3. **Mixed Paradigms**: Imperative and object-oriented patterns mixed with some functional elements
4. **Tight Coupling**: Components directly importing and manipulating DOM elements
5. **State Management**: Complex state management scattered across multiple files
6. **Code Duplication**: Similar functionality implemented multiple times
7. **Hard to Scale**: Adding new product categories requires extensive modifications

---

## 🎯 **Refactoring Goals**

### **Primary Objectives:**

1. **Functional Programming**: Replace classes with pure functions and functional composition
2. **Declarative Approach**: Use declarative patterns for UI updates and data flow
3. **Modular Architecture**: Create scalable, category-agnostic modules
4. **Simplified Structure**: Reduce complexity while maintaining functionality
5. **Easy Scaling**: Support unlimited product categories with minimal code changes

### **Architecture Principles:**

- **Pure Functions**: No side effects, predictable outputs
- **Immutable Data**: State updates through pure functions
- **Composition**: Build complex functionality from simple functions
- **Separation of Concerns**: Clear boundaries between data, logic, and presentation
- **Declarative UI**: Describe what should be rendered, not how

---

## 🏗️ **New Architecture Design**

### **Core Module Structure**

```
src/js/
├── core/                    # Core functional utilities
│   ├── state.js            # Immutable state management
│   ├── effects.js          # Side effects (API calls, DOM updates)
│   ├── selectors.js        # Data selection and transformation
│   └── utils.js            # Pure utility functions
├── modules/                 # Feature modules
│   ├── catalog/            # Product catalog functionality
│   │   ├── api.js          # API functions
│   │   ├── filters.js      # Filter logic
│   │   ├── renderers.js    # UI rendering functions
│   │   └── state.js        # Catalog-specific state
│   ├── product-details/    # Product details functionality
│   │   ├── api.js
│   │   ├── gallery.js
│   │   └── renderers.js
│   └── ui/                 # Reusable UI components
│       ├── modal.js
│       ├── tabs.js
│       └── carousel.js
├── config/                 # Configuration
│   ├── api.js             # API configuration
│   ├── ui.js              # UI configuration
│   └── categories.js      # Product categories configuration
└── app.js                 # Main application entry point
```

### **Functional Architecture Pattern**

```javascript
// Data Flow: Action → State → Selector → Renderer → DOM
const appFlow = pipe(
  handleAction, // Pure function: action → new state
  selectData, // Pure function: state → view data
  renderUI, // Pure function: data → DOM elements
  updateDOM, // Side effect: DOM manipulation
)
```

---

## 📋 **Implementation Plan**

### **Phase 1: Core Infrastructure (2-3 days)**

#### **1.1 Create Core Functional Utilities**

**Files to Create:**

- `src/js/core/state.js` - Immutable state management
- `src/js/core/effects.js` - Side effects handling
- `src/js/core/selectors.js` - Data selection functions
- `src/js/core/utils.js` - Pure utility functions

**Key Functions:**

```javascript
// state.js
export const createState = (initialState) => ({ ...initialState })
export const updateState = (state, updates) => ({ ...state, ...updates })
export const selectFromState = (state, path) => get(state, path)

// effects.js
export const withErrorHandling =
  (fn) =>
  async (...args) => {
    try {
      return await fn(...args)
    } catch (error) {
      return { error: error.message }
    }
  }

// selectors.js
export const selectProducts = (state) => state.catalog.products
export const selectFilters = (state) => state.catalog.filters
export const selectFilteredProducts = (state) =>
  applyFilters(selectProducts(state), selectFilters(state))
```

#### **1.2 Configuration System**

**Files to Create:**

- `src/js/config/categories.js` - Product categories configuration
- `src/js/config/api.js` - API configuration
- `src/js/config/ui.js` - UI configuration

**Category Configuration:**

```javascript
// categories.js
export const CATEGORIES = {
  watch: {
    id: 'watch',
    name: 'Часы',
    apiEndpoint: '/content/items/watch',
    filters: ['brand', 'price', 'availability'],
    sortOptions: ['price', 'name', 'newest'],
  },
  jewelry: {
    id: 'jewelry',
    name: 'Украшения',
    apiEndpoint: '/content/items/jewelry',
    filters: ['brand', 'price', 'availability'],
    sortOptions: ['price', 'name', 'newest'],
  },
}

export const getCategoryConfig = (categoryId) => CATEGORIES[categoryId]
export const getAllCategories = () => Object.values(CATEGORIES)
```

### **Phase 2: Catalog Module Refactoring (3-4 days)**

#### **2.1 Functional API Layer**

**Files to Refactor:**

- `src/js/api/api.js` → `src/js/modules/catalog/api.js`
- `src/js/api/config.js` → Merge into `src/js/config/api.js`

**New API Functions:**

```javascript
// modules/catalog/api.js
export const fetchProducts = (category, filters = {}) =>
  pipe(
    buildApiUrl,
    makeApiRequest,
    normalizeResponse,
    validateProducts,
  )(category, filters)

export const fetchProductById = (category, id) =>
  pipe(buildProductUrl, makeApiRequest, normalizeProduct)(category, id)

// Pure functions for data transformation
export const normalizeProduct = (rawProduct) => ({
  id: rawProduct._id || rawProduct.id,
  brand: rawProduct.brand || 'Неизвестно',
  model: rawProduct.model || rawProduct.name,
  price: Number(rawProduct.price) || 0,
  image: buildImageUrl(rawProduct.img),
  category: rawProduct.category || 'watch',
  inStock: Boolean(rawProduct.in_stock),
})
```

#### **2.2 Functional Filter System**

**Files to Create:**

- `src/js/modules/catalog/filters.js`

**Filter Functions:**

```javascript
// modules/catalog/filters.js
export const filterByPrice = (products, minPrice, maxPrice) =>
  products.filter(
    (product) => product.price >= minPrice && product.price <= maxPrice,
  )

export const filterByBrand = (products, brands) =>
  brands.length === 0
    ? products
    : products.filter((product) => brands.includes(product.brand))

export const filterByAvailability = (products, inStockOnly) =>
  inStockOnly ? products.filter((product) => product.inStock) : products

export const searchProducts = (products, searchTerm) =>
  searchTerm === ''
    ? products
    : products.filter((product) =>
        [product.brand, product.model, product.category].some((field) =>
          field.toLowerCase().includes(searchTerm.toLowerCase()),
        ),
      )

// Compose all filters
export const applyFilters = (products, filters) =>
  pipe(
    (products) =>
      filterByPrice(products, filters.priceRange.min, filters.priceRange.max),
    (products) => filterByBrand(products, filters.brands),
    (products) => filterByAvailability(products, filters.inStockOnly),
    (products) => searchProducts(products, filters.searchTerm),
  )(products)
```

#### **2.3 Declarative Rendering**

**Files to Refactor:**

- `src/js/api/templates.js` → `src/js/modules/catalog/renderers.js`

**Renderer Functions:**

```javascript
// modules/catalog/renderers.js
export const renderProductCard = (product) => ({
  type: 'div',
  className: 'col-lg-4 col-md-6 col-sm-6',
  children: [
    {
      type: 'div',
      className: 'single-product-item',
      children: [
        renderProductImage(product),
        renderProductInfo(product),
        renderProductActions(product),
      ],
    },
  ],
})

export const renderProductGrid = (products) => ({
  type: 'div',
  className: 'row',
  children: products.map(renderProductCard),
})

export const renderCatalog = (state) => {
  const products = selectFilteredProducts(state)
  const isLoading = selectIsLoading(state)
  const error = selectError(state)

  if (isLoading) return renderLoadingState()
  if (error) return renderErrorState(error)
  if (products.length === 0) return renderEmptyState()

  return renderProductGrid(products)
}
```

### **Phase 3: State Management & Effects (2-3 days)**

#### **3.1 Application State**

**Files to Create:**

- `src/js/core/app-state.js`

**State Structure:**

```javascript
// core/app-state.js
export const createAppState = () => ({
  catalog: {
    products: [],
    filters: {
      priceRange: { min: 0, max: 5000 },
      brands: [],
      inStockOnly: false,
      searchTerm: '',
    },
    sortBy: 'name',
    sortOrder: 'asc',
    isLoading: false,
    error: null,
  },
  productDetails: {
    currentProduct: null,
    isLoading: false,
    error: null,
  },
  ui: {
    currentView: 'grid',
    currentPage: 1,
    itemsPerPage: 12,
  },
})
```

#### **3.2 Action Handlers**

**Files to Create:**

- `src/js/core/actions.js`

**Action System:**

```javascript
// core/actions.js
export const createAction = (type, payload) => ({ type, payload })

export const actionHandlers = {
  SET_PRODUCTS: (state, { products }) =>
    updateState(state, {
      catalog: updateState(state.catalog, { products, isLoading: false }),
    }),

  SET_FILTERS: (state, { filters }) =>
    updateState(state, {
      catalog: updateState(state.catalog, { filters }),
    }),

  SET_LOADING: (state, { isLoading }) =>
    updateState(state, {
      catalog: updateState(state.catalog, { isLoading }),
    }),
}

export const handleAction = (state, action) => {
  const handler = actionHandlers[action.type]
  return handler ? handler(state, action.payload) : state
}
```

#### **3.3 Side Effects**

**Files to Create:**

- `src/js/core/effects.js`

**Effect Functions:**

```javascript
// core/effects.js
export const loadProducts = async (dispatch, category, filters) => {
  dispatch(createAction('SET_LOADING', { isLoading: true }))

  const result = await fetchProducts(category, filters)

  if (result.error) {
    dispatch(createAction('SET_ERROR', { error: result.error }))
  } else {
    dispatch(createAction('SET_PRODUCTS', { products: result.products }))
  }
}

export const updateFilters = (dispatch, filters) => {
  dispatch(createAction('SET_FILTERS', { filters }))
  // Trigger product reload with new filters
  loadProducts(dispatch, getCurrentCategory(), filters)
}
```

### **Phase 4: UI Components Refactoring (2-3 days)**

#### **4.1 Functional UI Components**

**Files to Refactor:**

- `src/js/components/product-tabs.js` → `src/js/modules/ui/tabs.js`
- `src/js/functions/quickView.js` → `src/js/modules/ui/modal.js`

**Component Functions:**

```javascript
// modules/ui/tabs.js
export const createTabComponent = (config) => ({
  init: () => {
    const tabs = document.querySelectorAll(config.selector)
    tabs.forEach((tab) => {
      tab.addEventListener('click', handleTabClick)
    })
  },

  destroy: () => {
    const tabs = document.querySelectorAll(config.selector)
    tabs.forEach((tab) => {
      tab.removeEventListener('click', handleTabClick)
    })
  },
})

// modules/ui/modal.js
export const createModalComponent = (config) => ({
  show: (content) => {
    const modal = document.getElementById(config.id)
    const modalContent = modal.querySelector('.modal-body')
    modalContent.innerHTML = content
    new bootstrap.Modal(modal).show()
  },

  hide: () => {
    const modal = document.getElementById(config.id)
    const modalInstance = bootstrap.Modal.getInstance(modal)
    modalInstance?.hide()
  },
})
```

#### **4.2 Declarative DOM Updates**

**Files to Create:**

- `src/js/core/dom.js`

**DOM Functions:**

```javascript
// core/dom.js
export const createElement = ({ type, className, children, ...props }) => {
  const element = document.createElement(type)

  if (className) element.className = className
  Object.assign(element, props)

  if (children) {
    children.forEach((child) => {
      if (typeof child === 'string') {
        element.appendChild(document.createTextNode(child))
      } else if (child.type) {
        element.appendChild(createElement(child))
      } else {
        element.appendChild(child)
      }
    })
  }

  return element
}

export const updateElement = (element, newProps) => {
  Object.assign(element, newProps)
  return element
}

export const replaceContent = (container, content) => {
  container.innerHTML = ''
  if (typeof content === 'string') {
    container.innerHTML = content
  } else {
    container.appendChild(createElement(content))
  }
}
```

### **Phase 5: Application Integration (1-2 days)**

#### **5.1 Main Application**

**Files to Refactor:**

- `src/js/main.js` → `src/js/app.js`

**Application Structure:**

```javascript
// app.js
import { createAppState } from './core/app-state.js'
import { handleAction } from './core/actions.js'
import { loadProducts } from './core/effects.js'
import { renderCatalog } from './modules/catalog/renderers.js'
import { createTabComponent } from './modules/ui/tabs.js'
import { createModalComponent } from './modules/ui/modal.js'

class App {
  constructor() {
    this.state = createAppState()
    this.components = {
      tabs: createTabComponent({ selector: '.product-tab' }),
      modal: createModalComponent({ id: 'quickViewModal' }),
    }
  }

  init() {
    this.setupEventListeners()
    this.loadInitialData()
    this.components.tabs.init()
  }

  dispatch(action) {
    this.state = handleAction(this.state, action)
    this.render()
  }

  render() {
    const catalogContainer = document.getElementById('products')
    if (catalogContainer) {
      replaceContent(catalogContainer, renderCatalog(this.state))
    }
  }

  setupEventListeners() {
    // Filter event listeners
    document.addEventListener('filter-change', (e) => {
      this.dispatch(createAction('SET_FILTERS', { filters: e.detail }))
    })

    // Search event listeners
    const searchInput = document.getElementById('product-search')
    if (searchInput) {
      searchInput.addEventListener(
        'input',
        debounce((e) => {
          this.dispatch(
            createAction('SET_SEARCH', { searchTerm: e.target.value }),
          )
        }, 300),
      )
    }
  }

  loadInitialData() {
    const category = this.getCurrentCategory()
    loadProducts(this.dispatch.bind(this), category, {})
  }

  getCurrentCategory() {
    const path = window.location.pathname
    if (path.includes('jewelry')) return 'jewelry'
    if (path.includes('watch')) return 'watch'
    return 'watch' // default
  }
}

// Initialize application
document.addEventListener('DOMContentLoaded', () => {
  window.app = new App()
  window.app.init()
})
```

---

## 🔄 **Migration Strategy**

### **Step-by-Step Migration**

1. **Create new structure** alongside existing code
2. **Implement core utilities** first (state, effects, selectors)
3. **Migrate one module at a time** (start with catalog)
4. **Test each module** before proceeding
5. **Update imports** gradually
6. **Remove old code** after verification

### **Backward Compatibility**

- Keep existing API endpoints working during migration
- Maintain current UI behavior
- Add feature flags for new functionality
- Gradual rollout of new components

---

## 📊 **Benefits of New Architecture**

### **Functional Programming Benefits:**

- **Predictable**: Pure functions always return same output for same input
- **Testable**: Easy to unit test individual functions
- **Composable**: Build complex functionality from simple parts
- **Debuggable**: Clear data flow and function boundaries

### **Declarative Benefits:**

- **Readable**: Code describes what should happen, not how
- **Maintainable**: Easier to understand and modify
- **Reusable**: Components can be easily reused
- **Scalable**: Easy to add new features and categories

### **Modular Benefits:**

- **Category Agnostic**: Same code works for any product category
- **Easy Extension**: Add new categories with minimal code
- **Clear Separation**: Each module has single responsibility
- **Independent Testing**: Test modules in isolation

---

## 🎯 **Success Metrics**

### **Code Quality:**

- **Reduced Complexity**: Cyclomatic complexity < 10 per function
- **Increased Testability**: 90%+ function coverage
- **Better Maintainability**: Clear module boundaries
- **Improved Readability**: Self-documenting code

### **Performance:**

- **Faster Initial Load**: Reduced bundle size
- **Better Runtime Performance**: Optimized rendering
- **Improved Memory Usage**: Immutable data structures
- **Enhanced User Experience**: Smooth interactions

### **Scalability:**

- **Easy Category Addition**: New categories in < 1 hour
- **Feature Extensibility**: New features without breaking changes
- **Team Collaboration**: Clear module ownership
- **Future-Proof**: Architecture supports growth

---

## 🚀 **Implementation Timeline**

| Phase       | Duration       | Key Deliverables                     |
| ----------- | -------------- | ------------------------------------ |
| **Phase 1** | 2-3 days       | Core utilities, configuration system |
| **Phase 2** | 3-4 days       | Catalog module refactoring           |
| **Phase 3** | 2-3 days       | State management, effects            |
| **Phase 4** | 2-3 days       | UI components refactoring            |
| **Phase 5** | 1-2 days       | Application integration              |
| **Total**   | **10-15 days** | **Complete functional architecture** |

---

## 🔧 **Tools & Libraries**

### **Functional Programming:**

- **Ramda** or **Lodash/FP**: Functional utilities
- **Immer**: Immutable state updates
- **RxJS**: Reactive programming (optional)

### **Testing:**

- **Jest**: Unit testing framework
- **Testing Library**: Component testing
- **Cypress**: End-to-end testing

### **Development:**

- **ESLint**: Code quality
- **Prettier**: Code formatting
- **TypeScript**: Type safety (optional)

---

This refactoring plan transforms the current complex, class-based architecture into a clean, functional, and declarative system that's easy to understand, test, and scale. The modular design ensures that adding new product categories requires minimal code changes while maintaining all existing functionality.
