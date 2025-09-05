// Product rendering functionality for dynamic product cards

const BASE_IMAGE_URL = 'https://websphere.miy.link/admin/storage/uploads'

export const renderProducts = (
  products,
  containerId = 'products',
  viewType = 'grid',
) => {
  const container = document.getElementById(containerId)
  if (!container) {
    console.error(`Container with id '${containerId}' not found`)
    return
  }

  // Show loading state first
  container.innerHTML =
    '<div class="text-center"><p>Загрузка товаров...</p></div>'

  if (!products) {
    container.innerHTML =
      '<p class="text-center text-danger">Не удалось загрузить товары</p>'
    return
  }

  // Normalize the products data structure
  const normalizedProducts = normalizeProductsData(products)

  if (!Array.isArray(normalizedProducts) || normalizedProducts.length === 0) {
    // For testing purposes, show some sample products
    console.log(
      'Нет товаров из API, показываем образцы данных для тестирования',
    )
    const sampleProducts = getSampleProducts()
    if (viewType === 'list') {
      renderProductList(sampleProducts, container)
    } else {
      renderProductCards(sampleProducts, container)
    }
    return
  }

  // Render the actual products
  if (viewType === 'list') {
    renderProductList(normalizedProducts, container)
  } else {
    renderProductCards(normalizedProducts, container)
  }
}

const renderProductCards = (products, container) => {
  // Clear existing content
  container.innerHTML = ''

  // Render each product
  products.forEach((product, index) => {
    try {
      const columnWrapper = document.createElement('div')
      columnWrapper.className = 'col-lg-3 col-md-6'

      const gridCard = createProductCard(product)
      columnWrapper.appendChild(gridCard)

      container.appendChild(columnWrapper)
    } catch (error) {
      console.error(`Error rendering product ${index}:`, error, product)
      // Continue with other products
    }
  })

  console.log(`Успешно отображено ${products.length} товаров`)
}

// Render products in list view
const renderProductList = (products, container) => {
  // Clear existing content
  container.innerHTML = ''

  // Create the main container for list view
  const listContainer = document.createElement('div')
  listContainer.className = 'shop-product-list-wrap'

  // Render each product
  products.forEach((product, index) => {
    try {
      const listCard = createProductListCard(product)
      listContainer.appendChild(listCard)
    } catch (error) {
      console.error(`Error rendering product ${index}:`, error, product)
      // Continue with other products
    }
  })

  container.appendChild(listContainer)
  console.log(`Успешно отображено ${products.length} товаров в списковом виде`)
}

const getSampleProducts = () => {
  return [
    {
      id: 1,
      name: 'Rolex Oyster Perpetual 36',
      brand: 'Cartier',
      price: 114550.0,
      oldPrice: 700.0,
      discount: '7%',
      rating: 4,
      description:
        'It is a long established fact that a reader will be distracted by the readable content...',
      image: './img/products/2-450x450.jpg',
      secondaryImage: './img/products/2-2-450x450.jpg',
    },
    {
      id: 2,
      name: 'Omega Speedmaster Professional',
      brand: 'Omega',
      price: 850.0,
      oldPrice: 1000.0,
      discount: '15%',
      rating: 5,
      description:
        'A legendary timepiece with exceptional precision and reliability...',
      image: './img/products/2-450x450.jpg',
      secondaryImage: './img/products/2-2-450x450.jpg',
    },
    {
      id: 3,
      name: 'Patek Philippe Calatrava',
      brand: 'Patek Philippe',
      price: 1200.0,
      rating: 5,
      description: 'Elegant design meets exceptional craftsmanship...',
      image: './img/products/2-450x450.jpg',
      secondaryImage: './img/products/2-2-450x450.jpg',
    },
  ]
}

