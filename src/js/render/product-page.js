/**
 * Product Page Renderer for Watches
 * Functional approach using ES6 standards with separate markup functions
 */

import { getProductById } from '../api/api.js'
import { formatPrice } from '../api/config.js'
import { productPageSlider } from '../functions/swiper.js'
import { initLightbox } from '../functions/lightbox.js'

/**
 * Create product title markup
 * @param {Object} product - Product data
 * @returns {string} - HTML markup for product title
 */
export const createProductTitle = (product) => {
  return `<h3 class="product-title text-white">${product.model || product.name || 'Product Name'}</h3>`
}

/**
 * Create product price markup
 * @param {Object} product - Product data
 * @returns {string} - HTML markup for product price
 */
export const createProductPrice = (product) => {
  return `<span class="new-price">${formatPrice(product.price)}</span>`
}

/**
 * Create product description markup
 * @param {Object} product - Product data
 * @returns {string} - HTML markup for product description
 */
export const createProductDescription = (product) => {
  return `
    <div class="product-description-wrap">
      <div class="product_desc mb-30">
        <p>${product.description || 'Описание товара отсутствует.'}</p>
      </div>
    </div>
  `
}

/**
 * Create product SKU markup
 * @param {Object} product - Product data
 * @returns {string} - HTML markup for product SKU
 */
export const createProductSku = (product) => {
  return `<span>${product.sku || product.id || 'N/A'}</span>`
}

/**
 * Create product stock status markup
 * @param {Object} product - Product data
 * @returns {string} - HTML markup for product stock status
 */
export const createProductStock = (product) => {
  const inStock = product.inStock
  const statusText = inStock ? 'В наличии' : 'Нет в наличии'
  const statusClass = inStock ? 'in-stock' : 'out-of-stock'

  return `<span class="${statusClass}">${statusText}</span>`
}

/**
 * Create thumbnail markup
 * @param {string} imageSrc - Thumbnail image source
 * @param {string} altText - Thumbnail alt text
 * @param {number} index - Thumbnail index
 * @returns {string} - HTML markup for thumbnail
 */
export const createThumbnail = (imageSrc, altText, index) => {
  return `
    <div class="swiper-slide pro-nav-thumb">
      <img src="${imageSrc}" alt="${altText}" />
      <a href="${imageSrc}" class="glightbox hidden-gallery-item"
         data-gallery="product-gallery"
         data-glightbox="title: ${altText}; description: High quality product view"></a>
    </div>
  `
}

/**
 * Create product gallery markup
 * @param {Object} product - Product data
 * @returns {string} - HTML markup for product gallery
 */
export const createProductGallery = (product) => {
  const images = product.images || [
    product.imageUrl || '/img/products/default-450x450.jpg',
  ]

  // Create main images for main swiper
  const mainImages = images
    .map((img, index) => {
      const altText = `Product Image ${index + 1}`
      return `
        <div class="swiper-slide">
          <div class="pro-large-img img-zoom">
            <img src="${img}" alt="${altText}" id="main-product-image" />
            <a href="${img}" class="glightbox zoom-icon"
               data-gallery="product-gallery"
               data-glightbox="title: ${altText}; description: High quality product view">
              <i class="fa fa-search"></i>
            </a>
          </div>
        </div>
      `
    })
    .join('')

  // Create thumbnails for thumbs swiper
  const thumbnails = images
    .map((img, index) => {
      const altText = `Product Image ${index + 1}`
      return createThumbnail(img, altText, index)
    })
    .join('')

  return `
    <!-- Main Product Images Swiper -->
    <div class="swiper product-main-swiper" id="product_page_slider">
      <div class="swiper-wrapper">
        ${mainImages}
      </div>
    </div>

    <!-- Thumbnail Navigation Swiper -->
    <div class="swiper product-thumbs-swiper">
      <div class="swiper-wrapper">
        ${thumbnails}
      </div>
      <!-- Navigation buttons for thumbnails -->

      <!-- Scrollbar for thumbnails -->
      <div class="swiper-scrollbar swiper-scrollbar-thumbs"></div>
    </div>
  `
}

/**
 * Create product info section markup
 * @param {Object} product - Product data
 * @returns {string} - HTML markup for product info
 */
