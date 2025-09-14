# Time-Sphere Project Structure

## Project Root

```
.
├── LICENSE
├── README.md
├── SECURITY.md
├── package.json              # Dependencies and build scripts
├── gulpfile.js              # Gulp build configuration
├── stylelint.config.js      # CSS linting rules
├── favicon.ico
├── node_modules/            # Dependencies (auto-generated)
├── package-lock.json        # Dependency lock file
└── admin/                   # Cockpit CMS (backend system)
```

## Source Directory (`src/`)

```
src/
├── components/              # HTML Component System
│   ├── blocks/             # Content Blocks
│   │   ├── hero.html                    # Main hero section
│   │   ├── banner.html                  # Promotional banners
│   │   ├── banner-2.html                # Secondary banner
│   │   ├── product.html                 # Product display blocks
│   │   ├── product-2.html               # Extended product layouts
│   │   ├── about-block.html             # About section
│   │   ├── deals-offer.html             # Special offers
│   │   ├── premium-features.html        # Feature highlights
│   │   ├── category-banner.html         # Category sections
│   │   ├── fact-area.html               # Statistics/facts
│   │   ├── hero-shop.html               # Shop page hero
│   │   ├── brand.html                   # Brand showcases
│   │   ├── brands.html                  # Brand listings
│   │   ├── banner-bottom.html           # Bottom banners
│   │   ├── review.html                  # Customer reviews
│   │   └── skiplink.html                # Accessibility skiplink
│   ├── layout/             # Layout Components
│   │   ├── header.html                  # Main navigation header
│   │   ├── header-2.html                # Alternative header
│   │   ├── footer.html                  # Site footer
│   │   ├── footer-2.html                # Alternative footer
│   │   ├── breadcrumb.html              # Navigation breadcrumbs
│   │   ├── sidebar.html                 # Filter/navigation sidebar
│   │   ├── offcanvas.html               # Mobile off-canvas menu
│   │   ├── modal.html                   # Modal dialogs
│   │   ├── subscribe-modal.html         # Newsletter subscription
│   │   └── promo-modal.html             # Promotional modals
│   └── head/               # Document Head
│       └── head.html                    # HTML head section with meta tags
├── pages/                  # Page Templates
│   ├── index.html                       # Homepage
│   ├── about.html                       # About page
│   ├── watch.html                       # Watch catalog
│   ├── jewelry.html                     # Jewelry catalog
│   ├── product-details.html             # Product detail page
│   ├── product-details-2.html           # Extended product page
│   ├── blog.html                        # Blog listing
│   ├── blog-details.html                # Blog article page
│   ├── contacts.html                    # Contact page
│   ├── frequently-questions.html        # FAQ page
│   └── wishlist.html                    # Wishlist page
├── styles/                 # SCSS Stylesheets
│   ├── main.scss                        # Main SCSS entry point
│   ├── vendor.scss                      # Third-party CSS imports
│   ├── _variables.scss                  # SCSS variables and custom properties
│   ├── _common.scss                     # Common styles and resets
│   ├── _fonts.scss                      # Font declarations
│   ├── _header.scss                     # Header styles
│   ├── _header-2.scss                   # Alternative header styles
│   ├── _footer.scss                     # Footer styles
│   ├── _hero.scss                       # Hero section styles
│   ├── _product.scss                    # Product card/list styles
│   ├── _product-details.scss            # Product detail page styles
│   ├── _about-block.scss                # About section styles
│   ├── _deals-offer.scss                # Deals/offers styles
│   ├── _premium-features.scss           # Premium features styles
│   ├── _quick-view-modal.scss           # Product quick view modal
│   ├── _widget.scss                     # Widget components
│   ├── subscribe-modal.scss             # Newsletter modal styles
│   └── [additional component styles]
├── js/                     # JavaScript Modules
│   ├── main.js                          # Main entry point
│   ├── _api.js                          # API module loader
│   ├── _components.js                   # Component loader
│   ├── _functions.js                    # Function loader
│   ├── api/                # API Integration System
│   │   ├── config.js                    # API configuration and settings
│   │   ├── api.js                       # Core API service layer
│   │   ├── templates.js                 # HTML template generation
│   │   └── README.md                    # API documentation
│   ├── components/         # Interactive Components
│   │   ├── burger.js                    # Mobile menu toggle
│   │   ├── dialog.js                    # Modal dialogs
│   │   ├── product-tabs.js              # Product detail tabs
│   │   ├── product-detail-navigation.js # Product page navigation
│   │   ├── product-gallery.js           # Image gallery
│   │   ├── fact-counter.js              # Animated counters
│   │   ├── telegram-subscribe.js        # Telegram integration
│   │   ├── timer.js                     # Countdown timers
│   │   └── img-loading-error.js         # Image error handling
│   ├── functions/          # Utility Functions
│   │   ├── swiper.js                    # Swiper slider initialization
│   │   └── [additional utility functions]
│   ├── render/             # Dynamic Rendering
│   │   ├── collection.js                # Product collection rendering
│   │   ├── product-page.js              # Product page rendering
│   │   ├── quick-view-modal.js          # Quick view functionality
│   │   └── README.md                    # Rendering documentation
│   └── TEMP/               # Temporary development files
├── img/                    # Image Assets
│   ├── about/                           # About page images
│   ├── banner/                          # Banner images
│   ├── bg/                              # Background images
│   ├── brand/                           # Brand logos
│   ├── footer/                          # Footer graphics
│   ├── hero/                            # Hero section images
│   ├── icons/                           # Icon assets
│   ├── logo/                            # Site logos
│   ├── modals/                          # Modal dialog images
│   ├── product/                         # Sample product images
│   ├── products/                        # Product catalog images
│   ├── review/                          # Customer review avatars
│   ├── shapes/                          # Decorative shapes/graphics
│   ├── svg/                             # SVG graphics
│   ├── select-check-icon.svg            # Form element icons
│   └── skiplink-enter-icon.svg          # Accessibility icons
└── assets/                 # Static Assets
    ├── favicon.ico                      # Site favicon
    ├── fonts/              # Font Files
    │   ├── Inter-Regular.woff2          # Inter font
    │   ├── KumbhSans-Regular.woff2      # Kumbh Sans font
    │   ├── fontawesome-webfont.*        # FontAwesome icons
    │   └── Simple-Line-Icons.*          # Simple Line Icons
    └── video/              # Video Assets
        └── example.mp4                  # Sample video content
```

