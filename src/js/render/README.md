# Product Page Renderer

This module implements the product details page rendering for the Time Sphere e-commerce platform.

## Features

- Functional approach using ES6 standards
- Separate markup creation functions for each component
- Dynamic product data fetching from API
- Responsive image gallery with thumbnail navigation
- Loading and error states
- Keyboard navigation support

## Files

- `product-page.js` - Main implementation with all rendering functions
- `product-page.test.js` - Unit tests for markup creation functions
- `test-product-render.js` - Manual testing utilities

## Functions

### Markup Creation Functions (Exported)

- `createProductTitle(product)` - Creates product title markup
- `createProductPrice(product)` - Creates product price markup
- `createProductDescription(product)` - Creates product description markup
- `createProductSku(product)` - Creates product SKU markup
- `createProductStock(product)` - Creates product stock status markup
- `createMainProductImage(product)` - Creates main product image markup
- `createThumbnail(imageSrc, altText, index)` - Creates thumbnail markup
- `createProductGallery(product)` - Creates complete product gallery markup
- `createProductInfo(product)` - Creates complete product info section markup
- `createLoadingState()` - Creates loading state markup
- `createErrorState(errorMessage)` - Creates error state markup

### Main Functions

- `renderProductDetails(productId)` - Renders complete product details page
- `bindGalleryEvents()` - Binds events for image gallery navigation

## Usage

The module automatically initializes when the DOM is ready and the current page is product-details.html. It will attempt to get the product ID from the URL parameters (`?id=...`). If no ID is provided, it will use a default test ID for development purposes.

For manual testing, you can run the following in the browser console:

```javascript
// Test all markup functions
testAllMarkupFunctions()

// Test product rendering
testRendering()
```

## Testing

Unit tests are available in `product-page.test.js` and can be run by importing the functions and testing their output.

Manual testing can be done using the functions exposed in `test-product-render.js`.
