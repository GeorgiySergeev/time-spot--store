/**
 * Product Details Page Functionality
 * Handles dynamic product loading and rendering
 */

import { getProductById } from '../api/api.js'
import {
  createModalLoadingState,
  createModalErrorState,
  getCategoryName,
} from '../api/templates.js'

const BASE_IMAGE_URL = 'https://websphere.miy.link/admin/storage/uploads'

/**
 * Initialize Product Details Page
 */
export const initProductDetailsPage = () => {
  try {
    console.log('🔧 Initializing Product Details Page...')

    // Get product ID from URL parameters
    const productId = getProductIdFromUrl()

    if (productId) {
      console.log(`📦 Loading product with ID: ${productId}`)
      loadProductDetails(productId)
    } else {
      console.log('ℹ️ No product ID in URL, using static content')
      // Initialize gallery for static content
      initializeProductGallery()
    }

    // Initialize page-specific functionality
    initializeProductActions()
    initializeProductTabs()
  } catch (error) {
    console.error('❌ Error initializing product details page:', error)
  }
}

/**
 * Get product ID from URL parameters
 */
const getProductIdFromUrl = () => {
  const urlParams = new URLSearchParams(window.location.search)
  return urlParams.get('id')
}

/**
 * Load and render product details dynamically
 */
const loadProductDetails = async (productId) => {
  try {
    console.log('🔄 Starting to load product details for ID:', productId)

    // Show loading state
    showLoadingState()

    console.log('🌐 Calling getProductById API...')
    // Fetch product data
    const product = await getProductById(productId)

    console.log('📦 API Response received:', product)

    if (!product) {
      console.error('❌ Product is null or undefined')
      throw new Error('Товар не найден')
    }

    console.log('🎨 Starting to render product content...')
    // Render product content
    await renderProductContent(product)

    console.log('🖼️ Initializing product gallery...')
    // Initialize components after content load
    initializeProductGallery()

    console.log('✅ Product details loaded successfully')
  } catch (error) {
    console.error('❌ Error loading product details:', error)
    console.error('❌ Error stack:', error.stack)

    // Try to show sample data as fallback
    console.log('🔄 Attempting to show sample product data as fallback...')
    try {
      const sampleProduct = createSampleProduct(productId)
      await renderProductContent(sampleProduct)
      initializeProductGallery()

      // Show warning message
      const warningMsg = document.createElement('div')
      warningMsg.className = 'alert alert-warning mt-3'
      warningMsg.innerHTML =
        '⚠️ Продукт загружен в режиме образца. Проверьте интернет-соединение.'

      const productInfo = document.querySelector('.product-info')
      if (productInfo) {
        productInfo.insertAdjacentElement('afterend', warningMsg)
      }

      console.log('✅ Sample product data loaded as fallback')
    } catch (fallbackError) {
      console.error('❌ Fallback also failed:', fallbackError)
      showErrorState(error.message || 'Ошибка загрузки товара')
    }
  }
}

/**
 * Create sample product data for fallback
 */
const createSampleProduct = (productId) => {
  const sampleProducts = {
    1: {
      id: '1',
      name: 'Rolex Submariner',
      brand: 'Rolex',
      model: 'Submariner',
      price: 8500,
      formattedPrice: '$8,500',
      imageUrl: '/img/product/product-01.png',
      description:
        'Classic luxury diving watch with exceptional craftsmanship and precision.',
      inStock: true,
      sku: 'rolex-submariner',
      category: 'watch',
    },
    2: {
      id: '2',
      name: 'Omega Speedmaster',
      brand: 'Omega',
      model: 'Speedmaster',
      price: 4200,
      formattedPrice: '$4,200',
      imageUrl: '/img/product/product-02.png',
      description:
        'Professional chronograph watch worn by astronauts on moon missions.',
      inStock: true,
      sku: 'omega-speedmaster',
      category: 'watch',
    },
    3: {
      id: '3',
      name: 'TAG Heuer Formula 1',
      brand: 'TAG Heuer',
      model: 'Formula 1',
      price: 1200,
      formattedPrice: '$1,200',
      imageUrl: '/img/product/product-03.png',
      description: 'Sport chronograph inspired by Formula 1 racing.',
      inStock: true,
      sku: 'tag-heuer-formula1',
      category: 'watch',
    },
  }

  return (
    sampleProducts[productId] || {
      id: productId,
      name: `Sample Product ${productId}`,
      brand: 'Sample Brand',
      model: `Model ${productId}`,
      price: 1000,
      formattedPrice: '$1,000',
      imageUrl: '/img/product/product-01.png',
      description:
        'This is a sample product displayed when the API is unavailable.',
      inStock: true,
      sku: `sample-${productId}`,
      category: 'watch',
    }
  )
}

