// Unified API Configuration for Cockpit CMS Integration
// Updated with confirmed data structure: id, brand, model, price, img, category, in_stock

export const API_CONFIG = {
  // API Credentials
  API_KEY: 'API-7c2cde63ceaca7aa2da97700466244e1f4f59c6e',
  BASE_URL: 'https://time-spot24.wpsphere.miy.link/api',

  // Endpoints
  ENDPOINTS: {
    PRODUCTS: '/content/items/watch',
    PRODUCT_BY_ID: '/content/item/watch',
    CATEGORIES: '/content/items/watch',
    // Future endpoints
    BLOG: '/content/blog',
    USERS: '/users',
  },

  // Product Categories
  CATEGORIES: {
    WATCH: 'watch',
    JEWELRY: 'jewelry',
    ACCESSORIES: 'accessories',
  },

  // Image Configuration
  IMAGES: {
    BASE_URL: 'https://time-spot24.wpsphere.miy.link/storage/uploads',
    DEFAULT_IMAGE: '/img/product/default.jpg',
    LAZY_LOADING: true,
  },

  // Request Settings
  TIMEOUT: 15000, // 15 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second

  // Headers
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },

  // UI Configuration
  UI: {
    DEFAULT_CONTAINER: 'products',
    PRODUCTS_PER_PAGE: 12,
    VIEW_MODES: ['grid', 'list'],
    DEFAULT_VIEW: 'grid',
  },

  // Filter Configuration
  FILTERS: {
    PRICE: {
      MIN: 0,
      MAX: 5000,
      STEP: 50,
      DEFAULT_RANGE: [0, 5000],
    },
    BRANDS: [], // Will be populated from API data
    SORT_OPTIONS: [
      { value: 'price_asc', label: 'Цена: по возрастанию' },
      { value: 'price_desc', label: 'Цена: по убыванию' },
      { value: 'name_asc', label: 'Название: А-Я' },
      { value: 'name_desc', label: 'Название: Я-А' },
      { value: 'newest', label: 'Новинки' },
    ],
  },

  // Debug Mode
  DEBUG: true,

  // Error Handling
  SHOW_ERROR_UI: true,
  LOG_ERRORS: true,

  // Fallback Mode (use sample data when API fails)
  FALLBACK_MODE: true,

  // SEO Configuration
  SEO: {
    ENABLED: true,
    STRUCTURED_DATA: true,
    OPEN_GRAPH: true,
    META_DESCRIPTION_MAX: 160,
    TITLE_TEMPLATE: '{productName} - Time Sphere',
  },
}

// Environment-specific overrides
if (
  window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1'
) {
  API_CONFIG.DEBUG = true
  console.log('🔧 Development mode detected - Debug logging enabled')
}

// Validate configuration
export const validateConfig = () => {
  const issues = []

  if (!API_CONFIG.API_KEY || API_CONFIG.API_KEY.length < 10) {
    issues.push('API_KEY is missing or too short')
  }

  if (!API_CONFIG.BASE_URL || !API_CONFIG.BASE_URL.startsWith('http')) {
    issues.push('BASE_URL is missing or invalid')
  }

  if (issues.length > 0) {
    console.error('❌ API Configuration Issues:', issues)
    return false
  }

  if (API_CONFIG.DEBUG) {
    console.log('✅ API Configuration is valid')
  }
  return true
}

// Get full URL for an endpoint
export const getApiUrl = (endpoint) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`
}

// Get headers with API key
export const getApiHeaders = (additionalHeaders = {}) => {
  return {
    ...API_CONFIG.DEFAULT_HEADERS,
    Authorization: `Bearer ${API_CONFIG.API_KEY}`,
    'api-key': API_CONFIG.API_KEY,
    ...additionalHeaders,
  }
}

// Get image URL helper
export const getImageUrl = (imagePath) => {
  if (!imagePath) return API_CONFIG.IMAGES.DEFAULT_IMAGE

  if (typeof imagePath === 'string' && imagePath.startsWith('http')) {
    return imagePath
  }

  const relativePath =
    typeof imagePath === 'string'
      ? imagePath
      : imagePath?.path || imagePath?.file || imagePath?.url || ''

  if (!relativePath) return API_CONFIG.IMAGES.DEFAULT_IMAGE

  return relativePath.startsWith('http')
    ? relativePath
    : `${API_CONFIG.IMAGES.BASE_URL}/${relativePath}`
}

// Normalize various possible image shapes (string | object | array) to array of URLs
const getImageUrlsArray = (product) => {
  // Common Cockpit field names: img, images, media, gallery
  const raw =
    product?.images ||
    product?.gallery ||
    product?.media ||
    product?.imgs ||
    product?.img

  if (!raw) return []

  if (Array.isArray(raw)) {
    return raw
      .map((item) => {
        // item can be string path, asset object, or nested { path }
        if (!item) return null
        const pathLike =
          typeof item === 'string'
            ? item
            : item.path || item.file || item.url || item.src
        return pathLike ? getImageUrl(pathLike) : null
      })
      .filter(Boolean)
  }

  // Single value (string or object)
  return [getImageUrl(raw?.path || raw?.file || raw?.url || raw)]
}

// Build API query parameters for filtering
export const buildApiQuery = (filters = {}) => {
  const query = new URLSearchParams()

  // Category filter
  if (filters.category) {
    query.append('filter[category]', filters.category)
  }

  // Price range filter
  if (filters.priceMin !== undefined) {
    query.append('filter[price][$gte]', filters.priceMin)
  }
  if (filters.priceMax !== undefined) {
    query.append('filter[price][$lte]', filters.priceMax)
  }

  // Brand filter
  if (filters.brands && filters.brands.length > 0) {
    query.append('filter[brand][$in]', filters.brands.join(','))
  }

  // Search filter
  if (filters.search) {
    query.append('filter[$or][0][model][$regex]', filters.search)
    query.append('filter[$or][1][brand][$regex]', filters.search)
  }

  // Sorting
  if (filters.sort) {
    const [field, direction] = filters.sort.split('_')
    query.append('sort', direction === 'desc' ? `-${field}` : field)
  }

  // Pagination
  if (filters.limit) {
    query.append('limit', filters.limit)
  }
  if (filters.skip) {
    query.append('skip', filters.skip)
  }

  return query.toString()
}

// Product data normalization for confirmed CMS structure
export const normalizeProduct = (product) => {
  const images = getImageUrlsArray(product)

  return {
    id: product.id || product._id,
    brand: product.brand || 'Unknown Brand',
    model: product.model || 'Unknown Model',
    description: product.description || 'Описание товара отсутствует.',
    name:
      `${product.brand || ''} ${product.model || ''}`.trim() ||
      'Untitled Product',
    price: parseFloat(product.price) || 0,
    images,
    imageUrl: images[0] || getImageUrl(product.img?.path || product.img),
    category: product.category || 'watch',
    inStock: product.in_stock !== false, // Default to true if not specified
    url: `product-details.html?id=${product.id || product._id}`,
    formattedPrice: formatPrice(product.price),
    sku: `${product.brand}-${product.model}`.replace(/\s+/g, '-').toLowerCase(),
  }
}

// Price formatting helper
export const formatPrice = (price) => {
  const numPrice = parseFloat(price) || 0
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(numPrice)
}
