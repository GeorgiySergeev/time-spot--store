// Dynamic Product Details Page Renderer
// Handles dynamic rendering of Single Product Details Page with thumbnail slider functionality

import { getWatchProductById } from './api.js'
import {
  createProductGallery,
  createMainImagesSwiper,
  createThumbnailSwiper,
  createProductInfo,
  createProductDescriptionTabs,
  createBreadcrumb,
  createProductLoadingState,
  createProductErrorState,
  createFallbackNotice,
  createFallbackProduct,
} from './product-details-templates.js'

const BASE_IMAGE_URL = 'https://websphere.miy.link/admin/storage/uploads'

// Swiper instances for product gallery
let mainSwiper = null
let thumbsSwiper = null

// Pure function to normalize product data
const normalizeProductData = (data) => {
  if (!data) return null

  // Handle different API response structures
  const product = Array.isArray(data)
    ? data[0]
    : data.data || data.product || data.item || data

  // Validate product has essential properties
  if (!product || typeof product !== 'object') return null
  if (
    !(
      product.id ||
      product._id ||
      product.model ||
      product.name ||
      product.title
    )
  )
    return null

  return product
}

// Higher-order function for error handling
const withErrorHandling =
  (fn) =>
  async (...args) => {
    try {
      return await fn(...args)
    } catch (error) {
      console.error('Error in function:', fn.name, error)
      throw error
    }
  }

// Pure functions for DOM updates
const updateElement = (selector, content) => {
  const element = document.querySelector(selector)
  if (element) {
    if (typeof content === 'string') {
      element.innerHTML = content
    } else {
      element.textContent = content
    }
  }
  return element
}

const updateAttribute = (selector, attribute, value) => {
  const element = document.querySelector(selector)
  if (element) {
    element.setAttribute(attribute, value)
  }
  return element
}

const updateStyle = (selector, styles) => {
  const element = document.querySelector(selector)
  if (element) {
    Object.assign(element.style, styles)
  }
  return element
}

// Initialize Swiper instances for product gallery
const initializeProductGallery = (product) => {
  console.log('🎨 Initializing product gallery swipers...')

  // Destroy existing swipers if they exist
  if (mainSwiper) {
    mainSwiper.destroy(true, true)
  }
  if (thumbsSwiper) {
    thumbsSwiper.destroy(true, true)
  }

  // Initialize main images swiper
  const mainSwiperEl = document.querySelector('#product_page_slider')
  if (mainSwiperEl) {
    mainSwiper = new Swiper('#product_page_slider', {
      loop: true,
      spaceBetween: 10,
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      thumbs: {
        swiper: thumbsSwiper,
      },
      on: {
        slideChange: function () {
          console.log('Main swiper slide changed to:', this.activeIndex)
        },
      },
    })
  }

  // Initialize thumbnail swiper
  const thumbsSwiperEl = document.querySelector('.product-thumbs-swiper')
  if (thumbsSwiperEl) {
    thumbsSwiper = new Swiper('.product-thumbs-swiper', {
      spaceBetween: 10,
      slidesPerView: 4,
      freeMode: true,
      watchSlidesProgress: true,
      on: {
        click: function (swiper, event) {
          const clickedIndex = swiper.clickedIndex
          if (clickedIndex !== undefined && mainSwiper) {
            mainSwiper.slideTo(clickedIndex)
            console.log(
              'Thumbnail clicked, main swiper slide to:',
              clickedIndex,
            )
          }
        },
      },
    })
  }

  // Connect the swipers
  if (mainSwiper && thumbsSwiper) {
    mainSwiper.thumbs.swiper = thumbsSwiper
    thumbsSwiper.thumbs.swiper = mainSwiper
  }

  console.log('✅ Product gallery swipers initialized')
}

