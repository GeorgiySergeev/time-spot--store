# Product Details Rendering

Этот документ описывает реализацию рендеринга карточки товара при клике на товар в системе Time Sphere.

## Общий принцип работы

1. **URL параметры**: При клике на товар пользователь переходит на `product-details.html?id=PRODUCT_ID`
2. **Извлечение ID**: JavaScript извлекает ID товара из URL параметров
3. **API запрос**: Выполняется запрос к API для получения данных товара
4. **Рендеринг**: Данные товара отображаются на странице

## Файлы

### `api.js`

- **Новая функция**: `getProductById(productId)` - получает товар по ID
- **API endpoint**: `GET /content/items/watch/{productId}`

### `product-details-renderer.js`

Основной модуль для рендеринга деталей товара:

- `getProductIdFromUrl()` - извлекает ID из URL параметров
- `renderProductDetails(productId)` - главная функция рендеринга
- `normalizeProductData(data)` - нормализует данные API
- `updateProductInfo(product)` - обновляет информацию о товаре
- `updateProductImages(product)` - обновляет изображения
- `updateProductActions(product)` - обновляет кнопки действий

### `product-details-test.js`

Тестовый модуль для разработки:

- `testProductDetails(testId)` - тестирует функциональность
- `addTestButton()` - добавляет кнопку тестирования (только в dev)

## Использование

### Автоматическая инициализация

```javascript
// Автоматически запускается при загрузке страницы product-details.html
document.addEventListener('DOMContentLoaded', () => {
  if (window.location.pathname.includes('product-details')) {
    initProductDetailsPage()
  }
})
```

### Ручной вызов

```javascript
import { renderProductDetails } from './api/product-details-renderer.js'

// Отобразить товар с конкретным ID
await renderProductDetails('689ba89567483ceaff976c13')
```

### Тестирование

```javascript
// В консоли браузера (только в dev режиме)
await testProductDetails('689ba89567483ceaff976c13')
```

## Структура данных товара

### Ожидаемые поля API:

```javascript
{
  _id: "689ba89567483ceaff976c13",
  model: "Rolex Submariner",
  brand: "Rolex",
  price: 8500.00,
  oldPrice: 9000.00,
  description: "Product description...",
  img: {
    path: "products/watch.jpg"
  },
  images: [
    { path: "products/watch-2.jpg" },
    { path: "products/watch-3.jpg" }
  ],
  rating: 5,
  sku: "ROL-SUB-001",
  categories: ["Luxury Watches", "Diving Watches"]
}
```

### Альтернативные названия полей:

- `name`, `title` вместо `model`
- `currentPrice` вместо `price`
- `originalPrice` вместо `oldPrice`
- `shortDescription` вместо `description`
- `id` вместо `_id`
- `stars` вместо `rating`

## Элементы страницы

Модуль обновляет следующие элементы на странице `product-details.html`:

### Основная информация:

- `.product-info h3` - название товара
- `.price-box .new-price` - текущая цена
- `.price-box .old-price` - старая цена
- `.product-info p` - описание товара

### Изображения:

- `#main-product-image` - главное изображение
- `.product-nav` - галерея миниатюр

### Рейтинг и детали:

- `.product-rating ul` - звезды рейтинга
- `.product-sku span` - артикул товара
- `.breadcrumb-item.active` - хлебные крошки

### Действия:

- `.cart-quantity` - форма добавления в корзину
- `.add_to_wishlist` - ссылка на избранное
- `.compare-button a` - ссылка на сравнение

## Обработка ошибок

### Состояния загрузки:

1. **Loading** - показывает оверлей с индикатором загрузки
2. **Error** - показывает сообщение об ошибке с кнопками:
   - "Попробовать снова" - перезагрузка страницы
   - "Вернуться к товарам" - переход на shop.html
3. **Success** - отображает данные товара

### Fallback данные:

При ошибке API в dev режиме используются тестовые данные для демонстрации функциональности.

## API Configuration

Настройки API находятся в `api-config.js`:

```javascript
ENDPOINTS: {
  PRODUCTS: '/content/items/watch', // для списка товаров
  // Для одного товара: '/content/items/watch/{id}'
}
```

## Примеры URL

- Просмотр товара: `product-details.html?id=689ba89567483ceaff976c13`
- Переход из списка товаров: автоматически генерируется в `product-renderer.js`

## Требования

- Страница должна содержать элементы с соответствующими классами
- API должен возвращать данные в ожидаемом формате
- Для изображений используется базовый URL: `https://websphere.miy.link/admin/storage/uploads`

## Разработка и отладка

В dev режиме доступны:

1. Кнопка тестирования в правом верхнем углу
2. Функция `testProductDetails()` в консоли
3. Подробное логирование в консоли
4. Fallback данные при ошибках API
