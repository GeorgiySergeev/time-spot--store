// Updated Product Templates for Cockpit CMS Structure
// Data structure: id, brand, model, price, img, category, in_stock

// Product card for grid view
export const createProductCard = (product) => `
  <div class="single-product-area mt-30">
    <div class="product-thumb">
      <a href="product-details.html" class="product-detail-link" data-product-id="${product.id}">
        <img class="primary-image" src="${product.imageUrl}" alt="${product.name}" loading="lazy">
      </a>
      ${!product.inStock ? '<div class="label-product label_out">Нет в наличии</div>' : ''}
      <div class="action-links">
        <a href="wishlist.html" class="wishlist-btn" title="Добавить в избранное" data-product-id="${product.id}">
          <i class="icon-heart"></i>
        </a>
        <a href="#" class="quick-view" title="Быстрый просмотр" data-bs-toggle="modal" data-bs-target="#exampleModalCenter" data-product-id="${product.id}">
          <i class="icon-magnifier icons"></i>
        </a>
      </div>
    </div>
    <div class="product-caption">
      <h4 class="product-brand">
        <a href="product-details.html" class="product-detail-link" data-product-id="${product.id}">${product.brand}</a>
      </h4>
      <h4 class="product-name">
        <a href="product-details.html" class="product-detail-link" data-product-id="${product.id}">${product.model}</a>
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
            <a href="product-details.html" class="product-detail-link" data-product-id="${product.id}">
              <img src="${product.imageUrl}" alt="${product.name}" loading="lazy">
            </a>
          </div>
        </div>
      </div>
      <div class="col-lg-6 col-md-6">
        <div class="product-content-list text-left">
          <h4><a href="product-details.html" class="product-detail-link product-name" data-product-id="${product.id}">${product.name}</a></h4>
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

// Modal content template for product quick view
export const createModalContent = (product) => `
  <div class="row gx-3 product-details-inner">
    <div class="col-lg-5 col-md-6 col-sm-6">
      <!-- Product Details Left -->
      <div class="product-large-slider">
        <div class="pro-large-img">
          <a
            href="${product.imageUrl}"
            class="glightbox zoom-icon"
            data-gallery="modal-gallery"
            data-glightbox="title: ${product.name}; description: High quality product view">
            <img
              src="${product.imageUrl}"
              alt="${product.name}" />
            <span class="zoom-icon-overlay">
              <i class="fa fa-search-plus"></i>
            </span>
          </a>
        </div>
      </div>
      <div class="product-nav">
        <div class="pro-nav-thumb">
          <img src="${product.imageUrl}" alt="${product.name}" />
        </div>
      </div>
      <!--// Product Details Left -->
    </div>

    <div class="col-lg-7 col-md-6 col-sm-6">
      <div class="product-details-view-content">
        <div class="product-info">
          <h3>${product.name}</h3>
          <div class="product-rating d-flex">
            <ul class="d-flex">
              <li><a href="#"><i class="icon-star"></i></a></li>
              <li><a href="#"><i class="icon-star"></i></a></li>
              <li><a href="#"><i class="icon-star"></i></a></li>
              <li><a href="#"><i class="icon-star"></i></a></li>
              <li><a href="#"><i class="icon-star"></i></a></li>
            </ul>
          </div>
          <div class="price-box">
            <span class="new-price">${product.formattedPrice}</span>
          </div>
          <p>
            ${product.description || 'Описание товара отсутствует.'}
          </p>

          <div class="single-add-to-cart">
            <form action="#" class="cart-quantity d-flex">
              <div class="quantity">
                <div class="cart-plus-minus">
                  <input
                    type="number"
                    class="input-text"
                    name="quantity"
                    value="1"
                    title="Qty" />
                </div>
              </div>
              <button class="add-to-cart" type="submit">
                ${product.inStock ? 'Заказать товар' : 'Нет в наличии'}
              </button>
            </form>
          </div>
          <ul class="single-add-actions">
            <li class="add-to-wishlist">
              <a href="wishlist.html" class="add_to_wishlist" data-product-id="${product.id}">
                <i class="icon-heart"></i>
                Добавить в избранное
              </a>
            </li>
          </ul>
          <ul class="stock-cont">
            <li class="product-stock-status">
              Бренд: <a href="#">${product.brand}</a>
            </li>
            <li class="product-stock-status">
              Категория: <a href="#">${getCategoryName(product.category)}</a>
            </li>
            <li class="product-stock-status">
              Наличие: <span class="${product.inStock ? 'in-stock' : 'out-of-stock'}">
                ${product.inStock ? 'В наличии' : 'Нет в наличии'}
              </span>
            </li>
          </ul>
          <div class="share-product-socail-area">
            <p>Поделиться товаром</p>
            <ul class="single-product-share">
              <li><a href="#"><i class="fa fa-facebook"></i></a></li>
              <li><a href="#"><i class="fa fa-twitter"></i></a></li>
              <li><a href="#"><i class="fa fa-pinterest"></i></a></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
`

// Loading state for modal
export const createModalLoadingState = () => `
  <div class="text-center modal-loading" style="padding: 3rem;">
    <div class="loading-spinner">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Загрузка...</span>
      </div>
    </div>
    <div style="color: #666; font-size: 1.1rem; margin-top: 1rem;">
      Загрузка информации о товаре...
    </div>
  </div>
