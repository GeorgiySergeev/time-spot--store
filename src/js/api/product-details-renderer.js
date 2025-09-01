// Product details page rendering functionality

import { getProductById } from './api.js'

const BASE_IMAGE_URL = 'https://websphere.miy.link/admin/storage/uploads'

// Get product ID from URL parameters
export const getProductIdFromUrl = () => {
  const urlParams = new URLSearchParams(window.location.search)
  const productId = urlParams.get('id')

  if (!productId) {
    console.warn('No product ID found in URL parameters')
    return null
  }

  console.log('Product ID from URL:', productId)
  return productId
}

// Render single product details
export const renderProductDetails = async (productId) => {
  try {
    // showLoadingState()

    // Fetch product data
    const productData = await getProductById(productId)
    console.log('Fetched product data:', productData)

    // Normalize the product data (handle API response structure)
    const normalizedData = normalizeProductData(productData)

    if (!normalizedData) {
      throw new Error('Product not found or invalid data structure')
    }

    // Render the product details
    updateProductInfo(normalizedData)
    updateProductImages(normalizedData)
    updateProductActions(normalizedData)

    console.log('Successfully rendered product details for ID:', productId)
  } catch (error) {
    console.error('Error rendering product details:', error)
    showErrorState(error.message)
  }
}

// Normalize single product data
const normalizeProductData = (data) => {
  console.log('Normalizing product data:', data)

  if (!data) return null

  // Handle different API response structures
  if (Array.isArray(data) && data.length > 0) {
    return data[0] // Take first item if array
  }

  if (data && typeof data === 'object') {
    // Check for common wrapper properties
    if (data.data && typeof data.data === 'object') {
      return data.data
    }

    if (data.product && typeof data.product === 'object') {
      return data.product
    }

    if (data.item && typeof data.item === 'object') {
      return data.item
    }

    // If it has product properties, use as is
    if (data.id || data._id || data.model || data.name || data.title) {
      return data
    }
  }

  console.warn('Unexpected product data structure:', data)
  return null
}

// Update product information section
const updateProductInfo = (product) => {
  // Update product name
  const nameElement = document.querySelector('.product-info h3')
  if (nameElement) {
    nameElement.textContent =
      product.model || product.name || product.title || 'Product Name'
  }

  // Update price
  const newPriceElement = document.querySelector('.price-box .new-price')
  if (newPriceElement) {
    newPriceElement.textContent = formatPrice(
      product.price || product.currentPrice,
    )
  }

  const oldPriceElement = document.querySelector('.price-box .old-price')
  if (oldPriceElement && (product.oldPrice || product.originalPrice)) {
    oldPriceElement.textContent = formatPrice(
      product.oldPrice || product.originalPrice,
    )
    oldPriceElement.style.display = 'inline'
  } else if (oldPriceElement) {
    oldPriceElement.style.display = 'none'
  }

  // Update description
  const descriptionElement = document.querySelector('.product-info p')
  if (descriptionElement) {
    descriptionElement.textContent =
      product.description ||
      product.shortDescription ||
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam fringilla augue nec est tristique auctor.'
  }

  // Update rating
  updateProductRating(product.rating || product.stars || 5)

  // Update product details
  updateProductDetails(product)

  // Update breadcrumb
  updateBreadcrumb(
    product.model || product.name || product.title || 'Product Details',
  )
}

// Update product images
const updateProductImages = (product) => {
  // Update main product image
  const mainImageElement = document.querySelector('#main-product-image')
  if (mainImageElement && product.img && product.img.path) {
    const imageUrl = `${BASE_IMAGE_URL}/${product.img.path}`
    mainImageElement.src = imageUrl
    mainImageElement.alt = product.model || 'Product Image'
  }

  // Update gallery images if available
  updateImageGallery(product)
}

// Update image gallery
const updateImageGallery = (product) => {
  const thumbnailContainer = document.querySelector('.product-nav')
  if (!thumbnailContainer) return

  // Clear existing thumbnails
  thumbnailContainer.innerHTML = ''

  // Add main image as first thumbnail
  if (product.img && product.img.path) {
    const imageUrl = `${BASE_IMAGE_URL}/${product.img.path}`
    createThumbnail(
      imageUrl,
      0,
      thumbnailContainer,
      product.model || 'Product Image',
    )
  }

  // Add additional images if available
  if (product.images && Array.isArray(product.images)) {
    product.images.forEach((image, index) => {
      const imageUrl = image.path
        ? `${BASE_IMAGE_URL}/${image.path}`
        : image.url || image
      createThumbnail(
        imageUrl,
        index + 1,
        thumbnailContainer,
        `Product Image ${index + 2}`,
      )
    })
  }
}

// Create thumbnail element
const createThumbnail = (imageUrl, index, container, altText) => {
  const thumbnailDiv = document.createElement('div')
  thumbnailDiv.className = `pro-nav-thumb ${index === 0 ? 'active' : ''}`
  thumbnailDiv.setAttribute('data-index', index)

  const img = document.createElement('img')
  img.src = imageUrl
  img.alt = altText

  const lightboxLink = document.createElement('a')
  lightboxLink.href = imageUrl
  lightboxLink.className = 'glightbox hidden-gallery-item'
  lightboxLink.setAttribute('data-gallery', 'product-gallery')
  lightboxLink.setAttribute(
    'data-glightbox',
    `title: ${altText}; description: High quality product view`,
  )

  thumbnailDiv.appendChild(img)
  thumbnailDiv.appendChild(lightboxLink)
  container.appendChild(thumbnailDiv)

  // Add click handler to change main image
  thumbnailDiv.addEventListener('click', () => {
    const mainImage = document.querySelector('#main-product-image')
    if (mainImage) {
      mainImage.src = imageUrl
      mainImage.alt = altText
    }

    // Update active thumbnail
    container
      .querySelectorAll('.pro-nav-thumb')
      .forEach((thumb) => thumb.classList.remove('active'))
    thumbnailDiv.classList.add('active')
  })
}

