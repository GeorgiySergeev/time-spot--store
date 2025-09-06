# Swiper Fix Guide

## Проблемы, которые были исправлены

### 1. HTML Структура

**Проблема:** Неправильная структура HTML для Swiper

```html
<!-- ❌ Неправильно -->
<div class="testimonials-area swiper-3">
  <div class="row testimonial-two swiper-wrapper">
    <div class="m-auto swiper-slide"></div>
  </div>
</div>
```

**Решение:** Правильная структура Swiper

```html
<!-- ✅ Правильно -->
<div class="swiper swiper-3">
  <div class="swiper-wrapper">
    <div class="swiper-slide"></div>
  </div>
</div>
```

### 2. JavaScript Конфигурация

**Проблема:** Синтаксические ошибки в swiper.js

```javascript
// ❌ Неправильно
const productSwiperConfig = {
  direction: 'horizontal'  // Отсутствует запятая
  loop: true,
  slidesPerView: 4,
,  // Лишняя запятая
}

export const initProductSwiper =   // Отсутствует ()
  const swiperElement = document.querySelector('.swiper-product')
```

**Решение:** Исправленный код

```javascript
// ✅ Правильно
const productSwiperConfig = {
  direction: 'horizontal',
  loop: true,
  slidesPerView: 4,
  spaceBetween: 20,
}

export const initProductSwiper = () => {
  const swiperElement = document.querySelector('.swiper-product')
  // ... остальной код
}
```

### 3. Улучшенная конфигурация Testimonials

Добавлены дополнительные функции:

- Автопрокрутка (5 секунд)
- Пагинация (точки внизу)
- Навигация (стрелки)
- Поддержка клавиатуры
- Grab cursor

## Правильная структура Swiper

### Базовая структура

```html
<div class="swiper mySwiper">
  <div class="swiper-wrapper">
    <div class="swiper-slide">Slide 1</div>
    <div class="swiper-slide">Slide 2</div>
    <div class="swiper-slide">Slide 3</div>
  </div>

  <!-- Опционально: пагинация -->
  <div class="swiper-pagination"></div>

  <!-- Опционально: навигация -->
  <div class="swiper-button-next"></div>
  <div class="swiper-button-prev"></div>
</div>
```

### JavaScript инициализация

```javascript
const swiper = new Swiper('.mySwiper', {
  direction: 'horizontal',
  loop: true,
  slidesPerView: 1,
  spaceBetween: 20,
  autoplay: {
    delay: 5000,
    disableOnInteraction: false,
  },
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
})
```

## Доступные слайдеры в проекте

1. **Hero Slider** (`.swiper`) - главный слайдер на главной странице
2. **Product Slider** (`.swiper-product`) - слайдер товаров
3. **Brand Slider** (`.swiper-brands`) - слайдер брендов
4. **Testimonials Slider** (`.swiper-3`) - слайдер отзывов
5. **Product Page Slider** - слайдер на странице товара с миниатюрами

## Отладка слайдеров

### Проверка инициализации

```javascript
// В консоли браузера
console.log('Swiper instances:', document.querySelectorAll('.swiper').length)
console.log(
  'Swiper elements:',
  document.querySelectorAll('.swiper-slide').length,
)
```

### Проверка конфигурации

```javascript
// Проверить конкретный слайдер
const swiper = document.querySelector('.swiper-3').swiper
console.log('Swiper config:', swiper.params)
console.log('Active slide:', swiper.activeIndex)
```

## Стили для навигации

Добавьте в CSS для кастомных стилей:

```scss
.swiper-button-next,
.swiper-button-prev {
  color: #007bff;
  font-size: 20px;

  &:after {
    font-size: 20px;
  }
}

.swiper-pagination-bullet {
  background: #007bff;

  &.swiper-pagination-bullet-active {
    background: #0056b3;
  }
}
```

## Результат

После исправлений:

- ✅ Слайдеры корректно инициализируются
- ✅ Навигация работает (стрелки, точки)
- ✅ Автопрокрутка включена
- ✅ Поддержка клавиатуры
- ✅ Адаптивность сохранена