`

// Error state for modal
export const createModalErrorState = (message) => `
  <div class="text-center modal-error" style="padding: 3rem;">
    <div class="error-icon" style="color: #dc3545; font-size: 2rem; margin-bottom: 1rem;">
      <i class="fas fa-exclamation-triangle"></i>
    </div>
    <h4 style="color: #dc3545; margin-bottom: 1rem;">Ошибка загрузки</h4>
    <div style="color: #666; font-size: 1rem; margin-bottom: 2rem;">
      ${message}
    </div>
  </div>
`

// Product Details Page Templates

// Product info section template
export const createProductInfo = (product) => `
  <h3>${product.model || product.name || product.title || 'Product Name'}</h3>
  <div class="product-rating d-flex">
    <ul class="d-flex">
      ${Array.from(
        { length: 5 },
        (_, i) => `
        <li class="${i < (product.rating || 5) ? '' : 'bad-reting'}">
          <a href="#"><i class="icon-star"></i></a>
        </li>
      `,
      ).join('')}
    </ul>
    <span class="count">(1)</span>
  </div>
  <div class="price-box">
    <span class="new-price">${formatPrice(product.price || product.currentPrice)}</span>
    ${
      product.oldPrice || product.originalPrice
        ? `<span class="old-price">${formatPrice(product.oldPrice || product.originalPrice)}</span>`
        : ''
    }
  </div>
  <p>
    ${product.description || product.shortDescription || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'}
  </p>
`

// Product details section template
export const createProductDetails = (product) => `
  <ul class="stock-cont">
    <li class="product-sku">Артикул: <span>${product.sku || product.id || 'P006'}</span></li>
    ${
      product.categories
        ? `<li class="product-stock-status">Категории: ${product.categories.map((cat) => `<a href="#">${cat}</a>`).join(', ')}</li>`
        : ''
    }
  </ul>
`

// Product image gallery template
export const createProductGallery = (product, baseImageUrl) => {
  const mainImage = product.img?.path
    ? `${baseImageUrl}/${product.img.path}`
    : '/img/product/default.jpg'

  return {
    mainImage,
    thumbnails: [
      {
        url: mainImage,
        alt: product.model || 'Product Image',
        active: true,
      },
      ...(product.images || []).map((image, index) => ({
        url: image.path ? `${baseImageUrl}/${image.path}` : image.url || image,
        alt: `Product Image ${index + 2}`,
        active: false,
      })),
    ],
  }
}

// Thumbnail template
export const createThumbnail = (image, index) => `
  <div class="pro-nav-thumb ${image.active ? 'active' : ''}" data-index="${index}">
    <img src="${image.url}" alt="${image.alt}">
    <a href="${image.url}" class="glightbox hidden-gallery-item"
       data-gallery="product-gallery"
       data-glightbox="title: ${image.alt}; description: High quality product view">
    </a>
  </div>
`

// Product loading state template
export const createProductLoadingState = () => `
  <div class="product-loading" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;
       background: rgba(255,255,255,0.9); display: flex; align-items: center;
       justify-content: center; z-index: 100; min-height: 300px;">
    <div style="text-align: center; color: #333;">
      <div style="font-size: 2rem; margin-bottom: 1rem;">
        <i class="fa fa-spinner fa-spin"></i>
      </div>
      <div style="font-size: 1.1rem;">
        Загрузка товара...
      </div>
    </div>
  </div>
`

// Product error state template
export const createProductErrorState = (errorMessage) => `
  <div class="col-12 text-center" style="padding: 3rem;">
    <div style="color: #ff6b6b; font-size: 1.4rem; margin-bottom: 1rem;">
      <i class="fa fa-exclamation-triangle"></i> Не удалось загрузить товар
    </div>
    <div style="color: #666; font-size: 1.1rem; margin-bottom: 2rem;">
      ${errorMessage}
    </div>
    <div style="margin-bottom: 2rem;">
      <button onclick="window.location.reload()"
              style="background: #007bff; color: white; border: none;
                     padding: 1rem 2rem; border-radius: 4px; cursor: pointer; margin-right: 1rem;">
        <i class="fa fa-refresh"></i> Попробовать снова
      </button>
      <a href="shop.html"
         style="background: #28a745; color: white; text-decoration: none;
                padding: 1rem 2rem; border-radius: 4px; display: inline-block;">
        <i class="fa fa-arrow-left"></i> Вернуться к товарам
      </a>
    </div>
    <div style="color: #999; font-size: 0.9rem;">
      Если проблема повторяется, обратитесь к администратору
    </div>
  </div>
`

// Fallback notice template
export const createFallbackNotice = () => `
  <div class="alert alert-info" style="margin-bottom: 2rem; padding: 1rem; background: #d1ecf1;
       border: 1px solid #bee5eb; border-radius: 4px; color: #0c5460;">
    <div style="display: flex; align-items: center;">
      <i class="fa fa-info-circle" style="margin-right: 0.5rem; font-size: 1.2rem;"></i>
      <div>
        <strong>Образцы данных:</strong> Информация о товаре временно недоступна через API.
        <a href="shop.html" style="color: #0c5460; text-decoration: underline; margin-left: 1rem;">Перейти к каталогу</a>
      </div>
    </div>
  </div>
`

// Helper function for price formatting
const formatPrice = (price) => {
  if (typeof price === 'number') {
    return `$${price.toFixed(2)}`
  }
  if (typeof price === 'string') {
    const numPrice = parseFloat(price)
    if (!isNaN(numPrice)) {
      return `$${numPrice.toFixed(2)}`
    }
    return price
  }
  return '$0.00'
}

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