// Update product images and gallery
const updateProductImages = (product) => {
  console.log('🖼️ Updating product images...')

  const gallery = createProductGallery(product)

  // Update main swiper content
  const mainSwiperWrapper = document.querySelector(
    '#product_page_slider .swiper-wrapper',
  )
  if (mainSwiperWrapper) {
    mainSwiperWrapper.innerHTML = gallery.gallery
      .map(
        (image, index) => `
      <div class="swiper-slide">
        <div class="pro-large-img img-zoom">
          <img
            src="${image.src}"
            alt="${image.alt}"
            id="main-product-image" />
          <a
            href="${image.src}"
            class="glightbox zoom-icon"
            data-gallery="product-gallery"
            data-glightbox="title: ${image.title}; description: ${image.description}">
            <i class="fa fa-search"></i>
          </a>
        </div>
      </div>
    `,
      )
      .join('')
  }

  // Update thumbnail swiper content
  const thumbsSwiperWrapper = document.querySelector(
    '.product-thumbs-swiper .swiper-wrapper',
  )
  if (thumbsSwiperWrapper) {
    thumbsSwiperWrapper.innerHTML = gallery.gallery
      .map((image, index) => {
        // Use default thumbnail image for thumbnails
        const thumbnailSrc =
          gallery.gallery.length === 1 &&
          image.src.includes('single-product-item.jpg')
            ? '/img/default/reviewer-60x60.jpg'
            : image.src

        return `
        <div class="swiper-slide">
          <div class="pro-nav-thumb">
            <img
              src="${thumbnailSrc}"
              alt="${image.alt}" />
            <a
              href="${image.src}"
              class="glightbox hidden-gallery-item"
              data-gallery="product-gallery"
              data-glightbox="title: ${image.title}; description: ${image.description}"></a>
          </div>
        </div>
      `
      })
      .join('')
  }

  // Reinitialize swipers with new content
  setTimeout(() => {
    initializeProductGallery(product)
  }, 100)
}

// Update product rating
const updateProductRating = (rating) => {
  const stars = document.querySelectorAll('.product-rating ul li')
  stars.forEach((star, index) => {
    const icon = star.querySelector('i')
    if (icon) {
      icon.className = 'icon-star'
      star.classList.toggle('bad-reting', index >= rating)
    }
  })
}

// Update product actions
const updateProductActions = (product) => {
  updateAttribute(
    '.cart-quantity',
    'data-product-id',
    product.id || product._id,
  )
  updateAttribute(
    '.add_to_wishlist',
    'href',
    `wishlist.html?add=${product.id || product._id}`,
  )
  updateAttribute(
    '.add_to_wishlist',
    'data-product-id',
    product.id || product._id,
  )
  updateAttribute(
    '.compare-button a',
    'href',
    `compare.html?add=${product.id || product._id}`,
  )
  updateAttribute(
    '.compare-button a',
    'data-product-id',
    product.id || product._id,
  )
}

// Update breadcrumb
const updateBreadcrumb = (productName) => {
  updateElement('.breadcrumb-item.active', productName)
}

// Format price utility
const formatPrice = (price) => {
  if (typeof price === 'number') return `$${price.toFixed(2)}`
  if (typeof price === 'string') {
    const numPrice = parseFloat(price)
    if (!isNaN(numPrice)) return `$${numPrice.toFixed(2)}`
    return price
  }
  return '$0.00'
}

// State management functions
const showLoadingState = () => {
  const container = document.querySelector('.product-details-inner')
  if (!container) return

  const existingLoader = container.querySelector('.product-loading')
  if (existingLoader) return

  container.style.position = 'relative'
  container.insertAdjacentHTML('beforeend', createProductLoadingState())
}

const removeLoadingState = () => {
  document
    .querySelectorAll('.product-loading, .loading-overlay')
    .forEach((el) => el.remove())
}

const showErrorState = (errorMessage) => {
  removeLoadingState()
  const container = document.querySelector('.product-details-inner')
  if (container) {
    container.innerHTML = createProductErrorState(errorMessage)
  }
}

const showFallbackData = (productId) => {
  const fallbackProduct = createFallbackProduct(productId)

  // Show fallback notice
  const container = document.querySelector('.product-details-inner')
  if (container) {
    container.insertAdjacentHTML('afterbegin', createFallbackNotice())
  }

  // Apply all updates
  updateProductDetails(fallbackProduct)
}