const normalizeProductsData = (data) => {
  console.log('Normalizing products data:', data)
  console.log('Data type:', typeof data)
  console.log('Is array:', Array.isArray(data))

  // Handle different API response structures
  if (Array.isArray(data)) {
    console.log('Data is already an array, length:', data.length)
    return data
  }

  if (data && typeof data === 'object') {
    console.log('Data is an object, keys:', Object.keys(data))

    // Common API response patterns
    if (data.data && Array.isArray(data.data)) {
      console.log('Found data.data array, length:', data.data.length)
      return data.data
    }

    if (data.products && Array.isArray(data.products)) {
      console.log('Found data.products array, length:', data.products.length)
      return data.products
    }

    if (data.items && Array.isArray(data.items)) {
      console.log('Found data.items array, length:', data.items.length)
      return data.items
    }

    if (data.results && Array.isArray(data.results)) {
      console.log('Found data.results array, length:', data.results.length)
      return data.results
    }

    // If it's a single product object, wrap it in an array
    if (data.id || data.name || data.title) {
      console.log('Data appears to be a single product, wrapping in array')
      return [data]
    }
  }

  console.warn('Unexpected products data structure:', data)
  return []
}

const createProductCard = (product) => {
  // Main product area container
  const card = document.createElement('div')
  card.className = 'single-product-area mt-30'

  // Create product thumb section
  const thumbSection = createProductThumb(product)

  // Create product caption section
  const captionSection = createProductCaption(product)

  // Assemble the card
  card.appendChild(thumbSection)
  card.appendChild(captionSection)

  return card
}

const createProductThumb = (product) => {
  const thumbDiv = document.createElement('div')
  thumbDiv.className = 'product-thumb'

  // Product link
  const productLink = document.createElement('a')
  productLink.href = product.url || `product-details.html?id=${product.id}`

  // Primary image
  const primaryImg = document.createElement('img')
  primaryImg.className = 'primary-image'

  // Handle different image sources
  if (product.img && product.img.path) {
    primaryImg.src = `${BASE_IMAGE_URL}/${product.img.path}`
  } else if (product.image) {
    primaryImg.src = product.image
  } else {
    primaryImg.src = './img/products/2-450x450.jpg' // fallback
  }

  primaryImg.alt = product.model || 'Product'

  productLink.appendChild(primaryImg)
  thumbDiv.appendChild(productLink)

  // Add "New" label if needed
  if (product.isNew || product.label === 'new') {
    const newLabel = document.createElement('div')
    newLabel.className = 'label-product label_new'
    newLabel.textContent = 'New'
    thumbDiv.appendChild(newLabel)
  }

  // Action links
  const actionLinks = document.createElement('div')
  actionLinks.className = 'action-links'

  // Wishlist button
  const wishlistBtn = document.createElement('a')
  wishlistBtn.href = 'wishlist.html'
  wishlistBtn.className = 'wishlist-btn'
  wishlistBtn.title = 'Добавить в избранное'
  // Attach product id for wishlist logic
  wishlistBtn.setAttribute('data-product-id', String(product.id || product._id))
  const wishlistIcon = document.createElement('i')
  wishlistIcon.className = 'icon-heart'
  wishlistBtn.appendChild(wishlistIcon)
  actionLinks.appendChild(wishlistBtn)

  // Quick view button
  const quickViewBtn = document.createElement('a')
  quickViewBtn.href = '#'
  quickViewBtn.className = 'quick-view'
  quickViewBtn.title = 'Быстрый просмотр'
  quickViewBtn.setAttribute('data-bs-toggle', 'modal')
  quickViewBtn.setAttribute('data-bs-target', '#exampleModalCenter')
  quickViewBtn.setAttribute(
    'data-product-id',
    String(product.id || product._id),
  )
  const quickViewIcon = document.createElement('i')
  quickViewIcon.className = 'icon-magnifier icons'
  quickViewBtn.appendChild(quickViewIcon)
  actionLinks.appendChild(quickViewBtn)

  thumbDiv.appendChild(actionLinks)

  return thumbDiv
}

