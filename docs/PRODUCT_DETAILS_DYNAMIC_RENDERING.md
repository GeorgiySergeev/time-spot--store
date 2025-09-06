# Product Details Dynamic Rendering System

## Overview

This system implements dynamic rendering for the Single Product Details Page, allowing product cards to be clicked and navigate to a dynamically populated product details page with thumbnail slider functionality.

## Architecture

### Core Components

1. **Product Details Templates** (`src/js/api/product-details-templates.js`)
   - Template functions for all dynamic parts of the product details page
   - Handles product gallery, thumbnails, product info, and description tabs
   - Provides fallback data when API is unavailable

2. **Dynamic Renderer** (`src/js/api/product-details-dynamic-renderer.js`)
   - Main rendering logic for product details page
   - Handles Swiper initialization for image galleries
   - Manages product card click navigation
   - Provides error handling and loading states

3. **Updated Product Renderer** (`src/js/api/product-renderer.js`)
   - Enhanced with data attributes for product navigation
   - Supports both grid and list view product cards
   - Includes proper click handlers for navigation

## Key Features

### 1. Dynamic Product Gallery with Thumbnail Slider

```javascript
// Main images swiper with thumbnail navigation
const mainSwiper = new Swiper('#product_page_slider', {
  loop: true,
  spaceBetween: 10,
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
  thumbs: {
    swiper: thumbsSwiper,
  },
})

// Thumbnail swiper with click navigation
const thumbsSwiper = new Swiper('.product-thumbs-swiper', {
  spaceBetween: 10,
  slidesPerView: 4,
  freeMode: true,
  watchSlidesProgress: true,
  on: {
    click: function (swiper, event) {
      const clickedIndex = swiper.clickedIndex
      if (clickedIndex !== undefined && mainSwiper) {
        mainSwiper.slideTo(clickedIndex)
      }
    },
  },
})
```

### 2. Product Card Click Navigation

```javascript
// Automatic click handler setup
export const initializeProductCardHandlers = () => {
  document.addEventListener('click', (event) => {
    const productCard = event.target.closest(
      '.single-product-area, .single-product',
    )
    if (!productCard) return

    const productLink = event.target.closest('a[href*="product-details"]')
    if (!productLink) return

    event.preventDefault()

    // Extract product ID and navigate
    const productId = extractProductId(productCard, productLink)
    if (productId) {
      handleProductCardClick(productId)
    }
  })
}
```

### 3. Dynamic Content Rendering

The system dynamically renders:

- **Product Information**: Name, price, rating, description
- **Product Gallery**: Main images with zoom functionality
- **Thumbnail Navigation**: Clickable thumbnail slider
- **Product Actions**: Add to cart, wishlist, compare buttons
- **Product Details Tabs**: Description and specifications
- **Breadcrumb Navigation**: Dynamic breadcrumb with product name

## Usage

### 1. Basic Implementation

```javascript
// Initialize the system (already done in main.js)
import {
  initializeProductCardHandlers,
  initProductDetailsPage,
} from './api/product-details-dynamic-renderer.js'

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  // Initialize product card click handlers
  initializeProductCardHandlers()

  // Initialize product details page if on details page
  if (window.location.pathname.includes('product-details')) {
    initProductDetailsPage()
  }
})
```

### 2. Manual Product Rendering

```javascript
// Render specific product details
import { renderProductDetails } from './api/product-details-dynamic-renderer.js'

// Render product with ID
await renderProductDetails('product-123')
```

### 3. Product Card Navigation

```javascript
// Handle product card clicks programmatically
import { handleProductCardClick } from './api/product-details-dynamic-renderer.js'

// Navigate to product details
handleProductCardClick('product-123')
```

## Data Structure

### Expected Product Data Format

```javascript
const product = {
  id: 'product-123',
  model: 'Classic Watch',
  name: 'Time Sphere Classic Watch',
  brand: 'Time Sphere',
  price: 299,
  oldPrice: 350,
  description: 'Product description...',
  fullDescription: 'Detailed product description...',
  images: [
    { path: '/img/products/1.jpg', alt: 'Front view' },
    { path: '/img/products/2.jpg', alt: 'Side view' },
    { path: '/img/products/3.jpg', alt: 'Back view' },
  ],
  category: 'watch',
  subcategory: 'premium',
  sku: 'TS-CLASSIC-001',
  rating: 5,
  reviewsCount: 12,
  inStock: true,
}
```

## Error Handling

### 1. API Failures

- Shows fallback data when API is unavailable
- Displays user-friendly error messages
- Provides retry functionality

### 2. Missing Product Data

- Uses fallback product information
- Shows appropriate loading states
- Handles invalid product IDs gracefully

### 3. Image Loading Issues

- Provides default product images
- Handles missing image paths
- Supports both API and local image sources

## Testing

### Test Page

A comprehensive test page is available at `test-product-details-dynamic.html` that includes:

1. **Product Card Rendering**: Test product cards with click handlers
2. **Navigation Testing**: Simulate product card clicks
3. **Direct Rendering**: Test dynamic content rendering
4. **Status Display**: Real-time feedback on operations

### Test Features

- Load sample product cards
- Test click navigation to details page
- Test direct product details rendering
- Clear and reload functionality

## Integration Points

### 1. Main Application (`src/js/main.js`)

- Automatically initializes product card handlers
- Detects product details pages
- Integrates with existing catalog system

### 2. Product Renderer (`src/js/api/product-renderer.js`)

- Enhanced with data attributes for navigation
- Supports both grid and list views
- Maintains backward compatibility

### 3. API Integration (`src/js/api/api.js`)

- Uses existing API functions
- Handles product data normalization
- Provides error handling

## Browser Compatibility

- **Modern Browsers**: Full functionality
- **ES6+ Features**: Uses modern JavaScript features
- **Swiper.js**: Requires Swiper 8+ for gallery functionality
- **GLightbox**: Optional for image zoom functionality

## Performance Considerations

### 1. Lazy Loading

- Images are loaded on demand
- Swiper instances are created only when needed
- DOM updates are batched for efficiency

### 2. Memory Management

- Swiper instances are properly destroyed and recreated
- Event listeners are cleaned up appropriately
- Large image galleries are handled efficiently

### 3. Caching

- Product data can be cached for better performance
- Image preloading for smoother gallery experience
- Session storage for navigation state

## Future Enhancements

### 1. Advanced Features

- Product variants support
- Advanced filtering and sorting
- Wishlist integration
- Shopping cart functionality

### 2. Performance Optimizations

- Image lazy loading
- Virtual scrolling for large galleries
- Service worker caching

### 3. Accessibility

- Keyboard navigation support
- Screen reader compatibility
- High contrast mode support

## Troubleshooting

### Common Issues

1. **Swiper not initializing**
   - Ensure Swiper.js is loaded before initialization
   - Check for DOM element existence
   - Verify Swiper configuration

2. **Product cards not clickable**
   - Check data attributes are set correctly
   - Verify event handler initialization
   - Ensure proper CSS selectors

3. **Images not loading**
   - Check image paths and URLs
   - Verify API response format
   - Check for CORS issues

### Debug Mode

Enable debug logging by setting:

```javascript
window.DEBUG_PRODUCT_DETAILS = true
```

This will provide detailed console output for troubleshooting.