/**
 * Render product content on the page
 */
const renderProductContent = async (product) => {
  console.log('📋 Starting renderProductContent with:', product)

  // Update page title
  const pageTitle = `${product.name || product.model || 'Product'} - Time Sphere`
  document.title = pageTitle
  console.log('📝 Updated page title to:', pageTitle)

  // Update breadcrumb
  const productName = product.name || product.model || 'Product Details'
  updateBreadcrumb(productName)
  console.log('🍞 Updated breadcrumb to:', productName)

  // Update product information
  console.log('ℹ️ Updating product info...')
  updateProductInfo(product)

  // Update product images
  console.log('🖼️ Updating product images...')
  updateProductImages(product)

  // Update product actions
  console.log('⚙️ Updating product actions...')
  updateProductActions(product)

  console.log('✅ Product content rendering completed')
}

/**
 * Update product information section
 */
const updateProductInfo = (product) => {
  console.log('📝 Updating product info for:', product.name)

  // Product title
  const titleElement = document.querySelector('.product-info h3')
  if (titleElement) {
    titleElement.textContent = product.name || product.model || 'Product Name'
    console.log('✅ Updated product title')
  } else {
    console.warn('⚠️ Product title element not found')
  }

  // Product price
  const newPriceElement = document.querySelector('.price-box .new-price')
  if (newPriceElement) {
    newPriceElement.textContent = product.formattedPrice || `$${product.price}`
    console.log('✅ Updated product price')
  } else {
    console.warn('⚠️ Product price element not found')
  }

  const oldPriceElement = document.querySelector('.price-box .old-price')
  if (oldPriceElement) {
    if (product.oldPrice || product.originalPrice) {
      oldPriceElement.textContent = `$${product.oldPrice || product.originalPrice}`
      oldPriceElement.style.display = 'inline'
    } else {
      oldPriceElement.style.display = 'none'
    }
  }

  // Product description
  const descriptionElement = document.querySelector('.product-info p')
  if (descriptionElement) {
    descriptionElement.textContent =
      product.description ||
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam fringilla augue nec est tristique auctor.'
    console.log('✅ Updated product description')
  } else {
    console.warn('⚠️ Product description element not found')
  }

  // Product rating
  updateProductRating(product.rating || 5)

  // Product details
  updateProductDetails(product)
}

/**
 * Update product images and gallery
 */
const updateProductImages = (product) => {
  console.log('🖼️ Updating product images for:', product.name)

  // Update main image
  const mainImage = document.getElementById('main-product-image')
  if (mainImage && product.imageUrl) {
    mainImage.src = product.imageUrl
    mainImage.alt = product.name || product.model || 'Product Image'
    console.log('✅ Updated main product image')
  } else {
    console.warn('⚠️ Main product image element not found or no image URL')
  }

  // Update gallery thumbnails
  updateImageGallery(product)
}

/**
 * Update image gallery thumbnails
 */
