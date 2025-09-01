// Updated Product Templates for Cockpit CMS Structure
// Data structure: id, brand, model, price, img, category, in_stock

// Product card for grid view
export const createProductCard = (product) => `
  <div class="single-product-area mt-30">
    <div class="product-thumb">
      <a href="${product.url}">
        <img class="primary-image" src="${product.imageUrl}" alt="${product.name}" loading="lazy">
      </a>
      ${!product.inStock ? '<div class="label-product label_out">Нет в наличии</div>' : ''}
      <div class="action-links">
        <a href="wishlist.html" class="wishlist-btn" title="Добавить в избранное" data-product-id="${product.id}">
          <i class="icon-heart"></i>
        </a>
        <a href="#" class="quick-view" title="Быстрый просмотр" data-bs-toggle="modal" data-bs-target="#productModal" data-product-id="${product.id}">
          <i class="icon-magnifier icons"></i>
        </a>
      </div>
    </div>
    <div class="product-caption">
      <h4 class="product-brand">
        <a href="${product.url}">${product.brand}</a>
      </h4>
      <h4 class="product-name">
        <a href="${product.url}">${product.model}</a>
      </h4>
      <div class="price-box">
        <span class="new-price">${product.formattedPrice}</span>
      </div>
      <div class="product-stock ${product.inStock ? 'in-stock' : 'out-of-stock'}">
        ${product.inStock ? 'В наличии' : 'Нет в наличии'}
      </div>
    </div>
  </div>
`

// Product list item for list view
export const createProductListItem = (product) => `
  <div class="shop-product-list-wrap">
    <div class="row product-layout-list mt-30">
      <div class="col-lg-3 col-md-3">
        <div class="single-product">
          <div class="product-image">
            <a href="${product.url}">
              <img src="${product.imageUrl}" alt="${product.name}" loading="lazy">
            </a>
          </div>
        </div>
      </div>
      <div class="col-lg-6 col-md-6">
        <div class="product-content-list text-left">
          <h4><a href="${product.url}" class="product-name">${product.name}</a></h4>
          <div class="product-meta">
            <span class="product-brand">Бренд: ${product.brand}</span>
            <span class="product-model">Модель: ${product.model}</span>
            <span class="product-category">Категория: ${getCategoryName(product.category)}</span>
          </div>
          <div class="price-box">
            <span class="new-price">${product.formattedPrice}</span>
          </div>
          <div class="product-stock ${product.inStock ? 'in-stock' : 'out-of-stock'}">
            ${product.inStock ? '✓ В наличии' : '✗ Нет в наличии'}
          </div>
        </div>
      </div>
      <div class="col-lg-3 col-md-3">
        ${createProductActions(product)}
      </div>
    </div>
  </div>
`

// Product actions component
export const createProductActions = (product) => `
  <div class="block2">
    <ul class="stock-cont">
      <li class="product-sku">Артикул: <span>${product.sku}</span></li>
      <li class="product-stock-status">
        Наличие: <span class="${product.inStock ? 'in-stock' : 'out-of-stock'}">
          ${product.inStock ? 'В наличии' : 'Нет в наличии'}
        </span>
      </li>
    </ul>
    <div class="product-button">
      <ul class="actions">
        <li class="add-to-wishlist">
          <a href="wishlist.html" class="add_to_wishlist" data-product-id="${product.id}">
            <i class="icon-heart"></i> В избранное
          </a>
        </li>
      </ul>
      ${product.inStock ? createAddToCartButton(product) : createNotifyButton(product)}
    </div>
  </div>
`

// Add to cart button (for future e-commerce if needed)
export const createAddToCartButton = (product) => `
  <div class="add-to-cart">
    <div class="product-button-action">
      <a href="#" class="add-to-cart-btn" data-product-id="${product.id}">
        Заказать товар
      </a>
    </div>
  </div>
`

// Notify when available button
export const createNotifyButton = (product) => `
  <div class="notify-available">
    <div class="product-button-action">
      <a href="#" class="notify-btn" data-product-id="${product.id}">
        Уведомить о поступлении
      </a>
    </div>
  </div>
`

// Loading state
export const createLoadingState = () => `
  <div class="text-center loading-products" style="width: 100%; padding: 3rem;">
    <div class="loading-spinner">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Загрузка...</span>
      </div>
    </div>
    <div style="color: #666; font-size: 1.2rem; margin-top: 1rem;">
      Загрузка каталога товаров...
    </div>
  </div>
`

// Error state with retry functionality
export const createErrorState = (message, onRetry, onShowSamples) => `
  <div class="text-center error-products" style="width: 100%; padding: 3rem;">
    <div class="error-icon" style="color: #dc3545; font-size: 3rem; margin-bottom: 1rem;">
      <i class="fas fa-exclamation-triangle"></i>
    </div>
    <h4 style="color: #dc3545; margin-bottom: 1rem;">Ошибка загрузки каталога</h4>
    <div style="color: #666; font-size: 1.1rem; margin-bottom: 2rem;">
      ${message}
    </div>
    <div class="error-actions">
      <button onclick="${onRetry}" class="btn btn-primary me-2">
        <i class="fas fa-refresh"></i> Попробовать снова
      </button>
      <button onclick="${onShowSamples}" class="btn btn-outline-secondary">
        <i class="fas fa-eye"></i> Показать образцы
      </button>
    </div>
  </div>
`

