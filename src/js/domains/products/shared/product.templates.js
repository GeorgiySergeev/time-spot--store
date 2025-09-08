/**
 * Product Templates - Functional Declarative Templates
 * Pure functional templates for product rendering
 */

import {
  h,
  Fragment,
  when,
  ifElse,
  classNames,
  dataAttrs,
} from '../../../core/template.system.js'
import { curry, pipe, isNil } from '../../../core/functional.utils.js'

// ============================================================================
// PRODUCT CARD TEMPLATES
// ============================================================================

/**
 * Product image template
 */
export const ProductImage = (product) =>
  h(
    'div',
    { className: 'product-thumb' },
    h(
      'a',
      {
        href: `product-details.html?id=${product.id}`,
        className: 'product-detail-link',
        ...dataAttrs({ productId: product.id }),
      },
      h('img', {
        className: 'primary-image',
        src: product.imageUrl,
        alt: product.name,
        loading: 'lazy',
      }),
    ),
    when(
      !product.inStock,
      h('div', { className: 'label-product label_out' }, 'Нет в наличии'),
    ),
    ActionLinks(product),
  )

/**
 * Action links template
 */
export const ActionLinks = (product) =>
  h(
    'div',
    { className: 'action-links' },
    h(
      'a',
      {
        href: 'wishlist.html',
        className: 'wishlist-btn',
        title: 'Добавить в избранное',
        ...dataAttrs({ productId: product.id }),
      },
      h('i', { className: 'icon-heart' }),
    ),
    h(
      'a',
      {
        href: '#',
        className: 'quick-view',
        title: 'Быстрый просмотр',
        'data-bs-toggle': 'modal',
        'data-bs-target': '#exampleModalCenter',
        ...dataAttrs({ productId: product.id }),
      },
      h('i', { className: 'icon-magnifier icons' }),
    ),
  )

/**
 * Product caption template
 */
export const ProductCaption = (product) =>
  h(
    'div',
    { className: 'product-caption' },
    h(
      'h4',
      { className: 'product-brand' },
      h(
        'a',
        {
          href: `product-details.html?id=${product.id}`,
          className: 'product-detail-link',
          ...dataAttrs({ productId: product.id }),
        },
        product.brand,
      ),
    ),
    h(
      'h4',
      { className: 'product-name' },
      h(
        'a',
        {
          href: `product-details.html?id=${product.id}`,
          className: 'product-detail-link',
          ...dataAttrs({ productId: product.id }),
        },
        product.model,
      ),
    ),
    h(
      'div',
      { className: 'price-box' },
      h('span', { className: 'new-price' }, product.formattedPrice),
    ),
    h(
      'div',
      {
        className: classNames('product-stock', {
          'in-stock': product.inStock,
          'out-of-stock': !product.inStock,
        }),
      },
      product.inStock ? 'В наличии' : 'Нет в наличии',
    ),
  )

/**
 * Product card template (grid view)
 */
export const ProductCard = (product) =>
  h(
    'div',
    { className: 'single-product-area mt-30' },
    ProductImage(product),
    ProductCaption(product),
  )

// ============================================================================
// PRODUCT LIST TEMPLATES
// ============================================================================

/**
 * Product meta information
 */
export const ProductMeta = (product) =>
  h(
    'div',
    { className: 'product-meta' },
    h('span', { className: 'product-brand' }, `Бренд: ${product.brand}`),
    h('span', { className: 'product-model' }, `Модель: ${product.model}`),
    h(
      'span',
      { className: 'product-category' },
      `Категория: ${getCategoryName(product.category)}`,
    ),
  )

/**
 * Product actions for list view
 */
export const ProductActions = (product) =>
  h(
    'div',
    { className: 'block2' },
    h(
      'ul',
      { className: 'stock-cont' },
      h(
        'li',
        { className: 'product-sku' },
        'Артикул: ',
        h('span', {}, product.sku),
      ),
      h(
        'li',
        { className: 'product-stock-status' },
        'Наличие: ',
        h(
          'span',
          {
            className: classNames({
              'in-stock': product.inStock,
              'out-of-stock': !product.inStock,
            }),
          },
          product.inStock ? 'В наличии' : 'Нет в наличии',
        ),
      ),
    ),
    h(
      'div',
      { className: 'product-button' },
      h(
        'ul',
        { className: 'actions' },
        h(
          'li',
          { className: 'add-to-wishlist' },
          h(
            'a',
            {
              href: 'wishlist.html',
              className: 'add_to_wishlist',
              ...dataAttrs({ productId: product.id }),
            },
            h('i', { className: 'icon-heart' }),
            ' В избранное',
          ),
        ),
      ),
      when(product.inStock, AddToCartButton(product)),
      when(!product.inStock, NotifyButton(product)),
    ),
  )

/**
 * Add to cart button
 */
export const AddToCartButton = (product) =>
  h(
    'div',
    { className: 'add-to-cart' },
    h(
      'div',
      { className: 'product-button-action' },
      h(
        'a',
        {
          href: '#',
          className: 'add-to-cart-btn',
          ...dataAttrs({ productId: product.id }),
        },
        'Заказать товар',
      ),
    ),
  )

/**
 * Notify when available button
 */
export const NotifyButton = (product) =>
  h(
    'div',
    { className: 'notify-available' },
    h(
      'div',
      { className: 'product-button-action' },
      h(
        'a',
        {
          href: '#',
          className: 'notify-btn',
          ...dataAttrs({ productId: product.id }),
        },
        'Уведомить о поступлении',
      ),
    ),
  )

/**
 * Product list item template
 */