// Main function to update all product details
const updateProductDetails = (product) => {
  console.log('🔄 Updating product details for:', product.model || product.name)

  // Update product info section
  updateElement('.product-details-view-content', createProductInfo(product))

  // Update breadcrumb
  updateBreadcrumb(product.model || product.name || 'Product Details')

  // Update product images and gallery
  updateProductImages(product)

  // Update product rating
  updateProductRating(product.rating || product.stars || 5)

  // Update product actions
  updateProductActions(product)

  // Update description tabs
  const descriptionArea = document.querySelector('.product-description-area')
  if (descriptionArea) {
    descriptionArea.outerHTML = createProductDescriptionTabs(product)
  }

  // Reinitialize lightbox for new images
  if (typeof GLightbox !== 'undefined') {
    try {
      // Create new GLightbox instance for updated images
      const lightbox = GLightbox({
        selector: '.glightbox',
        touchNavigation: true,
        loop: true,
        autoplayVideos: false,
        zoomable: true,
        draggable: true,
        openEffect: 'zoom',
        closeEffect: 'fade',
        slideEffect: 'slide',
        moreText: 'Подробнее',
        moreLength: 60,
        cssEfects: {
          fade: { in: 'fadeIn', out: 'fadeOut' },
          zoom: { in: 'zoomIn', out: 'zoomOut' },
        },
      })
      console.log('✅ GLightbox reinitialized for product images')
    } catch (error) {
      console.warn('GLightbox reinitialization failed:', error)
    }
  }

  console.log('✅ Product details updated successfully')
}

// Main render function
export const renderProductDetails = withErrorHandling(async (productId) => {
  console.log('🔍 Fetching product details for ID:', productId)

  showLoadingState()

  try {
    const productData = await getWatchProductById(productId)
    const normalizedData = normalizeProductData(productData)

    if (!normalizedData) {
      throw new Error('Product not found or invalid data structure')
    }

    removeLoadingState()

    // Update all product details
    updateProductDetails(normalizedData)

    console.log('✅ Successfully rendered product details for ID:', productId)
  } catch (error) {
    console.error('❌ Error rendering product details:', error)
    removeLoadingState()

    // Handle different error types
    if (
      error.message.includes('Network Error') ||
      error.response?.status >= 500
    ) {
      console.log('🔄 API failed, showing fallback data')
      showFallbackData(productId)
    } else {
      showErrorState(error.message)
    }
  }
})

// Utility function to get product ID from URL
const getProductIdFromUrl = () => {
  const urlParams = new URLSearchParams(window.location.search)
  return urlParams.get('id') || urlParams.get('productId')
}

// Initialize product details page
export const initProductDetailsPage = () => {
  removeLoadingState()

  const productId = getProductIdFromUrl()

  if (!productId) {
    showErrorState('Не указан ID товара в URL')
    return
  }

  console.log('Initializing product details page for ID:', productId)
  renderProductDetails(productId)
}

// Handle product card clicks to navigate to details page
export const handleProductCardClick = (productId) => {
  console.log('🔗 Navigating to product details for ID:', productId)

  // Store product ID in sessionStorage for navigation
  sessionStorage.setItem('selectedProductId', productId)

  // Navigate to product details page
  window.location.href = `product-details.html?id=${encodeURIComponent(productId)}`
}

// Initialize product card click handlers
export const initializeProductCardHandlers = () => {
  console.log('🎯 Initializing product card click handlers...')

  // Handle product card clicks
  document.addEventListener('click', (event) => {
    const productCard = event.target.closest(
      '.single-product-area, .single-product',
    )
    if (!productCard) return

    // Check if it's a product link
    const productLink = event.target.closest('a[href*="product-details"]')
    if (!productLink) return

    // Prevent default navigation
    event.preventDefault()

    // Extract product ID from various sources
    let productId = null

    // Try to get from data attributes
    const wishlistBtn = productCard.querySelector('[data-product-id]')
    if (wishlistBtn) {
      productId = wishlistBtn.getAttribute('data-product-id')
    }

    // Try to get from href
    if (!productId && productLink.href) {
      const url = new URL(productLink.href)
      productId =
        url.searchParams.get('id') || url.searchParams.get('productId')
    }

    // Try to get from parent elements
    if (!productId) {
      const parentCard = productCard.closest('[data-product-id]')
      if (parentCard) {
        productId = parentCard.getAttribute('data-product-id')
      }
    }

    if (productId) {
      handleProductCardClick(productId)
    } else {
      console.warn('Could not extract product ID from clicked card')
    }
  })

  console.log('✅ Product card click handlers initialized')
}

// Export for global access
if (typeof window !== 'undefined') {
  window.productDetailsRenderer = {
    renderProductDetails,
    initProductDetailsPage,
    handleProductCardClick,
    initializeProductCardHandlers,
  }
}
