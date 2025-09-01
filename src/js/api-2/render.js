import {
  createProductCard,
  createProductListItem,
  createLoadingState,
  createErrorState,
  createEmptyState,
} from './templates.js'

import {
  normalizeProduct,
  normalizeApiResponse,
  pipe,
  map,
  getSampleProducts,
} from './utils.js'

import { CONFIG } from './config.js'

// DOM операции
const getContainer = (containerId) => {
  const container = document.getElementById(containerId)
  if (!container) {
    console.error(`Container #${containerId} not found`)
  }
  return container
}

const setContent = (container, content) => {
  if (container) {
    container.innerHTML = content
  }
}

// Стратегии рендеринга
const renderGrid = (products) =>
  products
    .map(
      (product) => `
      <div class="col-lg-3 col-md-6">
        ${createProductCard(product)}
      </div>
    `,
    )
    .join('')

const renderList = (products) => products.map(createProductListItem).join('')

const renderStrategies = {
  grid: renderGrid,
  list: renderList,
}

// Подготовка данных
const prepareProducts = pipe(normalizeApiResponse, map(normalizeProduct))

// Основная функция рендеринга
export const renderProducts = (
  products,
  containerId = CONFIG.defaultContainer,
  viewType = 'grid',
) => {
  const container = getContainer(containerId)
  if (!container) return

  try {
    const preparedProducts = prepareProducts(products)

    if (!preparedProducts.length) {
      setContent(container, createEmptyState())
      return
    }

    const renderStrategy = renderStrategies[viewType] || renderStrategies.grid
    const content = renderStrategy(preparedProducts)

    setContent(container, content)
    console.log(`Отображено ${preparedProducts.length} товаров (${viewType})`)
  } catch (error) {
    console.error('Ошибка рендеринга:', error)
    showError(container, error.message, containerId, viewType)
  }
}

// Вспомогательные функции
export const showLoading = (containerId) => {
  const container = getContainer(containerId)
  setContent(container, createLoadingState())
}

export const showError = (containerOrId, message, containerId, viewType) => {
  const container =
    typeof containerOrId === 'string'
      ? getContainer(containerOrId)
      : containerOrId

  const onRetry = `productRenderer.refresh('${containerId}', '${viewType}')`
  const onShowSamples = `productRenderer.showSamples('${containerId}', '${viewType}')`

  setContent(container, createErrorState(message, onRetry, onShowSamples))
}

export const clearProducts = (containerId) => {
  const container = getContainer(containerId)
  setContent(container, '')
}

// Асинхронный рендеринг
export const renderProductsAsync = async (
  productsPromise,
  containerId,
  viewType,
) => {
  showLoading(containerId)

  try {
    const products = await productsPromise
    renderProducts(products, containerId, viewType)
  } catch (error) {
    console.error('Ошибка загрузки:', error)
    const container = getContainer(containerId)
    showError(container, error.message, containerId, viewType)
  }
}

// Обновление товаров
export const refreshProducts = async (containerId, viewType) => {
  const { getProducts } = await import('./api.js')
  return renderProductsAsync(getProducts(), containerId, viewType)
}

// Показать образцы
export const showSampleProducts = (containerId, viewType) => {
  renderProducts(getSampleProducts(), containerId, viewType)
}