const updateImageGallery = (product) => {
  const thumbnailContainer = document.querySelector('.product-nav')
  if (!thumbnailContainer) {
    console.warn('⚠️ Thumbnail container not found')
    return
  }

  console.log('🖼️ Updating image gallery...')

  // Clear existing thumbnails
  thumbnailContainer.innerHTML = ''

  // Add main image as first thumbnail
  if (product.imageUrl) {
    createThumbnail(
      product.imageUrl,
      0,
      thumbnailContainer,
      product.name || 'Product Image',
    )
  }

  // Add additional images if available
  if (product.images && Array.isArray(product.images)) {
    product.images.forEach((imageUrl, index) => {
      createThumbnail(
        imageUrl,
        index + 1,
        thumbnailContainer,
        `Product Image ${index + 2}`,
      )
    })
  }
}

/**
 * Create thumbnail element
 */
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

  // Add click handler
  thumbnailDiv.addEventListener('click', () => {
    const mainImage = document.getElementById('main-product-image')
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

/**
 * Update product rating stars
 */
const updateProductRating = (rating = 5) => {
  const ratingContainer = document.querySelector('.product-rating ul')
  if (!ratingContainer) return

  const stars = ratingContainer.querySelectorAll('li')
  stars.forEach((star, index) => {
    const icon = star.querySelector('i')
    if (icon) {
      if (index < rating) {
        icon.className = 'icon-star'
        star.classList.remove('bad-rating')
      } else {
        icon.className = 'icon-star'
        star.classList.add('bad-rating')
      }
    }
  })
}

/**
 * Update product details (SKU, categories, etc.)
 */
const updateProductDetails = (product) => {
  // Update SKU
  const skuElement = document.querySelector('.product-sku span')
  if (skuElement) {
    skuElement.textContent = product.sku || product.id || 'P006'
  }

  // Update brand in categories
  const categoryElements = document.querySelectorAll('.product-stock-status a')
  if (categoryElements.length > 0 && product.brand) {
    categoryElements[0].textContent = product.brand
  }

  if (categoryElements.length > 1 && product.category) {
    categoryElements[1].textContent = getCategoryName(product.category)
  }
}

/**
 * Update product actions (wishlist, etc.)
 */
const updateProductActions = (product) => {
  // Update wishlist button with product ID
  const wishlistButton = document.querySelector('.add_to_wishlist')
  if (wishlistButton && product.id) {
    wishlistButton.setAttribute('data-product-id', product.id)
  }

  // Update stock status in button
  const addToCartButton = document.querySelector('.add-to-cart')
  if (addToCartButton) {
    if (product.inStock === false) {
      addToCartButton.textContent = 'Нет в наличии'
      addToCartButton.disabled = true
      addToCartButton.classList.add('out-of-stock')
    } else {
      addToCartButton.textContent = 'Добавить в корзину'
      addToCartButton.disabled = false
      addToCartButton.classList.remove('out-of-stock')
    }
  }
}

/**
 * Update breadcrumb navigation
 */
const updateBreadcrumb = (productName) => {
  const breadcrumbActive = document.querySelector('.breadcrumb-item.active')
  if (breadcrumbActive) {
    breadcrumbActive.textContent = productName
  }
}

/**
 * Initialize product gallery functionality
 */
const initializeProductGallery = () => {
  // Initialize GLightbox for gallery
  if (typeof GLightbox !== 'undefined') {
    try {
      const lightbox = GLightbox({
        selector: '.glightbox',
        touchNavigation: true,
        loop: true,
        autoplayVideos: false,
        zoomable: true,
        draggable: true,
      })
      console.log('✅ Product gallery lightbox initialized')
    } catch (error) {
      console.warn('⚠️ Could not initialize product gallery lightbox:', error)
    }
  }

  // Initialize thumbnail navigation
  const thumbnails = document.querySelectorAll('.pro-nav-thumb')
  const mainImage = document.getElementById('main-product-image')
  const zoomLink = document.querySelector('.zoom-icon')

  thumbnails.forEach((thumbnail, index) => {
    thumbnail.addEventListener('click', () => {
      const img = thumbnail.querySelector('img')
      if (mainImage && img) {
        mainImage.src = img.src
        mainImage.alt = img.alt

        // Update zoom link
        if (zoomLink) {
          zoomLink.href = img.src
        }
      }

      // Update active state
      thumbnails.forEach((thumb) => thumb.classList.remove('active'))
      thumbnail.classList.add('active')
    })
  })
}

/**
 * Initialize product actions
 */
const initializeProductActions = () => {
  // Wishlist functionality
  const wishlistButton = document.querySelector('.add_to_wishlist')
  if (wishlistButton) {
    wishlistButton.addEventListener('click', (e) => {
      e.preventDefault()
      const productId = wishlistButton.getAttribute('data-product-id')
      console.log('💖 Adding to wishlist:', productId)
      // Implement wishlist functionality
    })
  }

  // Quantity controls
  initializeQuantityControls()
}

/**
 * Initialize quantity controls
 */
const initializeQuantityControls = () => {
  const quantityInput = document.querySelector('.cart-plus-minus input')
  if (!quantityInput) return

  // Create plus/minus buttons if they don't exist
  const container = quantityInput.parentElement

  let minusBtn = container.querySelector('.minus-btn')
  let plusBtn = container.querySelector('.plus-btn')

  if (!minusBtn) {
    minusBtn = document.createElement('button')
    minusBtn.type = 'button'
    minusBtn.className = 'minus-btn'
    minusBtn.textContent = '-'
    container.insertBefore(minusBtn, quantityInput)
  }

  if (!plusBtn) {
    plusBtn = document.createElement('button')
    plusBtn.type = 'button'
    plusBtn.className = 'plus-btn'
    plusBtn.textContent = '+'
    container.appendChild(plusBtn)
  }

  // Add event listeners
  minusBtn.addEventListener('click', () => {
    const currentValue = parseInt(quantityInput.value) || 1
    if (currentValue > 1) {
      quantityInput.value = currentValue - 1
    }
  })

  plusBtn.addEventListener('click', () => {
    const currentValue = parseInt(quantityInput.value) || 1
    quantityInput.value = currentValue + 1
  })
}

/**
 * Initialize product tabs
 */
const initializeProductTabs = () => {
  // Bootstrap tabs should work automatically, but we can add custom functionality here
  const tabLinks = document.querySelectorAll('[data-bs-toggle="tab"]')

  tabLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href')
      console.log('🎯 Switching to tab:', targetId)
    })
  })
}