// Product caption section

const createProductCaption = (product) => {
  const captionDiv = document.createElement('div')
  captionDiv.className = 'product-caption'

  // Product brand
  const brandH4 = document.createElement('h4')
  brandH4.className = 'product-brand'
  const brandLink = document.createElement('a')
  brandLink.href = product.url || `product-details.html?id=${product._id}`
  brandLink.textContent = product.brand || 'Бренд товара'
  brandH4.appendChild(brandLink)
  captionDiv.appendChild(brandH4)

  // Product name
  const nameH4 = document.createElement('h4')
  nameH4.className = 'product-name'
  const nameLink = document.createElement('a')
  nameLink.href = product.url || `product-details.html?id=${product._id}`
  nameLink.textContent = product.model || product.title || 'Название товара'
  nameH4.appendChild(nameLink)

  // Price box
  const priceBox = document.createElement('div')
  priceBox.className = 'price-box'

  const newPrice = document.createElement('span')
  newPrice.className = 'new-price'
  newPrice.textContent = formatPrice(product.price || product.currentPrice)
  priceBox.appendChild(newPrice)

  // Add old price if discount exists
  if (product.oldPrice || product.originalPrice) {
    const oldPrice = document.createElement('span')
    oldPrice.className = 'old-price'
    oldPrice.textContent = formatPrice(
      product.oldPrice || product.originalPrice,
    )
    priceBox.appendChild(oldPrice)
  }

  captionDiv.appendChild(nameH4)
  captionDiv.appendChild(priceBox)

  return captionDiv
}

// This function is no longer needed for the grid view as it's replaced by createProductCaption
// Keeping it for backward compatibility but it won't be used in the new structure
const createProductAction = (product) => {
  // This is now handled within the product thumb and caption sections
  return document.createElement('div')
}