// Empty state when no products found
export const createEmptyState = (filters = {}) => {
  const hasFilters = Object.keys(filters).some(
    (key) =>
      filters[key] &&
      (Array.isArray(filters[key]) ? filters[key].length > 0 : true),
  )

  return `
    <div class="text-center empty-products" style="padding: 3rem;">
      <div class="empty-icon" style="color: #6c757d; font-size: 3rem; margin-bottom: 1rem;">
        <i class="fas fa-search"></i>
      </div>
      <h4 style="color: #6c757d; margin-bottom: 1rem;">
        ${hasFilters ? 'Товары не найдены' : 'Каталог пуст'}
      </h4>
      <p style="color: #868e96; font-size: 1.1rem; margin-bottom: 2rem;">
        ${
          hasFilters
            ? 'Попробуйте изменить параметры поиска или фильтров'
            : 'В данный момент товары отсутствуют'
        }
      </p>
      ${
        hasFilters
          ? `
        <button onclick="clearAllFilters()" class="btn btn-outline-primary">
          <i class="fas fa-times"></i> Сбросить фильтры
        </button>
      `
          : ''
      }
    </div>
  `
}

// Filter sidebar template
export const createFilterSidebar = (filters, currentFilters = {}) => `
  <div class="shop-sidebar">
    <!-- Price Range Filter -->
    <div class="filter-widget mb-4">
      <h5 class="filter-title">Цена</h5>
      <div class="price-filter">
        <div id="price-range" class="price-range-slider"></div>
        <div class="price-inputs mt-2">
          <input type="number" id="price-min" class="form-control form-control-sm d-inline-block w-45"
                 placeholder="От" value="${currentFilters.priceMin || filters.priceRange?.min || 0}">
          <span class="mx-2">-</span>
          <input type="number" id="price-max" class="form-control form-control-sm d-inline-block w-45"
                 placeholder="До" value="${currentFilters.priceMax || filters.priceRange?.max || 5000}">
        </div>
      </div>
    </div>

    <!-- Brand Filter -->
    <div class="filter-widget mb-4">
      <h5 class="filter-title">Бренд</h5>
      <div class="brand-filter">
        ${
          filters.brands
            ?.map(
              (brand) => `
          <div class="form-check">
            <input class="form-check-input brand-checkbox" type="checkbox"
                   value="${brand}" id="brand-${brand.replace(/\s+/g, '-')}"
                   ${currentFilters.brands?.includes(brand) ? 'checked' : ''}>
            <label class="form-check-label" for="brand-${brand.replace(/\s+/g, '-')}">
              ${brand}
            </label>
          </div>
        `,
            )
            .join('') || '<p class="text-muted">Бренды не найдены</p>'
        }
      </div>
    </div>

    <!-- Stock Filter -->
    <div class="filter-widget mb-4">
      <h5 class="filter-title">Наличие</h5>
      <div class="stock-filter">
        <div class="form-check">
          <input class="form-check-input" type="checkbox" id="in-stock-only"
                 ${currentFilters.inStockOnly ? 'checked' : ''}>
          <label class="form-check-label" for="in-stock-only">
            Только в наличии
          </label>
        </div>
      </div>
    </div>

    <!-- Clear Filters -->
    <div class="filter-actions">
      <button type="button" class="btn btn-outline-secondary btn-sm" onclick="clearAllFilters()">
        <i class="fas fa-times"></i> Сбросить фильтры
      </button>
    </div>
  </div>
`

// Sort controls template
export const createSortControls = (currentSort = '') => `
  <div class="product-short">
    <label for="sort-select">Сортировка:</label>
    <select class="form-select form-select-sm" id="sort-select" style="width: auto; display: inline-block;">
      <option value="" ${!currentSort ? 'selected' : ''}>По умолчанию</option>
      <option value="price_asc" ${currentSort === 'price_asc' ? 'selected' : ''}>Цена: по возрастанию</option>
      <option value="price_desc" ${currentSort === 'price_desc' ? 'selected' : ''}>Цена: по убыванию</option>
      <option value="name_asc" ${currentSort === 'name_asc' ? 'selected' : ''}>Название: А-Я</option>
      <option value="name_desc" ${currentSort === 'name_desc' ? 'selected' : ''}>Название: Я-А</option>
    </select>
  </div>
`

// Helper function to get category display name
export const getCategoryName = (category) => {
  const categoryNames = {
    watch: 'Часы',
    jewelry: 'Украшения',
    accessories: 'Аксессуары',
  }
  return categoryNames[category] || category
}

// Product count display
export const createProductCount = (total, start, end) => `
  <div class="product-count">
    Показано ${start}-${end} из ${total} товаров
  </div>
`

// Pagination template
export const createPagination = (currentPage, totalPages, onPageChange) => {
  if (totalPages <= 1) return ''

  let pagination = '<ul class="pagination-box">'

  // Previous button
  if (currentPage > 1) {
    pagination += `<li><a href="#" onclick="${onPageChange}(${currentPage - 1})">Предыдущая</a></li>`
  }

  // Page numbers
  const maxVisiblePages = 5
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)

  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1)
  }

  for (let i = startPage; i <= endPage; i++) {
    pagination += `<li ${i === currentPage ? 'class="active"' : ''}>
      <a href="#" onclick="${onPageChange}(${i})">${i}</a>
    </li>`
  }

  // Next button
  if (currentPage < totalPages) {
    pagination += `<li><a href="#" onclick="${onPageChange}(${currentPage + 1})">Следующая</a></li>`
  }

  pagination += '</ul>'
  return pagination
}
