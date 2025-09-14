# TIME-SPHERE - Project Documentation

## Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Development Environment](#development-environment)
4. [API Integration](#api-integration)
5. [Frontend Structure](#frontend-structure)
6. [Build System](#build-system)
7. [Deployment](#deployment)
8. [Development Workflow](#development-workflow)
9. [Coding Standards](#coding-standards)
10. [Performance Optimization](#performance-optimization)

## Project Overview

TIME-SPHERE is a luxury watch replica catalog website built with modern web technologies, featuring a headless CMS architecture for flexible content management and optimal performance.

### Key Features

- **Product Catalog**: Dynamic watch catalog with filtering and search functionality
- **Responsive Design**: Mobile-first approach with modern CSS Grid and Flexbox
- **CMS Integration**: Cockpit CMS for headless content management
- **Performance Optimized**: Image optimization, WebP conversion, and efficient build process
- **SEO Friendly**: Structured markup and comprehensive meta tag management
- **Component-Based**: Modular HTML components with gulp-file-include

### Target Audience

- Luxury watch enthusiasts
- Replica watch collectors
- Mobile and desktop users globally

## Architecture

### System Architecture Diagram

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   GitHub Pages  │    │  Cockpit CMS    │
│ (Gulp + Vanilla)│◄──►│   (Static Host) │◄──►│   (Backend)     │
│                 │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
    ┌────▼────┐             ┌────▼────┐             ┌────▼────┐
    │  SCSS   │             │  Build  │             │  REST   │
    │ Styling │             │ Process │             │   API   │
    └─────────┘             └─────────┘             └─────────┘
```

### Technology Stack

#### Frontend

- **HTML5**: Semantic markup with accessibility considerations and component-based structure
- **CSS3/SCSS**: Modern styling with custom properties, responsive design, and BEM methodology
- **Vanilla JavaScript**: ES6+ modules with modular architecture
- **Bootstrap 5.3.7**: UI framework for responsive components
- **CSS Grid & Flexbox**: Layout systems for responsive design

#### Build & Development

- **Gulp 5.0**: Task runner for automated build processes
- **SCSS/Sass**: CSS preprocessing with variables, mixins, and modular architecture
- **Webpack**: JavaScript bundling and module processing
- **Image Optimization**: WebP conversion, compression, and sprite generation
- **Browser Sync**: Live development server with hot reload
- **HTML Include**: Component-based HTML templating system

#### Backend & Content

- **Cockpit CMS**: Headless CMS for product catalog management
- **REST API**: JSON-based data exchange with unified service layer
- **Asset Management**: Automated image optimization and CDN integration

#### Third-Party Libraries

- **Swiper 11.2.10**: Touch-enabled slider/carousel for image galleries
- **AOS 2.3.4**: Animate On Scroll library for smooth animations
- **Axios 1.11.0**: HTTP client for API communication
- **Animate.css 4.1.1**: CSS animation library
- **Rellax 1.12.1**: Vanilla parallax library
- **SimpleBar 6.2.5**: Custom scrollbars

## Development Environment

### Prerequisites

```bash
# Required software
- Node.js (v18 or higher)
- npm package manager
- Git version control
- Modern web browser for testing
```

### Local Setup

```bash
# Clone repository
git clone [repository-url]
cd time-sphere

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Deploy to GitHub Pages
npm run deploy
```

### Environment Configuration

```javascript
// gulpfile.js - Core configuration
const watcher = () => {
  browserSync.init({
    server: {
      baseDir: `${app.paths.base.build}`,
    },
    notify: false,
    port: 3000,
  })

  // Watch for file changes
  gulp.watch(app.paths.srcScss, styles)
  gulp.watch(app.paths.srcFullJs, scripts)
  gulp.watch(
    [
      `${app.paths.srcComponentsFolder}/*.html`,
      `${app.paths.base.src}/pages/*.html`,
      `${app.paths.base.src}/components/**/*.html`,
    ],
    htmlInclude,
  )
}
```

## API Integration

### Cockpit CMS Configuration

#### API Endpoints

- **Base URL**: `https://websphere.miy.link/admin/api`
- **Products**: `/content/items/watch`
- **Product by ID**: `/content/item/watch/{id}`
- **Authentication**: API Key-based authentication

#### Authentication Method

```javascript
// Unified authentication configuration
const API_CONFIG = {
  API_KEY: 'API-7c2cde63ceaca7aa2da97700466244e1f4f59c6e',
  BASE_URL: 'https://websphere.miy.link/admin/api',
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
}
```

### Data Structure

#### Product Schema (Confirmed CMS Structure)

```json
{
  "id": "string",
  "brand": "string",
  "model": "string",
  "price": "number",
  "img": "object",
  "category": "string",
  "in_stock": "boolean"
}
```

#### Normalized Product Object

```javascript
{
  id: string,
  brand: string,
  model: string,
  name: string,         // Combined brand + model
  price: number,
  imageUrl: string,     // Full image URL
  category: string,     // 'watch', 'jewelry', 'accessories'
  inStock: boolean,
  url: string,          // Product details URL
  formattedPrice: string, // Russian locale price format
  sku: string           // Generated SKU
}
```

### API Service Implementation

The unified API system is located in `src/js/api/` with the following modules:

- **config.js**: Centralized configuration and settings
- **api.js**: Service layer for Cockpit CMS communication
- **templates.js**: HTML template generation system
- **renderer.js**: Main rendering engine with state management
- **api-utils.js**: Error handling and utilities

## Frontend Structure

### File Organization

```
src/
├── components/           # HTML component system
│   ├── blocks/          # Content blocks (hero, banner, product, etc.)
│   ├── layout/          # Layout components (header, footer, modal)
│   └── head/            # HTML head section
├── pages/               # Page templates (index, about, watch, etc.)
├── styles/              # SCSS stylesheets
│   ├── _variables.scss  # Global SCSS variables
│   ├── _common.scss     # Common styles and resets
│   └── main.scss        # Main SCSS entry point
├── js/                  # JavaScript modules
│   ├── main.js          # Entry point
│   ├── api/             # API integration modules
│   ├── components/      # JavaScript components
│   ├── functions/       # Utility functions
│   └── render/          # Rendering modules
├── img/                 # Image assets
│   ├── products/        # Product images
│   ├── icons/           # Icon assets
│   └── brand/           # Brand logos
└── assets/              # Static assets (fonts, favicon, video)
```

### Component System

```html
<!-- HTML component inclusion with gulp-file-include -->
@include('../components/head/head.html')
@include('../components/layout/header.html', { "pageTitle": "Watch Catalog",
"activeSection": "catalog" }) @include('../components/blocks/hero.html')
@include('../components/layout/footer.html')
```

### JavaScript Architecture

```javascript
// src/js/main.js - Entry point
import './_api.js' // API integration modules
import './_components.js' // UI components
import './_functions.js' // Utility functions

// Modular structure:
// - api/         - Cockpit CMS integration
// - components/  - Interactive UI components
// - functions/   - Utility functions and helpers
// - render/      - Dynamic content rendering
```

## Build System

### Gulp Configuration

The project uses a comprehensive Gulp-based build system with the following tasks:

#### Core Build Tasks

```javascript
// gulpfile.js
const build = gulp.series(
  clean, // Clean build directory
  htmlInclude, // Process HTML components
  scripts, // Bundle JavaScript
  styles, // Compile SCSS
  resources, // Copy assets
  images, // Optimize images
  webpImages, // Convert to WebP
  svgSprites, // Generate SVG sprites
  htmlMinify, // Minify HTML (production only)
)
```

#### Development vs Production

```javascript
// Development mode
npm run dev      // Watch files + BrowserSync
npm run backend  // Build without minification

// Production mode
npm run build    // Full optimization
npm run deploy   // Build + GitHub Pages deployment
```

### Build Output Structure

```
build/
├── index.html
├── about.html
├── watch.html
├── css/
│   ├── main.css
│   ├── main.css.map
│   └── vendor.css
├── js/
│   ├── main.js
│   └── main.js.map
├── img/
│   ├── products/     # Optimized product images
│   ├── webp/         # WebP format images
│   └── sprite.svg    # SVG sprite
├── fonts/            # Font files
└── favicon.ico
```

## Deployment

### GitHub Pages Deployment

```bash
# Automated deployment
npm run build    # Build production files
npm run deploy   # Deploy to gh-pages branch

# GitHub Actions automatically deploys on push to main
```

### Production Checklist

- [ ] Environment variables configured in API config
- [ ] Images optimized and WebP converted
- [ ] CSS and JS minified and bundled
- [ ] Meta tags and SEO elements included
- [ ] Performance metrics validated
- [ ] Cross-browser testing completed
- [ ] API endpoints accessible and tested

## Development Workflow

### Git Workflow

```bash
# Feature development
git checkout -b feature/product-filters
git add .
git commit -m "feat: implement product price range filter"
git push origin feature/product-filters

# Create pull request for review
```

### Component Development

```html
<!-- 1. Create component in src/components/blocks/ -->
<!-- src/components/blocks/price-filter.html -->
<div class="price-filter">
  <h3 class="price-filter__title">Цена</h3>
  <div class="price-filter__range">
    <input type="range" class="price-filter__input" />
  </div>
</div>

<!-- 2. Add corresponding SCSS -->
<!-- src/styles/_price-filter.scss -->
.price-filter { &__title { font-size: 1.2rem; margin-bottom: 1rem; } &__range {
padding: 1rem 0; } }

<!-- 3. Create JavaScript component -->
<!-- src/js/components/price-filter.js -->
class PriceFilter { constructor() { this.init() } init() { // Component
initialization } }
```

## Coding Standards

### JavaScript Standards (ES6+)

```javascript
// Use modern ES6+ features
const products = await fetchProducts()
const filteredProducts = products.filter((product) => product.featured)

// Async/await for API calls
async function loadProduct(id) {
  try {
    const product = await apiService.fetchProduct(id)
    renderProduct(product)
  } catch (error) {
    handleError(error)
  }
}

// Module imports/exports
export { ApiService }
import { ApiService } from './api/api-service.js'
```

### CSS/SCSS Standards (BEM Methodology)

```scss
// Component-based structure
.product-card {
  display: grid;
  gap: 1rem;

  &__image {
    width: 100%;
    aspect-ratio: 1;
    object-fit: cover;
  }

  &__title {
    font-size: 1.2rem;
    font-weight: 600;
  }

  &__price {
    color: var(--accent-color);
    font-weight: 700;
  }

  &--featured {
    border: 2px solid var(--accent-color);
  }
}

// Mobile-first responsive design
.container {
  padding: 1rem;

  @media (min-width: 768px) {
    padding: 2rem;
  }

  @media (min-width: 1200px) {
    padding: 3rem;
  }
}
```

### HTML Standards

```html
<!-- Semantic HTML5 structure -->
<article class="product-card">
  <img
    src="image.jpg"
    alt="Rolex Submariner - Luxury diving watch"
    class="product-card__image"
    loading="lazy" />
  <h3 class="product-card__title">Rolex Submariner</h3>
  <p class="product-card__price">₽85,000</p>
</article>
```

## Performance Optimization

### Image Optimization

- **WebP Conversion**: Automated conversion for modern browsers with fallbacks
- **Compression**: Optimized compression ratios (70-80% quality)
- **Lazy Loading**: Intersection Observer API for images below the fold
- **Responsive Images**: Multiple sizes with `srcset` for different devices
- **SVG Sprites**: Combined SVG icons for reduced HTTP requests

### JavaScript Optimization

- **Code Splitting**: Modular architecture with dynamic imports
- **Tree Shaking**: Unused code elimination via Webpack
- **Minification**: Production builds with Terser optimization
- **Source Maps**: Development debugging support

### CSS Optimization

- **SCSS Processing**: Variables, mixins, and modular architecture
- **CSS Minification**: Compressed output with gulp-clean-css
- **Autoprefixer**: Automatic vendor prefixes for browser compatibility
- **Critical CSS**: Above-the-fold CSS optimization (planned)

### Build Performance

- **Incremental Builds**: Only changed files processed during development
- **Caching**: Gulp task caching for faster subsequent builds
- **Parallel Processing**: Multiple tasks running simultaneously
- **Watch Mode**: Efficient file watching with BrowserSync

### Performance Targets

- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **First Input Delay**: < 100ms
- **Build Time**: < 30s for full build

---

## Current Status & Next Steps

### ✅ Completed Phase 1

- **API Integration**: Unified system with Cockpit CMS
- **Component System**: Modular HTML components with gulp-file-include
- **Build System**: Complete Gulp-based workflow
- **JavaScript Architecture**: Modular ES6+ structure
- **Basic Styling**: SCSS with BEM methodology

### 🔄 Phase 2 (In Progress)

**Priority: High** - Core catalog functionality

1. **Product Display System**
   - Test API connectivity with live data
   - Implement pagination logic
   - Add loading states and error handling

2. **Filter System Implementation**
   - Price range slider with nouislider
   - Brand selection checkboxes
   - Search functionality optimization
   - Sort options (price, name, popularity)

3. **Mobile Optimization**
   - Touch-friendly filter interface
   - Responsive product grid
   - Performance on mobile devices

### 📋 Phase 3 (Planned)

**Priority: Medium** - Enhanced features

- Product details enhancement with image galleries
- Wishlist functionality activation
- SEO optimization with structured data
- Performance optimization and caching strategies

---

**Document Version**: 2.0  
**Last Updated**: December 2024  
**Next Review**: After Phase 2 completion
