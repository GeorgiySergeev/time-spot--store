import {
  renderProducts,
  renderProductsAsync,
  showLoading,
  clearProducts,
  refreshProducts,
  showSampleProducts,
} from './render.js'

// Для использования в HTML
if (typeof window !== 'undefined') {
  window.productRenderer = {
    render: renderProducts,
    renderAsync: renderProductsAsync,
    refresh: refreshProducts,
    clear: clearProducts,
    showSamples: showSampleProducts,
  }
}

// Экспорт для ES модулей
export {
  renderProducts,
  renderProductsAsync as renderProductsWithLoader,
  clearProducts,
  refreshProducts,
  showSampleProducts as testProductRendering,
}

console.log('API loaded')