// Update product rating
const updateProductRating = (rating) => {
  const ratingContainer = document.querySelector('.product-rating ul')
  if (!ratingContainer) return

  const stars = ratingContainer.querySelectorAll('li')
  stars.forEach((star, index) => {
    const icon = star.querySelector('i')
    if (icon) {
      if (index < rating) {
        icon.className = 'icon-star'
        star.classList.remove('bad-reting')
      } else {
        icon.className = 'icon-star'
        star.classList.add('bad-reting')
      }
    }
  })

  // Update review count if available
  const reviewCount = document.querySelector('.product-rating .count')
  if (reviewCount) {
    reviewCount.textContent = '1' // Default, could be dynamic
  }
}

// Update product details (SKU, categories, etc.)
const updateProductDetails = (product) => {
  // Update SKU
  const skuElement = document.querySelector('.product-sku span')
  if (skuElement) {
    skuElement.textContent = product.sku || product.id || 'P006'
  }

  // Update categories (if available)
  const categoriesElement = document.querySelector('.product-stock-status')
  if (categoriesElement && product.categories) {
    const categoryLinks = product.categories
      .map((cat) => `<a href="#">${cat}</a>`)
      .join(', ')
    categoriesElement.innerHTML = `Категории: ${categoryLinks}`
  }
}

// Update product actions (add to cart, wishlist, etc.)
const updateProductActions = (product) => {
  // Update add to cart form with product data
  const addToCartForm = document.querySelector('.cart-quantity')
  if (addToCartForm) {
    addToCartForm.setAttribute('data-product-id', product.id || product._id)
  }

  // Update wishlist and compare links with product data
  const wishlistLink = document.querySelector('.add_to_wishlist')
  const compareLink = document.querySelector('.compare-button a')

  if (wishlistLink) {
    wishlistLink.href = `wishlist.html?add=${product.id || product._id}`
  }

  if (compareLink) {
    compareLink.href = `compare.html?add=${product.id || product._id}`
  }
}

// Update breadcrumb with product name
const updateBreadcrumb = (productName) => {
  const breadcrumbActive = document.querySelector('.breadcrumb-item.active')
  if (breadcrumbActive) {
    breadcrumbActive.textContent = productName
  }
}

// Format price helper
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

// Show loading state
const showLoadingState = () => {
  const container = document.querySelector('.product-details-inner')
  if (container) {
    const loadingDiv = document.createElement('div')
    loadingDiv.className = 'loading-overlay'
    loadingDiv.innerHTML = `
      <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                  background: rgba(0,0,0,0.5); display: flex; align-items: center;
                  justify-content: center; z-index: 9999;">
        <div style="background: white; padding: 2rem; border-radius: 8px; text-align: center;">
          <div style="color: #333; font-size: 1.2rem; margin-bottom: 1rem;">
            <i class="fa fa-spinner fa-spin"></i> Загрузка товара...
          </div>
        </div>
      </div>
    `
    document.body.appendChild(loadingDiv)
  }
}

// Show error state
const showErrorState = (errorMessage) => {
  // Remove loading overlay
  const loadingOverlay = document.querySelector('.loading-overlay')
  if (loadingOverlay) {
    loadingOverlay.remove()
  }

  const container = document.querySelector('.product-details-inner')
  if (container) {
    container.innerHTML = `
      <div class="col-12 text-center" style="padding: 3rem;">
        <div style="color: #ff6b6b; font-size: 1.4rem; margin-bottom: 1rem;">
          <i class="fa fa-exclamation-triangle"></i> Не удалось загрузить товар
        </div>
        <div style="color: #666; font-size: 1.1rem; margin-bottom: 2rem;">
          ${errorMessage}
        </div>
        <button onclick="window.location.reload()"
                style="background: #007bff; color: white; border: none;
                       padding: 1rem 2rem; border-radius: 4px; cursor: pointer;">
          <i class="fa fa-refresh"></i> Попробовать снова
        </button>
        <a href="shop.html"
           style="background: #28a745; color: white; text-decoration: none;
                  padding: 1rem 2rem; border-radius: 4px; margin-left: 1rem; display: inline-block;">
          <i class="fa fa-arrow-left"></i> Вернуться к товарам
        </a>
      </div>
    `
  }
}

// Initialize product details page
export const initProductDetailsPage = () => {
  // Remove loading overlay when page loads
  const loadingOverlay = document.querySelector('.loading-overlay')
  if (loadingOverlay) {
    loadingOverlay.remove()
  }

  const productId = getProductIdFromUrl()

  if (!productId) {
    showErrorState('Не указан ID товара в URL')
    return
  }

  console.log('Initializing product details page for ID:', productId)
  renderProductDetails(productId)
}

// Auto-initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Only run on product-details page
  if (
    window.location.pathname.includes('product-details') ||
    document.querySelector('.product-details-inner')
  ) {
    initProductDetailsPage()
  }
})