/**
 * Show loading state
 */
const showLoadingState = () => {
  const mainContent = document.querySelector('.product-details-inner')
  if (mainContent) {
    mainContent.innerHTML = `
      <div class="col-12">
        <div class="text-center" style="padding: 4rem;">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Загрузка...</span>
          </div>
          <div style="margin-top: 1rem; color: #666;">
            Загрузка информации о товаре...
          </div>
        </div>
      </div>
    `
  }
}

/**
 * Show error state
 */
const showErrorState = (message) => {
  const mainContent = document.querySelector('.product-details-inner')
  if (mainContent) {
    mainContent.innerHTML = `
      <div class="col-12">
        <div class="text-center" style="padding: 4rem;">
          <div style="color: #dc3545; font-size: 3rem; margin-bottom: 1rem;">
            <i class="fas fa-exclamation-triangle"></i>
          </div>
          <h4 style="color: #dc3545; margin-bottom: 1rem;">Ошибка загрузки товара</h4>
          <p style="color: #666; margin-bottom: 2rem;">${message}</p>
          <a href="shop.html" class="btn btn-primary">
            <i class="fa fa-arrow-left"></i> Вернуться к каталогу
          </a>
        </div>
      </div>
    `
  }
}

/**
 * Auto-initialize when DOM is ready
 */
document.addEventListener('DOMContentLoaded', () => {
  // Only initialize on product-details page
  if (
    window.location.pathname.includes('product-details') ||
    document.querySelector('.product-details-inner')
  ) {
    initProductDetailsPage()
  }
})

// Export for external use
export {
  loadProductDetails,
  getProductIdFromUrl,
  renderProductContent,
  updateProductInfo,
  updateProductImages,
}

console.log(
  '📦 product-details.js loaded - Product details functionality ready',
)