export const ProductListItem = (product) =>
  h(
    'div',
    { className: 'shop-product-list-wrap' },
    h(
      'div',
      { className: 'row product-layout-list mt-30' },
      h(
        'div',
        { className: 'col-lg-3 col-md-3' },
        h(
          'div',
          { className: 'single-product' },
          h(
            'div',
            { className: 'product-image' },
            h(
              'a',
              {
                href: `product-details.html?id=${product.id}`,
                className: 'product-detail-link',
                ...dataAttrs({ productId: product.id }),
              },
              h('img', {
                src: product.imageUrl,
                alt: product.name,
                loading: 'lazy',
              }),
            ),
          ),
        ),
      ),
      h(
        'div',
        { className: 'col-lg-6 col-md-6' },
        h(
          'div',
          { className: 'product-content-list text-left' },
          h(
            'h4',
            h(
              'a',
              {
                href: `product-details.html?id=${product.id}`,
                className: 'product-detail-link product-name',
                ...dataAttrs({ productId: product.id }),
              },
              product.name,
            ),
          ),
          ProductMeta(product),
          h(
            'div',
            { className: 'price-box' },
            h('span', { className: 'new-price' }, product.formattedPrice),
          ),
          h(
            'div',
            {
              className: classNames('product-stock', {
                'in-stock': product.inStock,
                'out-of-stock': !product.inStock,
              }),
            },
            product.inStock ? '✓ В наличии' : '✗ Нет в наличии',
          ),
        ),
      ),
      h('div', { className: 'col-lg-3 col-md-3' }, ProductActions(product)),
    ),
  )

// ============================================================================
// STATE TEMPLATES
// ============================================================================

/**
 * Loading state template
 */
export const LoadingState = () =>
  h(
    'div',
    {
      className: 'text-center loading-products',
      style: { width: '100%', padding: '3rem' },
    },
    h(
      'div',
      { className: 'loading-spinner' },
      h(
        'div',
        {
          className: 'spinner-border text-primary',
          role: 'status',
        },
        h('span', { className: 'visually-hidden' }, 'Загрузка...'),
      ),
    ),
    h(
      'div',
      {
        style: { color: '#666', fontSize: '1.2rem', marginTop: '1rem' },
      },
      'Загрузка каталога товаров...',
    ),
  )

/**
 * Error state template
 */
export const ErrorState = curry((message, onRetry, onShowSamples) =>
  h(
    'div',
    {
      className: 'text-center error-products',
      style: { width: '100%', padding: '3rem' },
    },
    h(
      'div',
      {
        className: 'error-icon',
        style: { color: '#dc3545', fontSize: '3rem', marginBottom: '1rem' },
      },
      h('i', { className: 'fas fa-exclamation-triangle' }),
    ),
    h(
      'h4',
      {
        style: { color: '#dc3545', marginBottom: '1rem' },
      },
      'Ошибка загрузки каталога',
    ),
    h(
      'div',
      {
        style: { color: '#666', fontSize: '1.1rem', marginBottom: '2rem' },
      },
      message,
    ),
    h(
      'div',
      { className: 'error-actions' },
      h(
        'button',
        {
          onClick: onRetry,
          className: 'btn btn-primary me-2',
        },
        h('i', { className: 'fas fa-refresh' }),
        ' Попробовать снова',
      ),
      h(
        'button',
        {
          onClick: onShowSamples,
          className: 'btn btn-outline-secondary',
        },
        h('i', { className: 'fas fa-eye' }),
        ' Показать образцы',
      ),
    ),
  ),
)

/**
 * Empty state template
 */
export const EmptyState = (filters = {}) => {
  const hasFilters = Object.keys(filters).some(
    (key) =>
      filters[key] &&
      (Array.isArray(filters[key]) ? filters[key].length > 0 : true),
  )

  return h(
    'div',
    {
      className: 'text-center empty-products',
      style: { padding: '3rem' },
    },
    h(
      'div',
      {
        className: 'empty-icon',
        style: { color: '#6c757d', fontSize: '3rem', marginBottom: '1rem' },
      },
      h('i', { className: 'fas fa-search' }),
    ),
    h(
      'h4',
      {
        style: { color: '#6c757d', marginBottom: '1rem' },
      },
      hasFilters ? 'Товары не найдены' : 'Каталог пуст',
    ),
    h(
      'p',
      {
        style: { color: '#868e96', fontSize: '1.1rem', marginBottom: '2rem' },
      },
      hasFilters
        ? 'Попробуйте изменить параметры поиска или фильтров'
        : 'В данный момент товары отсутствуют',
    ),
    when(
      hasFilters,
      h(
        'button',
        {
          onClick: () => window.productCatalog?.clearFilters?.(),
          className: 'btn btn-outline-primary',
        },
        h('i', { className: 'fas fa-times' }),
        ' Сбросить фильтры',
      ),
    ),
  )
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get category display name
 */
export const getCategoryName = (category) => {
  const categoryNames = {
    watch: 'Часы',
    jewelry: 'Украшения',
    accessories: 'Аксессуары',
  }
  return categoryNames[category] || category
}

/**
 * Product count display
 */
export const ProductCount = (total, start, end) =>
  h(
    'div',
    { className: 'product-count' },
    `Показано ${start}-${end} из ${total} товаров`,
  )

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  // Product card templates
  ProductCard,
  ProductImage,
  ProductCaption,
  ActionLinks,

  // Product list templates
  ProductListItem,
  ProductMeta,
  ProductActions,
  AddToCartButton,
  NotifyButton,

  // State templates
  LoadingState,
  ErrorState,
  EmptyState,

  // Utility templates
  ProductCount,
  getCategoryName,
}
