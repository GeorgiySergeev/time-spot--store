/**
 * Product Page Renderer for Watches
 * Functional approach using ES6 standards with separate markup functions
 */

import { getProductById } from '../api/api.js'
import { formatPrice } from '../api/config.js'

/**
 * Create product title markup
 * @param {Object} product - Product data
 * @returns {string} - HTML markup for product title
 */
export const createProductTitle = (product) => {
  return `<h3 class="product-title">${product.model || product.name || 'Product Name'}</h3>`
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
 * Create main product image markup
 * @param {Object} product - Product data
 * @returns {string} - HTML markup for main product image
 */
export const createMainProductImage = (product) => {
  const imageUrl =
    product.imageUrl ||
    product.images?.[0] ||
    '/img/products/default-450x450.jpg'
  const altText = product.model || product.name || 'Product Image'

  return `
    <img src="${imageUrl}" alt="${altText}" id="main-product-image" />
    <a href="${imageUrl}" class="glightbox zoom-icon"
       data-gallery="product-gallery"
       data-glightbox="title: ${altText}; description: High quality product view">
      <i class="fa fa-search"></i>
    </a>
  `
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
    <div class="swiper-slide">
      <div class="pro-nav-thumb ${index === 0 ? 'active' : ''}" data-index="${index}">
        <img src="${imageSrc}" alt="${altText}" />
        <a href="${imageSrc}" class="glightbox hidden-gallery-item"
           data-gallery="product-gallery"
           data-glightbox="title: ${altText}; description: High quality product view"></a>
      </div>
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

  // Create thumbnails
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
        <div class="swiper-slide">
          <div class="pro-large-img img-zoom">
            ${createMainProductImage(product)}
          </div>
        </div>
      </div>
    </div>

    <!-- Thumbnail Navigation Swiper -->
    <div class="swiper product-thumbs-swiper">
      <div class="swiper-wrapper">
        ${thumbnails}
      </div>
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
              <a href="#"><i class="icon-star"></i></a>
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
          <div class="quantity">
            <div class="cart-plus-minus">
              <input type="number" class="input-text" name="quantity" value="1" title="Qty" />
            </div>
          </div>
          <button class="add-to-cart" type="submit">
            Добавить в корзину
          </button>
        </form>
      </div>
      <ul class="single-add-actions">
        <li class="add-to-wishlist">
          <a href="wishlist.html" class="add_to_wishlist">
            <i class="icon-heart"></i>
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
          <li><a href="#"><i class="fa fa-facebook"></i></a></li>
          <li><a href="#"><i class="fa fa-twitter"></i></a></li>
          <li><a href="#"><i class="fa fa-pinterest"></i></a></li>
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

      // Bind gallery events after rendering
      bindGalleryEvents()
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
 */
const bindGalleryEvents = () => {
  // Thumbnail click events
  const thumbnails = document.querySelectorAll('.pro-nav-thumb')

  thumbnails.forEach((thumb) => {
    thumb.addEventListener('click', (e) => {
      e.preventDefault()
      const index = parseInt(thumb.getAttribute('data-index'))
      switchToImage(index)
    })
  })

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    const container = document.querySelector('.product-details-inner')
    if (container && isInViewport(container)) {
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault()
          previousImage()
          break
        case 'ArrowRight':
          e.preventDefault()
          nextImage()
          break
      }
    }
  })
}

/**
 * Switch to a specific image in the gallery
 * @param {number} index - Image index
 */
const switchToImage = (index) => {
  const thumbnails = document.querySelectorAll('.pro-nav-thumb')
  const mainImage = document.getElementById('main-product-image')
  const zoomLink = document.querySelector('.zoom-icon')

  if (!mainImage || index < 0 || index >= thumbnails.length) return

  // Get image source from thumbnail
  const thumbnailImg = thumbnails[index].querySelector('img')
  if (thumbnailImg) {
    mainImage.src = thumbnailImg.src
    mainImage.alt = thumbnailImg.alt

    // Update zoom link
    if (zoomLink) {
      zoomLink.href = thumbnailImg.src
      zoomLink.setAttribute(
        'data-glightbox',
        `title: ${thumbnailImg.alt}; description: High quality product view`,
      )
    }
  }

  // Update active states
  updateActiveStates(index)
}

/**
 * Update active states for thumbnails
 * @param {number} activeIndex - Active thumbnail index
 */
const updateActiveStates = (activeIndex) => {
  const thumbnails = document.querySelectorAll('.pro-nav-thumb')

  thumbnails.forEach((thumb, index) => {
    if (index === activeIndex) {
      thumb.classList.add('active')
    } else {
      thumb.classList.remove('active')
    }
  })
}

/**
 * Navigate to next image
 */
const nextImage = () => {
  const thumbnails = document.querySelectorAll('.pro-nav-thumb')
  const activeThumb = document.querySelector('.pro-nav-thumb.active')
  let currentIndex = Array.from(thumbnails).indexOf(activeThumb)

  const nextIndex = (currentIndex + 1) % thumbnails.length
  switchToImage(nextIndex)
}

/**
 * Navigate to previous image
 */
const previousImage = () => {
  const thumbnails = document.querySelectorAll('.pro-nav-thumb')
  const activeThumb = document.querySelector('.pro-nav-thumb.active')
  let currentIndex = Array.from(thumbnails).indexOf(activeThumb)

  const prevIndex = (currentIndex - 1 + thumbnails.length) % thumbnails.length
  switchToImage(prevIndex)
}

/**
 * Check if element is in viewport
 * @param {Element} element - Element to check
 * @returns {boolean} - Whether element is in viewport
 */
const isInViewport = (element) => {
  const rect = element.getBoundingClientRect()
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <=
      (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  )
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
  createMainProductImage,
  createThumbnail,
  createProductGallery,
  createProductInfo,
  createLoadingState,
  createErrorState,
}
