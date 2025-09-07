# TIME-SPOT24 - Luxury Watch Replica Catalog

https://georgiysergeev.github.io/time-spot--store/

A modern e-commerce catalog website for luxury watch replicas, built with vanilla JavaScript and powered by Cockpit CMS for flexible content management.

## 🎯 Project Overview

TIME-SPOT24 is a sophisticated web platform showcasing premium replica watches with a focus on user experience, performance, and content management flexibility. The site features a headless CMS architecture that allows for dynamic content updates while maintaining optimal frontend performance.

### ✨ Key Features

- **Dynamic Product Catalog**: Powered by Cockpit CMS with real-time content updates
- **Responsive Design**: Mobile-first approach with modern CSS Grid and Flexbox
- **Performance Optimized**: Automated image optimization and efficient build process
- **API Integration**: RESTful API with multiple authentication methods
- **Modern Build System**: Vite.js with hot module replacement and optimized production builds

### 🛠 Technology Stack

- **Frontend**: Vanilla HTML5, CSS3/SCSS, ES6+ JavaScript
- **Backend/CMS**: [Cockpit CMS](https://getcockpit.com/)
- **Build Tool**: Vite.js with image optimization plugins
- **Styling**: SCSS with CSS custom properties and responsive design
- **Deployment**: Static build optimized for CDN delivery

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager
- Git version control
- Modern web browser for testing

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/GeorgiySergeev/time-spot--store.git
   cd time-spot.dev
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start development server**

   ```bash
   npm run dev
   ```

4. **Build for production**

   ```bash
   npm run build
   ```

5. **Preview production build**
   ```bash
   npm run preview
   ```

## 🏗 Project Structure

```
time-spot.dev/
├── src/
│   ├── css/                    # Third-party CSS libraries
│   ├── scss/                   # SCSS source files
│   │   ├── _variables.scss     # Global variables
│   │   ├── _mixins.scss        # Reusable mixins
│   │   ├── _global.scss        # Global styles
│   │   └── style.scss          # Main SCSS entry point
│   ├── js/                     # JavaScript modules
│   │   ├── main.js             # Entry point
│   │   ├── api.js              # API integration
│   │   └── cockpit-api.js      # Cockpit CMS specific API
│   ├── img/                    # Image assets
│   │   ├── product/            # Product images
│   │   ├── icons/              # Icon assets
│   │   └── webp/               # Optimized WebP images
│   └── fonts/                  # Font files
├── pages/                      # Additional HTML pages
├── public/                     # Public assets
├── index.html                  # Main page
├── catalog.html                # Product catalog page
├── vite.config.js              # Vite configuration
└── package.json                # Dependencies and scripts
```

## 🔧 Development Workflow

### Available Scripts

```bash
# Start development server with hot reload
npm run dev

# Build optimized production bundle
npm run build

# Preview production build locally
npm run preview
```

### API Configuration

The project uses Cockpit CMS for content management. API configuration is handled in `vite.config.js`:

```javascript
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

### Styling Architecture

The project uses SCSS with a modular architecture:

- **Variables**: Global CSS custom properties and SCSS variables
- **Mixins**: Reusable SCSS mixins for responsive design
- **Components**: Component-specific styles following BEM methodology
- **Responsive Design**: Mobile-first approach with breakpoint mixins

## 📚 Documentation

- **[Project Documentation](./docs/PROJECT_DOCUMENTATION.md)**: Comprehensive technical documentation
- **[Implementation Plan](./docs/IMPLEMENTATION_PLAN.md)**: Detailed development roadmap
- **[Tasks Overview](./docs/tasks.md)**: Current project status and task tracking

## 🔄 API Integration

### Cockpit CMS Integration

The project integrates with Cockpit CMS using multiple authentication methods:

1. **Header-based authentication** with `Cockpit-Token`
2. **API Key authentication** with `Api-Key` header
3. **Query parameter authentication** with token in URL
4. **POST body authentication** with token in request body

### Data Structure

Products are fetched from the `watch` collection with the following structure:

```json
{
  "id": "string",
  "title": "string",
  "description": "string",
  "price": "number",
  "brand": "string",
  "model": "string",
  "category": "string",
  "images": ["array"],
  "specifications": {
    "movement": "string",
    "case_material": "string",
    "case_size": "string"
  }
}
```

## 🎨 Features

### Current Features ✅

- Responsive design with dark/light theme support
- Basic product catalog structure
- API integration framework
- Image optimization pipeline
- Modern CSS with custom properties

### Planned Features 📋

- Dynamic product rendering from CMS
- Advanced filtering and search
- Product detail pages with image galleries
- Shopping cart functionality
- Product comparison tools
- Wishlist management
- Blog system integration

## 🚀 Deployment

### Build Process

The build process includes:

- **SCSS compilation** with autoprefixer
- **JavaScript bundling** with Vite
- **Image optimization** with WebP conversion
- **Asset optimization** with compression
- **CSS and JS minification**

### Production Build

```bash
npm run build
```

Generated files in `dist/` directory:

- Optimized HTML files
- Minified CSS and JavaScript bundles
- Compressed and optimized images
- Font files and assets

## 🔧 Configuration

### Vite Configuration

The project uses a custom Vite configuration with:

- **Image optimization plugins**
- **SCSS preprocessing**
- **Proxy configuration for API calls**
- **Custom build output structure**
- **Development server with hot reload**

### Environment Variables

No environment variables are currently required for development, but production deployment may need:

- `COCKPIT_API_TOKEN`: API token for Cockpit CMS
- `COCKPIT_BASE_URL`: Base URL for Cockpit CMS instance

## 📈 Performance

### Optimization Features

- **Image Optimization**: Automatic WebP conversion and compression
- **Code Splitting**: Modular JavaScript architecture
- **CSS Optimization**: SCSS compilation with minification
- **Asset Bundling**: Optimized production builds
- **Lazy Loading**: Planned for images and components

### Performance Targets

- First Contentful Paint: < 1.5s
- Largest Contentful Paint: < 2.5s
- Bundle Size: < 500KB (JS + CSS combined)
- Lighthouse Score: > 90 across all categories

## 🤝 Contributing

### Development Guidelines

1. Follow BEM methodology for CSS class naming
2. Use ES6+ features and modern JavaScript practices
3. Implement mobile-first responsive design
4. Write semantic HTML with accessibility considerations
5. Optimize images and assets for web delivery

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/new-feature

# Commit changes
git commit -m "feat: add new feature"

# Push branch
git push origin feature/new-feature

# Create pull request
```

## 📄 License

This project is licensed under the [MIT License](LICENSE).

## 🔗 Links

- **Repository**: [https://github.com/GeorgiySergeev/time-spot--store](https://github.com/GeorgiySergeev/time-spot--store)
- **Cockpit CMS**: [https://getcockpit.com/](https://getcockpit.com/)
- **Vite.js**: [https://vitejs.dev/](https://vitejs.dev/)

---

**Project Status**: Development Phase  
**Last Updated**: [ 17.08.2025]  
**Version**: 1.0.0-dev
