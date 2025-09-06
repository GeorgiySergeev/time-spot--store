# AOS Debug Guide

## Проблема: AOS не работает

Если AOS анимации не срабатывают, следуйте этому руководству по отладке.

## Шаги отладки

### 1. Проверьте консоль браузера

Откройте DevTools (F12) и проверьте консоль на наличие ошибок:

```javascript
// Должны появиться эти сообщения:
🎨 Initializing AOS for desktop viewport...
🎨 AOS initialized for desktop viewport
📊 AOS elements found: X
```

### 2. Проверьте загрузку AOS

В консоли выполните:

```javascript
// Проверьте, загружен ли AOS
console.log('AOS available:', typeof window.AOS !== 'undefined')

// Если AOS загружен, проверьте его состояние
if (window.AOS) {
  console.log('AOS version:', window.AOS.version)
  console.log('AOS elements:', window.AOS.elements)
}
```

### 3. Проверьте элементы с data-aos

```javascript
// Найдите все элементы с data-aos
const aosElements = document.querySelectorAll('[data-aos]')
console.log('Elements with data-aos:', aosElements.length)

// Проверьте классы на элементах
aosElements.forEach((el, index) => {
  console.log(`Element ${index + 1}:`, {
    hasAosInit: el.classList.contains('aos-init'),
    hasAosAnimate: el.classList.contains('aos-animate'),
    dataAos: el.getAttribute('data-aos'),
    offset: el.getAttribute('data-aos-offset'),
    duration: el.getAttribute('data-aos-duration'),
  })
})
```

### 4. Принудительно инициализируйте AOS

```javascript
// Если AOS не инициализирован, инициализируйте вручную
if (window.AOS) {
  window.AOS.init({
    duration: 1000,
    offset: 50,
    once: true,
  })
  window.AOS.refresh()
}
```

### 5. Проверьте CSS

Убедитесь, что AOS CSS загружен:

```javascript
// Проверьте, загружен ли AOS CSS
const aosStyles = Array.from(document.styleSheets).find(
  (sheet) => sheet.href && sheet.href.includes('aos'),
)
console.log('AOS CSS loaded:', !!aosStyles)
```

## Возможные проблемы и решения

### Проблема 1: AOS не загружается

**Симптомы:** В консоли ошибка "AOS library not loaded!"

**Решение:**

1. Проверьте, что AOS установлен: `npm list aos`
2. Пересоберите проект: `npm run build`
3. Проверьте импорт в `src/js/functions/aos.js`

### Проблема 2: Элементы не анимируются

**Симптомы:** Элементы имеют класс `aos-init`, но не `aos-animate`

**Решение:**

1. Проверьте `data-aos` атрибуты в HTML
2. Убедитесь, что элементы находятся в viewport
3. Попробуйте уменьшить `offset` значение
4. Вызовите `AOS.refresh()` после загрузки контента

### Проблема 3: Анимации слишком быстрые/медленные

**Симптомы:** Анимации происходят, но с неправильной скоростью

**Решение:**

1. Измените `duration` в настройках AOS
2. Используйте `data-aos-duration` на конкретных элементах
3. Проверьте CSS transitions

### Проблема 4: Анимации срабатывают слишком рано/поздно

**Симптомы:** Анимации начинаются не в нужный момент

**Решение:**

1. Измените `offset` значение (меньше = раньше)
2. Используйте `data-aos-offset` на конкретных элементах
3. Попробуйте разные значения `anchorPlacement`

## Тестовый файл

Используйте `test-aos.html` для тестирования AOS:

1. Откройте `test-aos.html` в браузере
2. Прокрутите страницу вниз
3. Проверьте консоль на наличие сообщений отладки
4. Убедитесь, что элементы анимируются при входе в viewport

## Полезные команды

```bash
# Пересобрать проект
npm run build

# Запустить dev сервер
npm run dev

# Проверить установленные пакеты
npm list aos
```

## Контакты

Если проблемы продолжаются, проверьте:

1. Версию браузера (AOS поддерживает современные браузеры)
2. Настройки JavaScript в браузере
3. Конфликты с другими библиотеками
