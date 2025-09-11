const t = {
  'watch.html': 'Часы',
  'product-details.html': 'Детали товара',
  'about.html': 'О нас',
  'contacts.html': 'Контакты',
  'blog.html': 'Обзоры',
  'login.html': 'Вход',
  'register.html': 'Регистрация',
  'cart.html': 'Корзина',
  'checkout.html': 'Оформление заказа',
  'error-404.html': 'Страница не найдена',
  'compare.html': 'Сравнение товаров',
  'my-account.html': 'Мой аккаунт',
  'login-register.html': 'Вход и регистрация',
  'contact-us.html': 'Контакты',
  'privacy-policy.html': 'Политика конфиденциальности',
  'terms-of-service.html': 'Условия использования',
  'cookie-policy.html': 'Политика использования файлов cookie',
  'frequently-questions.html': 'Часто задаваемые вопросы',
  'shipping-returns.html': 'Доставка и возврат',
  'payment-methods.html': 'Методы оплаты',
}

window.addEventListener('load', () => {
  const title = document.querySelector('.breadcumb-title')
  const url = window.location.href
  const urlParts = url.split('/')
  const titleText = urlParts[urlParts.length - 1] || 'TIME SPOT24'
  console.log('titleText', titleText)
  title.textContent = t[titleText]
})