export const createProductInfo = (product) => {
  return `
    <div class="product-info">
      ${createProductTitle(product)}
      <div class="product-rating d-flex">
        <ul class="d-flex">
          ${Array.from(
            { length: 5 },
            (_, i) => `
            <li class="${i < (product.rating || 5) ? '' : 'bad-reting'}">
              <a href="#"><i class="icon-star text-warning"></i></a>
            </li>
          `,
          ).join('')}
        </ul>
        <a href="#reviews">(<span class="count">1</span> отзыв покупателя)</a>
      </div>
      <div class="price-box">
        ${createProductPrice(product)}
        ${product.oldPrice ? `<span class="old-price">${formatPrice(product.oldPrice)}</span>` : ''}
      </div>
      ${createProductDescription(product)}

      <div class="single-add-to-cart">
        <form action="#" class="cart-quantity d-flex">

          <button class="add-to-cart" type="submit">
            Купить
          </button>
        </form>
      </div>
      <ul class="single-add-actions">
        <li class="add-to-wishlist">
          <a href="wishlist.html" class="add_to_wishlist">
            <i class="icon-heart text-warning"></i>
            Добавить в избранное
          </a>
        </li>
        <li class="add-to-compare">
          <div class="compare-button">
            <a href="compare.html">
              <i class="icon-refresh"></i>
              Сравнить
            </a>
          </div>
        </li>
      </ul>
      <ul class="stock-cont">
        <li class="product-sku">
          Артикул:
          ${createProductSku(product)}
        </li>
        <li class="product-stock-status">
          Наличие: ${createProductStock(product)}
        </li>
      </ul>
      <div class="share-product-socail-area">
        <p>Поделиться товаром</p>
        <ul class="single-product-share">
          <li><a href="#"><i class="fa-brands fa-facebook"></i></i></a></li>
          <li><a href="#"><i class="fa-brands fa-instagram"></i></i></a></li>
          <li><a href="#"><i class="fa-brands fa-telegram"></i></i></a></li>
        </ul>
      </div>
    </div>
  `
}

/**
 * Create loading state markup
 * @returns {string} - HTML markup for loading state
 */
export const createLoadingState = () => {
  return `
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
}

/**
 * Create error state markup
 * @param {string} errorMessage - Error message
 * @returns {string} - HTML markup for error state
 */
export const createErrorState = (errorMessage) => {
  return `
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
        <a href="watch.html"
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
}

/**
 * Render product details page
 * @param {string} productId - Product ID to render
 */
export const renderProductDetails = async (productId) => {
  try {
    // Show loading state
    const container = document.querySelector('.product-details-inner')
    if (container) {
      container.innerHTML = createLoadingState()
    }

    // Fetch product data
    const product = await getProductById(productId)

    // Render product details
    if (container) {
      container.innerHTML = `
        <div class="col-lg-5 col-md-6">
          ${createProductGallery(product)}
        </div>
        <div class="col-lg-7 col-md-6">
          <div class="product-details-view-content">
            ${createProductInfo(product)}
          </div>
        </div>
      `

      // Swiper will handle all gallery interactions automatically
      bindGalleryEvents()

      // Initialize Swiper and Lightbox after DOM is updated
      setTimeout(() => {
        productPageSlider()
        initLightbox()
      }, 50)
    }

    console.log('Product details rendered successfully:', product)
  } catch (error) {
    console.error('Error rendering product details:', error)

    const container = document.querySelector('.product-details-inner')
    if (container) {
      container.innerHTML = createErrorState(
        'Не удалось загрузить информацию о товаре. Пожалуйста, попробуйте позже.',
      )
    }
  }
}

/**
 * Bind events for product gallery
 * Swiper handles all thumbnail interactions automatically
 */
const bindGalleryEvents = () => {
  // Swiper's thumbs functionality handles all interactions
  // No additional event binding needed
  console.log('Gallery events handled by Swiper')
}

// Auto-initialize when DOM is ready and we're on product details page
document.addEventListener('DOMContentLoaded', () => {
  if (window.location.pathname.includes('product-details')) {
    // Get product ID from URL
    const urlParams = new URLSearchParams(window.location.search)
    let productId = urlParams.get('id')

    // For testing purposes, use a default product ID if none is provided
    if (!productId) {
      // This is for development/testing only
      console.warn('No product ID provided, using default for testing')
      productId = '1' // Default test product ID
    }

    if (productId) {
      renderProductDetails(productId)
    } else {
      const container = document.querySelector('.product-details-inner')
      if (container) {
        container.innerHTML = createErrorState(
          'Идентификатор товара не указан в URL.',
        )
      }
    }
  }
})

export default {
  renderProductDetails,
  createProductTitle,
  createProductPrice,
  createProductDescription,
  createProductSku,
  createProductStock,
  createThumbnail,
  createProductGallery,
  createProductInfo,
  createLoadingState,
  createErrorState,
}
