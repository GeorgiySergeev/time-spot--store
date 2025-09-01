// Shop page specific functionality
// This file is loaded specifically for the shop/catalog page

import { initializeCatalog } from './api/renderer.js'

document.addEventListener('DOMContentLoaded', () => {
  console.log('🛍️ Shop page - Initializing catalog functionality')

  // Initialize the catalog with enhanced shop page features
  initializeCatalog('products')

  // Add any shop-specific event listeners or functionality here
  console.log('✅ Shop page initialization complete')
})