## Build Directory (`build/`)

```
build/                      # Production Build Output
├── index.html                           # Built homepage
├── about.html                           # Built about page
├── watch.html                           # Built watch catalog
├── jewelry.html                         # Built jewelry catalog
├── product-details.html                 # Built product page
├── product-details-2.html               # Built extended product page
├── blog.html                            # Built blog listing
├── blog-details.html                    # Built blog article
├── contacts.html                        # Built contact page
├── frequently-questions.html            # Built FAQ page
├── wishlist.html                        # Built wishlist
├── css/                    # Compiled CSS
│   ├── main.css                         # Main stylesheet (minified)
│   ├── main.css.map                     # Source map for debugging
│   ├── vendor.css                       # Third-party CSS
│   ├── vendor.css.map                   # Vendor source map
│   ├── subscribe-modal.css              # Modal styles
│   └── subscribe-modal.css.map          # Modal source map
├── js/                     # Compiled JavaScript
│   ├── main.js                          # Main bundle (minified)
│   └── main.js.map                      # Source map for debugging
├── img/                    # Optimized Images
│   ├── [same structure as src/img/]     # Optimized versions
│   └── sprite.svg                       # SVG sprite sheet
├── fonts/                  # Font Files
│   └── [copied from src/assets/fonts/]  # Web fonts
├── video/                  # Video Files
│   └── example.mp4                      # Optimized video
└── favicon.ico                          # Site favicon
```

## Configuration Directory (`gulp/`)

