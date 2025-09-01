# TIME-SPOT24 - Project Documentation

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

TIME-SPOT24 is a luxury watch replica catalog website built with modern web technologies, featuring a headless CMS architecture for flexible content management and optimal performance.

### Key Features

- **Product Catalog**: Dynamic watch catalog with filtering and search
- **Responsive Design**: Mobile-first approach with modern CSS
- **CMS Integration**: Cockpit CMS for content management
- **Performance Optimized**: Image optimization and efficient build process
- **SEO Friendly**: Structured markup and meta tag management

### Target Audience

- Luxury watch enthusiasts
- Replica watch collectors
- Mobile and desktop users globally

## Architecture

### System Architecture Diagram

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Vite Proxy   │    │  Cockpit CMS    │
│   (Vanilla JS)  │◄──►│   (Dev Server)  │◄──►│   (Backend)     │
│                 │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
    ┌────▼────┐             ┌────▼────┐             ┌────▼────┐
    │  SCSS   │             │  Image  │             │  REST   │
    │ Styling │             │ Optimization │         │   API   │
    └─────────┘             └─────────┘             └─────────┘
```

### Technology Stack

#### Frontend

- **HTML5**: Semantic markup with accessibility considerations
- **CSS3/SCSS**: Modern styling with custom properties and responsive design
- **Vanilla JavaScript**: ES6+ modules for clean, maintainable code
- **CSS Grid & Flexbox**: Layout systems for responsive design

#### Build & Development

- **Vite.js**: Fast development server and optimized production builds
- **SCSS**: CSS preprocessing with variables and mixins
- **Image Optimization**: Automated WebP conversion and compression
- **Hot Module Replacement**: Live development updates

#### Backend & Content

- **Cockpit CMS**: Headless CMS for content management
- **REST API**: JSON-based data exchange
- **Asset Management**: Image and media file handling

## Development Environment

### Prerequisites

```bash
# Required software
- Node.js (v16 or higher)
- npm or yarn package manager
- Git version control
- Modern web browser for testing
```

### Local Setup

```bash
# Clone repository
git clone https://github.com/GeorgiySergeev/time-spot--store.git
cd time-spot.dev

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Environment Configuration

```javascript
// vite.config.js - Proxy configuration
server: {
  proxy: {
    '/admin/api': {
      target: 'https://websphere.miy.link',
      changeOrigin: true,
      secure: false,
    },
    '/api': {
      target: 'https://websphere.miy.link',
      changeOrigin: true,
      secure: false,
    }
  }
}
```

## API Integration

### Cockpit CMS Configuration

#### API Endpoints

- **Base URL**: `https://websphere.miy.link`
- **Admin API**: `/admin/api/content/items/{collection}`
- **Public API**: `/api/content/items/{collection}`

#### Authentication Methods

```javascript
// Method 1: Header-based authentication
headers: {
  'Cockpit-Token': 'YOUR_API_TOKEN',
  'Content-Type': 'application/json'
}

// Method 2: API Key authentication
headers: {
  'Api-Key': 'YOUR_API_TOKEN',
  'Content-Type': 'application/json'
}

// Method 3: Query parameter authentication
url.searchParams.set('token', 'YOUR_API_TOKEN');

// Method 4: POST body authentication
body: JSON.stringify({
  token: 'YOUR_API_TOKEN'
})
```

### Data Structure

#### Product Schema

```json
{
  "id": "string",
  "title": "string",
  "description": "string",
  "price": "number",
  "brand": "string",
  "model": "string",
  "category": "string",
  "images": [
    {
      "url": "string",
      "alt": "string",
      "width": "number",
      "height": "number"
    }
  ],
  "specifications": {
    "movement": "string",
    "case_material": "string",
    "case_size": "string",
    "water_resistance": "string",
    "band_material": "string"
  },
  "status": "active|inactive",
  "featured": "boolean",
  "created_at": "datetime",
  "updated_at": "datetime"
}
```

### API Service Implementation

```javascript
// src/js/api-service.js
class ApiService {
  constructor() {
    this.baseUrl = '/api';
    this.token = 'YOUR_API_TOKEN';
  }

  async fetchProducts(filters = {}) {
    const url = new URL(`${this.baseUrl}/content/items/watch`);

    // Add filters to query parameters
    Object.entries(filters).forEach(([key, value]) => {
      if (value) url.searchParams.set(key, value);
    });

    const response = await fetch(url, {
      headers: {
        'Api-Key': this.token,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return await response.json();
  }

  async fetchProduct(id) {
    const response = await fetch(`${this.baseUrl}/content/item/watch/${id}`, {
      headers: {
        'Api-Key': this.token,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return await response.json();
  }
}
```

## Frontend Structure

### File Organization

```
src/
├── css/                    # Third-party CSS libraries
├── scss/                   # SCSS source files
│   ├── _variables.scss     # Global variables
│   ├── _mixins.scss        # Reusable mixins
│   ├── _global.scss        # Global styles
│   ├── _reset.scss         # CSS reset
│   └── style.scss          # Main SCSS entry point
├── js/                     # JavaScript modules
│   ├── main.js             # Entry point
│   ├── api.js              # API integration
│   ├── cockpit-api.js      # Cockpit specific API
│   └── components/         # Reusable components
├── img/                    # Image assets
│   ├── product/            # Product images
│   ├── icons/              # Icon assets
│   └── webp/               # Optimized WebP images
└── fonts/                  # Font files
```

### HTML Structure

