// Карточка товара для сетки
export const createProductCard = (product) => `
  <div class="single-product-area mt-30">
    <div class="product-thumb">
      <a href="${product.url}">
        <img class="primary-image" src="${product.imageUrl}" alt="${product.name}">
      </a>
      ${product.isNew ? '<div class="label-product label_new">New</div>' : ''}
      <div class="action-links">
        <a href="wishlist.html" class="wishlist-btn" title="Добавить в избранное" data-product-id="${product.id}">
          <i class="icon-heart"></i>
        </a>
        <a href="#" class="quick-view" title="Быстрый просмотр" data-bs-toggle="modal" data-bs-target="#exampleModalCenter">
          <i class="icon-magnifier icons"></i>
        </a>
      </div>
    </div>
    <div class="product-caption">
      <h4 class="product-brand">
        <a href="${product.url}">${product.brand}</a>
      </h4>
      <h4 class="product-name">
        <a href="${product.url}">${product.name}</a>
      </h4>
      <div class="price-box">
        <span class="new-price">${product.formattedPrice}</span>
        ${product.oldPrice ? `<span class="old-price">${product.formattedOldPrice}</span>` : ''}
      </div>
    </div>
  </div>
`

// Элемент списка товаров
export const createProductListItem = (product) => `
  <div class="shop-product-list-wrap">
    <div class="row product-layout-list mt-30">
      <div class="col-lg-3 col-md-3">
        <div class="single-product">
          <div class="product-image">
            <a href="${product.url}">
              <img src="${product.imageUrl}" alt="Product Images">
            </a>
          </div>
        </div>
      </div>
      <div class="col-lg-6 col-md-6">
        <div class="product-content-list text-left">
          <h4><a href="${product.url}" class="product-name">${product.name}</a></h4>
          <div class="price-box">
            <span class="new-price">${product.formattedPrice}</span>
            ${product.oldPrice ? `<span class="old-price">${product.formattedOldPrice}</span>` : ''}
          </div>
          ${createRating(product.rating)}
          <p>${product.description}</p>
        </div>
      </div>
      <div class="col-lg-3 col-md-3">
        ${createProductActions(product)}
      </div>
    </div>
  </div>
`

// Компонент рейтинга
export const createRating = (rating) => `
  <div class="product-rating">
    <ul class="d-flex">
      ${[...Array(5)]
        .map(
          (_, i) => `
        <li${i >= rating ? ' class="bad-reting"' : ''}>
          <a href="#"><i class="icon-star"></i></a>
        </li>
      `,
        )
        .join('')}
    </ul>
  </div>
`

// Действия с товаром
export const createProductActions = (product) => `
  <div class="block2">
    <ul class="stock-cont">
      <li class="product-sku">Артикул: <span>${product.sku}</span></li>
      <li class="product-stock-status">Наличие: <span class="in-stock">В наличии</span></li>
    </ul>
    <div class="product-button">
      <ul class="actions">
        <li class="add-to-wishlist">
          <a href="wishlist.html" class="add_to_wishlist" data-product-id="${product.id}">
            <i class="icon-heart"></i> Добавить в избранное
          </a>
        </li>
      </ul>
      <div class="add-to-cart">
        <div class="product-button-action">
          <a href="#" class="add-to-cart">Добавить в корзину</a>
        </div>
      </div>
    </div>
  </div>
`

// Состояния UI
export const createLoadingState = () => `
  <div class="text-center loading-products" style="width: 100%; padding: 3rem;">
    <div style="color: #fff; font-size: 1.4rem; margin-bottom: 1rem;">
      <i class="fa fa-spinner fa-spin"></i> Загрузка товаров...
    </div>
    <div style="color: #ccc; font-size: 1.2rem;">
      Получение последних товаров из API
    </div>
  </div>
`

export const createErrorState = (message, onRetry, onShowSamples) => `
  <div class="text-center error-products" style="width: 100%; padding: 3rem;">
    <div style="color: #ff6b6b; font-size: 1.4rem; margin-bottom: 1rem;">
      <i class="fa fa-exclamation-triangle"></i> Не удалось загрузить товары
    </div>
    <div style="color: #ccc; font-size: 1.2rem; margin-bottom: 2rem;">
      ${message}
    </div>
    <button onclick="${onRetry}" class="btn btn-primary">
      <i class="fa fa-refresh"></i> Попробовать снова
    </button>
    <button onclick="${onShowSamples}" class="btn btn-success ms-2">
      <i class="fa fa-eye"></i> Показать образцы товаров
    </button>
  </div>
`

export const createEmptyState = () => `
  <div class="text-center" style="padding: 3rem;">
    <p style="color: #ccc; font-size: 1.2rem;">Товары не найдены</p>
  </div>
`
