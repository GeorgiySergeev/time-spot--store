// Swiper
import Swiper from 'swiper'

console.log('Swiper')

// Configuration for the main hero slider
const heroSliderConfig = {
  // Optional parameters
  direction: 'horizontal',
  loop: true,

  // Autoplay configuration
  autoplay: {
    delay: 5000,
    disableOnInteraction: false,
  },

  // Effect configuration
  effect: 'fade',
  fadeEffect: {
    crossFade: true,
  },

  // Enable grab cursor
  grabCursor: true,

  // If we need pagination
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },

  // Navigation arrows
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },

  // And if we need scrollbar
  scrollbar: {
    el: '.swiper-scrollbar',
  },

  // Optional: Enable keyboard navigation
  keyboard: {
    enabled: true,
  },

  // Optional: Enable mousewheel control
  mousewheel: false,
}

// Initialize main hero Swiper
export const initHeroSwiper = () => {
  const swiperElement = document.querySelector('.swiper')
  if (!swiperElement) {
    console.warn('Hero swiper element not found')
    return null
  }

  const swiper = new Swiper('.swiper', heroSliderConfig)
  console.log('Hero Swiper initialized:', swiper)
  return swiper
}

const productSwiperConfig = {
  direction: 'horizontal',
  loop: true,
  slidesPerView: 4,
  spaceBetween: 20,
}

export const initProductSwiper = () => {
  const swiperElement = document.querySelector('.swiper-product')
  if (!swiperElement) {
    console.warn('Product swiper element not found')
    return null
  }

  const swiper = new Swiper('.swiper-product', productSwiperConfig)
  console.log('Product Swiper initialized:', swiper)
  return swiper
}

document.addEventListener('DOMContentLoaded', () => {
  initHeroSwiper()
  initProductSwiper()
})
