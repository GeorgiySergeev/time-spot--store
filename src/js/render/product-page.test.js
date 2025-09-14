/**
 * Test file for product-page.js
 * This is a simple manual test to verify the functionality
 */

// Mock product data
const mockProduct = {
  id: 1,
  brand: 'Rolex',
  model: 'Oyster Perpetual 36',
  name: 'Rolex Oyster Perpetual 36',
  price: 114550.0,
  description:
    'It is a long established fact that a reader will be distracted...',
  sku: 'P006',
  inStock: true,
  imageUrl: './img/products/2-450x450.jpg',
  images: ['./img/products/2-450x450.jpg', './img/products/img_1_450.webp'],
}

// Test functions
const testCreateProductTitle = async () => {
  console.log('Testing createProductTitle...')

  // Setup
  const { createProductTitle } = await import('./product-page.js')

  // Execute
  const titleMarkup = createProductTitle(mockProduct)

  // Verify
  if (titleMarkup.includes(mockProduct.model)) {
    console.log('✓ Product title markup created correctly')
  } else {
    console.error('✗ Product title markup not created correctly')
  }
}

const testCreateProductPrice = async () => {
  console.log('Testing createProductPrice...')

  // Setup
  const { createProductPrice } = await import('./product-page.js')

  // Execute
  const priceMarkup = createProductPrice(mockProduct)

  // Verify
  if (priceMarkup.includes('$114,550.00') || priceMarkup.includes('114')) {
    console.log('✓ Product price markup created correctly')
  } else {
    console.error('✗ Product price markup not created correctly')
  }
}

const testCreateProductGallery = async () => {
  console.log('Testing createProductGallery...')

  // Setup
  const { createProductGallery } = await import('./product-page.js')

  // Execute
  const galleryMarkup = createProductGallery(mockProduct)

  // Verify
  if (
    galleryMarkup.includes('product-main-swiper') &&
    galleryMarkup.includes('product-thumbs-swiper')
  ) {
    console.log('✓ Product gallery markup created correctly')
  } else {
    console.error('✗ Product gallery markup not created correctly')
  }
}

// Run tests
document.addEventListener('DOMContentLoaded', async () => {
  console.log('Running product page tests...')

  try {
    await testCreateProductTitle()
    await testCreateProductPrice()
    await testCreateProductGallery()
    console.log('All tests completed!')
  } catch (error) {
    console.error('Test error:', error)
  }
})