// List view card variant matching the shop.html structure
const createProductListCard = (product) => {
  const listWrapper = document.createElement('div')
  listWrapper.className = 'shop-product-list-wrap'

  const row = document.createElement('div')
  row.className = 'row product-layout-list mt-30'

  // Image column (col-lg-3)
  const imageCol = document.createElement('div')
  imageCol.className = 'col-lg-3 col-md-3'

  const singleProduct = document.createElement('div')
  singleProduct.className = 'single-product'

  const productImageDiv = document.createElement('div')
  productImageDiv.className = 'product-image'

  const imageLink = document.createElement('a')
  imageLink.href = product.url || `product-details.html?id=${product.id}`

  const img = document.createElement('img')
  if (product.img && product.img.path) {
    img.src = `${BASE_IMAGE_URL}/${product.img.path}`
  } else if (product.image) {
    img.src = product.image
  } else {
    img.src = './img/products/2-450x450.jpg'
  }
  img.alt = 'Product Images'

  imageLink.appendChild(img)
  productImageDiv.appendChild(imageLink)
  singleProduct.appendChild(productImageDiv)
  imageCol.appendChild(singleProduct)

  // Content column (col-lg-6)
  const contentCol = document.createElement('div')
  contentCol.className = 'col-lg-6 col-md-6'

  const productContentList = document.createElement('div')
  productContentList.className = 'product-content-list text-left'

  // Product name
  const nameH4 = document.createElement('h4')
  const nameLink = document.createElement('a')
  nameLink.href = product.url || `product-details.html?id=${product.id}`
  nameLink.className = 'product-name'
  console.log('product.model', product.model)
  nameLink.textContent = product.model || product.title || 'Название товара'
  nameH4.appendChild(nameLink)
  productContentList.appendChild(nameH4)

  // Price box
  const priceBox = document.createElement('div')
  priceBox.className = 'price-box'

  const newPrice = document.createElement('span')
  newPrice.className = 'new-price'
  newPrice.textContent = formatPrice(product.price || product.currentPrice)
  priceBox.appendChild(newPrice)

  if (product.oldPrice || product.originalPrice) {
    const oldPrice = document.createElement('span')
    oldPrice.className = 'old-price'
    oldPrice.textContent = formatPrice(
      product.oldPrice || product.originalPrice,
    )
    priceBox.appendChild(oldPrice)
  }
  productContentList.appendChild(priceBox)

  // Rating
  const ratingDiv = document.createElement('div')
  ratingDiv.className = 'product-rating'
  const ratingUl = document.createElement('ul')
  ratingUl.className = 'd-flex'

  const rating = product.rating || product.stars || 0
  for (let i = 1; i <= 5; i++) {
    const li = document.createElement('li')
    if (i > rating) {
      li.className = 'bad-reting'
    }
    const a = document.createElement('a')
    a.href = '#'
    const icon = document.createElement('i')
    icon.className = 'icon-star'
    a.appendChild(icon)
    li.appendChild(a)
    ratingUl.appendChild(li)
  }
  ratingDiv.appendChild(ratingUl)
  productContentList.appendChild(ratingDiv)

  // Description
  const descP = document.createElement('p')
  descP.textContent =
    product.description ||
    product.shortDescription ||
    'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Architecto suscipit aliquam, dignissimos nesciunt, quos voluptas tenetur necessitatibus voluptate vitae quo quibusdam nihil.'
  productContentList.appendChild(descP)

  contentCol.appendChild(productContentList)

  // Actions column (col-lg-3)
  const actionsCol = document.createElement('div')
  actionsCol.className = 'col-lg-3 col-md-3'

  const block2 = document.createElement('div')
  block2.className = 'block2'

  // Stock info
  const stockCont = document.createElement('ul')
  stockCont.className = 'stock-cont'

  const skuLi = document.createElement('li')
  skuLi.className = 'product-sku'
  skuLi.innerHTML = 'Артикул: <span>' + (product.sku || 'P006') + '</span>'
  stockCont.appendChild(skuLi)

  const stockLi = document.createElement('li')
  stockLi.className = 'product-stock-status'
  stockLi.innerHTML = 'Наличие: <span class="in-stock">В наличии</span>'
  stockCont.appendChild(stockLi)

  block2.appendChild(stockCont)

  // Product buttons
  const productButton = document.createElement('div')
  productButton.className = 'product-button'

  const actionsUl = document.createElement('ul')
  actionsUl.className = 'actions'

  const wishlistLi = document.createElement('li')
  wishlistLi.className = 'add-to-wishlist'
  const wishlistA = document.createElement('a')
  wishlistA.href = 'wishlist.html'
  wishlistA.className = 'add_to_wishlist'
  // Attach product id for wishlist logic
  wishlistA.setAttribute('data-product-id', String(product.id || product._id))
  wishlistA.innerHTML = '<i class="icon-heart"></i> Добавить в избранное'
  wishlistLi.appendChild(wishlistA)
  actionsUl.appendChild(wishlistLi)

  productButton.appendChild(actionsUl)

  const addToCartDiv = document.createElement('div')
  addToCartDiv.className = 'add-to-cart'
  const productButtonAction = document.createElement('div')
  productButtonAction.className = 'product-button-action'
  const cartA = document.createElement('a')
  cartA.href = '#'
  cartA.className = 'add-to-cart'
  cartA.textContent = 'Добавить в корзину'
  productButtonAction.appendChild(cartA)
  addToCartDiv.appendChild(productButtonAction)
  productButton.appendChild(addToCartDiv)

  block2.appendChild(productButton)
  actionsCol.appendChild(block2)

  // Assemble the row
  row.appendChild(imageCol)
  row.appendChild(contentCol)
  row.appendChild(actionsCol)

  listWrapper.appendChild(row)
  return listWrapper
}

