import { CONFIG } from './config.js'

// Форматирование цены
export const formatPrice = (price) => {
  const numPrice = typeof price === 'number' ? price : parseFloat(price)
  return !isNaN(numPrice) ? `$${numPrice.toFixed(2)}` : '$0.00'
}

// Получение URL изображения
export const getImageUrl = (product) => {
  if (product.img?.path) {
    return `${CONFIG.baseImageUrl}/${product.img.path}`
  }
  return product.image || CONFIG.defaultImage
}

// Нормализация одного товара
export const normalizeProduct = (product) => ({
  id: product.id || product._id || 0,
  name: product.model || product.title || product.name || 'Название товара',
  brand: product.brand || 'Бренд товара',
  price: product.price || product.currentPrice || 0,
  oldPrice: product.oldPrice || product.originalPrice,
  rating: product.rating || product.stars || 0,
  description:
    product.description ||
    product.shortDescription ||
    'Lorem ipsum dolor sit amet, consectetur adipisicing elit...',
  sku: product.sku || 'P006',
  isNew: product.isNew || product.label === 'new',
  imageUrl: getImageUrl(product),
  url: product.url || `product-details.html?id=${product.id || product._id}`,
  formattedPrice: formatPrice(product.price || product.currentPrice || 0),
  formattedOldPrice: formatPrice(
    product.oldPrice || product.originalPrice || 0,
  ),
})

// Нормализация ответа API
export const normalizeApiResponse = (data) => {
  if (Array.isArray(data)) return data

  if (data && typeof data === 'object') {
    const possibleArrays = ['data', 'products', 'items', 'results']

    for (const key of possibleArrays) {
      if (data[key] && Array.isArray(data[key])) {
        return data[key]
      }
    }

    if (data.id || data.name || data.title) {
      return [data]
    }
  }

  return []
}

// Композиция функций
export const pipe =
  (...fns) =>
  (value) =>
    fns.reduce((acc, fn) => fn(acc), value)

// Функция map для массивов
export const map = (fn) => (array) => array.map(fn)

// Образцы товаров для тестирования
export const getSampleProducts = () => [
  {
    id: 1,
    name: 'Rolex Oyster Perpetual 36',
    brand: 'Cartier',
    price: 114550.0,
    oldPrice: 700.0,
    rating: 4,
    description:
      'It is a long established fact that a reader will be distracted...',
    image: './img/products/2-450x450.jpg',
  },
  {
    id: 2,
    name: 'Omega Speedmaster Professional',
    brand: 'Omega',
    price: 850.0,
    oldPrice: 1000.0,
    rating: 5,
    description: 'A legendary timepiece with exceptional precision...',
    image: './img/products/2-450x450.jpg',
  },
  {
    id: 3,
    name: 'Patek Philippe Calatrava',
    brand: 'Patek Philippe',
    price: 1200.0,
    rating: 5,
    description: 'Elegant design meets exceptional craftsmanship...',
    image: './img/products/2-450x450.jpg',
  },
]