```
gulp/
├── config/                 # Build Configuration
│   └── paths.js                         # File paths and build settings
└── tasks/                  # Build Tasks
    ├── cache.js                         # Cache busting
    ├── clean.js                         # Clean build directory
    ├── html-include.js                  # HTML component processing
    ├── html-minify.js                   # HTML minification
    ├── images.js                        # Image optimization
    ├── resources.js                     # Asset copying
    ├── rewrite.js                       # URL rewriting
    ├── scripts-backend.js               # Backend JS processing
    ├── scripts.js                       # JavaScript bundling
    ├── sprite.js                        # SVG sprite generation
    ├── styles-backend.js                # Backend CSS processing
    ├── styles.js                        # SCSS compilation
    ├── webp.js                          # WebP image conversion
    └── zip.js                           # Project packaging
```

## Documentation Directory (`docs/`)

```
docs/
├── README.md                            # API system documentation
├── PROJECT_DOCUMENTATION.md             # Complete project documentation
├── IMPLEMENTATION_PLAN.md               # Development roadmap
├── tasks.md                            # Project tasks and status
├── structure.md                        # This file - project structure
├── ARCHITECTURE_COMPARISON.md          # Architecture analysis
├── GITHUB_PAGES_SETUP.md               # Deployment guide
├── MODAL_FIX_SUMMARY.md                # Modal fixes documentation
├── PRODUCT_DETAILS_DYNAMIC_RENDERING.md # Product rendering guide
├── REFACTORING_SUMMARY.md              # Code refactoring notes
├── SWIPER_FIX_GUIDE.md                 # Swiper implementation guide
├── AOS_DEBUG_GUIDE.md                  # Animation debugging
├── AOS_VIEWPORT_GUIDE.md               # Viewport animation guide
├── FIX_SHARE_MODAL_ERROR.md           # Share modal fixes
└── SECURITY.md                         # Security considerations
```

## Key Architecture Features

### Component-Based HTML System

- **Modular Components**: Reusable HTML blocks with gulp-file-include
- **Layout System**: Header, footer, and modal components
- **Content Blocks**: Hero sections, product displays, banners
- **Page Templates**: Complete page layouts with component includes

### Modern Build Pipeline

- **Gulp 5.0**: Advanced task runner with parallel processing
- **SCSS Processing**: Variables, mixins, and modular stylesheets
- **JavaScript Bundling**: ES6+ modules with Webpack integration
- **Image Optimization**: WebP conversion and compression
- **Asset Management**: Fonts, videos, and static file handling

### API Integration Architecture

- **Unified API System**: Centralized Cockpit CMS integration
- **Modular Structure**: Separate concerns for config, service, templates
- **Dynamic Rendering**: Client-side content generation
- **Error Handling**: Robust error management with fallbacks

### Performance Optimizations

- **Image Optimization**: Automated WebP conversion and compression
- **Code Splitting**: Modular JavaScript architecture
- **CSS Optimization**: SCSS compilation with autoprefixer
- **Caching**: Build-time optimizations and cache busting
- **Lazy Loading**: Deferred image and content loading

### Development Workflow

- **Hot Reload**: BrowserSync for live development
- **Source Maps**: Debugging support for CSS and JavaScript
- **Linting**: Stylelint for CSS quality
- **Formatting**: Prettier for consistent code style

## Dependencies Summary

### Runtime Dependencies

- **Bootstrap 5.3.7**: UI framework
- **Swiper 11.2.10**: Touch slider/carousel
- **AOS 2.3.4**: Scroll animations
- **Axios 1.11.0**: HTTP client
- **Animate.css 4.1.1**: CSS animations
- **Rellax 1.12.1**: Parallax effects
- **SimpleBar 6.2.5**: Custom scrollbars

### Development Dependencies

- **Gulp 5.0**: Build system
- **Webpack 5.91.0**: Module bundling
- **Sass 1.90.0**: SCSS processing
- **Browser Sync 3.0.3**: Development server
- **Prettier 3.4.2**: Code formatting
- **Stylelint 16.19.1**: CSS linting

---

## Project Status

✅ **Phase 1 Complete**: API integration, component system, build pipeline  
🔄 **Phase 2 In Progress**: Core catalog functionality, filtering system  
📋 **Phase 3 Planned**: Enhanced features, SEO optimization

**Total Files**: ~400+ files across all directories  
**Build Time**: ~15-30 seconds for full build  
**Live Preview**: Available at http://localhost:3000 during development