const formatPrice = (price) => {
  if (typeof price === 'number') {
    return `$${price.toFixed(2)}`
  }
  if (typeof price === 'string') {
    // Try to parse as number
    const numPrice = parseFloat(price)
    if (!isNaN(numPrice)) {
      return `$${numPrice.toFixed(2)}`
    }
    // If it's already formatted, return as is
    return price
  }
  return '$0.00'
}

// Export additional utility functions if needed
export const updateProductDisplay = (
  products,
  containerId = 'products',
  viewType = 'grid',
) => {
  renderProducts(products, containerId, viewType)
}

export const addProductToContainer = (product, containerId = 'products') => {
  const container = document.getElementById(containerId)
  if (!container) return

  const productCard = createProductCard(product)
  container.appendChild(productCard)
}

export const testProductRendering = (
  containerId = 'products',
  viewType = 'grid',
) => {
  console.log('Тестирование отображения товаров с образцами данных...')
  const sampleProducts = getSampleProducts()
  renderProducts(sampleProducts, containerId, viewType)
}

// Enhanced product rendering with loading animation
export const renderProductsWithLoader = async (
  productsPromise,
  containerId = 'products',
  viewType = 'grid',
) => {
  const container = document.getElementById(containerId)
  if (!container) {
    console.error(`Container with id '${containerId}' not found`)
    return
  }

  // Show enhanced loading state
  showLoadingState(container)

  try {
    const products = await productsPromise
    renderProducts(products, containerId, viewType)
  } catch (error) {
    showErrorState(container, error.message, viewType)
    console.error('Failed to render products:', error)
  }
}

// Manual product refresh function
export const refreshProducts = async (
  containerId = 'products',
  viewType = 'grid',
) => {
  console.log('Ручное обновление товаров...')
  const { getProducts } = await import('./api.js')
  return renderProductsWithLoader(getProducts(), containerId, viewType)
}

// Clear products container
export const clearProducts = (containerId = 'products') => {
  const container = document.getElementById(containerId)
  if (container) {
    container.innerHTML = ''
    console.log(`Очищены товары из контейнера: ${containerId}`)
  }
}

// Show loading state with animation
const showLoadingState = (container) => {
  container.innerHTML = `
    <div class="text-center loading-products" style="width: 100%; padding: 3rem;">
      <div style="color: #fff; font-size: 1.4rem; margin-bottom: 1rem;">
        <i class="fa fa-spinner fa-spin"></i> Загрузка товаров...
      </div>
      <div style="color: #ccc; font-size: 1.2rem;">
        Получение последних товаров из API
      </div>
    </div>
  `
}

// Show error state with retry option
const showErrorState = (container, errorMessage, viewType = 'grid') => {
  container.innerHTML = `
    <div class="text-center error-products" style="width: 100%; padding: 3rem;">
      <div style="color: #ff6b6b; font-size: 1.4rem; margin-bottom: 1rem;">
        <i class="fa fa-exclamation-triangle"></i> Не удалось загрузить товары
      </div>
      <div style="color: #ccc; font-size: 1.2rem; margin-bottom: 2rem;">
        ${errorMessage}
      </div>
      <button onclick="window.productRenderer.refreshProducts('${container.id}', '${viewType}')"
              style="background: #007bff; color: white; border: none; padding: 1rem 2rem; border-radius: 4px; cursor: pointer;">
        <i class="fa fa-refresh"></i> Попробовать снова
      </button>
      <button onclick="window.productRenderer.testProductRendering('${container.id}', '${viewType}')"
              style="background: #28a745; color: white; border: none; padding: 1rem 2rem; border-radius: 4px; cursor: pointer; margin-left: 1rem;">
        <i class="fa fa-eye"></i> Показать образцы товаров
      </button>
    </div>
  `
}

export { getSampleProducts }

// Expose minimal helpers for inline retry buttons
if (typeof window !== 'undefined') {
  window.productRenderer = window.productRenderer || {}
  window.productRenderer.refreshProducts = refreshProducts
  window.productRenderer.testProductRendering = testProductRendering
}