```html
<!DOCTYPE html>
<html lang="en" class="dark">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>TIME-SPOT24 - Luxury Replica Watches</title>
    <meta name="description" content="Discover premium replica watches..." />

    <!-- Preload critical fonts -->
    <link rel="preload" href="src/fonts/Montserrat-Regular.woff2" as="font" />

    <!-- Import main styles -->
    <link rel="stylesheet" href="src/scss/style.scss" />
  </head>
  <body>
    <!-- Header -->
    <header class="header">
      <nav class="header__nav">
        <!-- Navigation items -->
      </nav>
    </header>

    <!-- Main content -->
    <main class="main">
      <!-- Page content -->
    </main>

    <!-- Footer -->
    <footer class="footer">
      <!-- Footer content -->
    </footer>

    <!-- Scripts -->
    <script type="module" src="/src/js/main.js"></script>
  </body>
</html>
```

### CSS Architecture

```scss
// _variables.scss
:root {
  --main-color: #1e1e20;
  --second-color: #161618;
  --accent-color: #00ff88;
  --text-color: rgba(255, 255, 245, 0.86);

  // Responsive breakpoints
  --mobile: 480px;
  --tablet: 768px;
  --desktop: 1024px;
  --large: 1200px;
}

// _mixins.scss
@mixin respond-to($breakpoint) {
  @if $breakpoint == mobile {
    @media (max-width: 480px) {
      @content;
    }
  }
  @if $breakpoint == tablet {
    @media (min-width: 481px) and (max-width: 768px) {
      @content;
    }
  }
  @if $breakpoint == desktop {
    @media (min-width: 769px) {
      @content;
    }
  }
}

@mixin flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}
```

## Build System

### Vite Configuration

```javascript
// vite.config.js
export default defineConfig({
  plugins: [
    // Image optimization
    ViteImageOptimizer({
      png: { quality: 70 },
      jpeg: { quality: 70 },
      jpg: { quality: 70 },
    }),

    // WebP conversion
    imagemin(['./src/img/**/*.{jpg,png,jpeg}'], {
      destination: './src/img/webp/',
      plugins: [imageminWebp({ quality: 70 })],
    }),
  ],

  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          // Organize assets by type
          if (/\.(png|jpe?g|gif|svg|webp)(\?.*)?$/i.test(assetInfo.name)) {
            return `assets/images/[name]-[hash][extname]`;
          }
          if (/\.(woff2?|eot|ttf|otf)(\?.*)?$/i.test(assetInfo.name)) {
            return `assets/fonts/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        },
      },
    },
  },
});
```

### Build Scripts

```json
// package.json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "build:analyze": "vite build --mode analyze"
  }
}
```

## Deployment

### Production Build

```bash
# Create optimized build
npm run build

# Generated files structure
dist/
├── index.html
├── catalog.html
├── about.html
├── blog.html
├── assets/
│   ├── images/         # Optimized images
│   ├── fonts/          # Font files
│   ├── style-[hash].css
│   └── main-[hash].js
```

### Deployment Checklist

- [ ] Environment variables configured
- [ ] API endpoints accessible
- [ ] Images optimized and converted to WebP
- [ ] CSS and JS minified
- [ ] Meta tags and SEO elements included
- [ ] Performance metrics validated
- [ ] Cross-browser testing completed

## Development Workflow

### Git Workflow

```bash
# Feature development
git checkout -b feature/product-catalog
git add .
git commit -m "feat: implement product catalog filtering"
git push origin feature/product-catalog

# Create pull request for review
```

### Testing Strategy

```javascript
// API testing
async function testApiConnection() {
  try {
    const response = await fetch('/api/content/items/watch');
    console.log('API Status:', response.status);
    return response.ok;
  } catch (error) {
    console.error('API Connection Failed:', error);
    return false;
  }
}

// Performance testing
function measurePageLoad() {
  window.addEventListener('load', () => {
    const timing = performance.timing;
    const loadTime = timing.loadEventEnd - timing.navigationStart;
    console.log('Page Load Time:', loadTime + 'ms');
  });
}
```

## Coding Standards

### JavaScript Standards

```javascript
// Use ES6+ features
const products = await fetchProducts();
const filteredProducts = products.filter((product) => product.featured);

// Async/await for API calls
async function loadProduct(id) {
  try {
    const product = await apiService.fetchProduct(id);
    renderProduct(product);
  } catch (error) {
    handleError(error);
  }
}

// Module imports/exports
export { ApiService };
import { ApiService } from './api-service.js';
```

### CSS/SCSS Standards

```scss
// BEM methodology
.product-card {
  &__image {
    width: 100%;
    height: auto;
  }

  &__title {
    font-size: 1.8rem;
    font-weight: bold;
  }

  &--featured {
    border: 2px solid var(--accent-color);
  }
}

// Mobile-first responsive design
.container {
  padding: 1rem;

  @include respond-to(tablet) {
    padding: 2rem;
  }

  @include respond-to(desktop) {
    padding: 3rem;
  }
}
```

## Performance Optimization

### Image Optimization

- WebP format conversion for modern browsers
- Lazy loading implementation
- Responsive image sizing
- Compression optimization (70% quality)

### Code Optimization

- JavaScript module bundling
- CSS minification and optimization
- Tree shaking for unused code removal
- Critical CSS inlining

### Caching Strategy

```javascript
// Service worker for caching (future implementation)
const CACHE_NAME = 'timespot-v1';
const urlsToCache = ['/', '/catalog.html', '/assets/style.css', '/assets/main.js'];
```

### Performance Targets

- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **First Input Delay**: < 100ms

---

**Document Version**: 1.0  
**Last Updated**: [Current Date]  
**Next Review**: After Phase 1 completion
