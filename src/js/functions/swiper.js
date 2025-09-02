// Swiper
import Swiper from 'swiper'
import { Autoplay } from 'swiper/modules'

// Configure Swiper to use modules
Swiper.use([Autoplay])

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

// Product Swiper Configuration
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

// Brand Swiper Configuration
const brandSwiperConfig = {
  direction: 'horizontal',
  loop: true,
  slidesPerView: 6,
  spaceBetween: 30,
  autoplay: {
    delay: 3000,
    disableOnInteraction: false,
  },
  grabCursor: true,
  breakpoints: {
    // When window width is >= 320px
    320: {
      slidesPerView: 2,
      spaceBetween: 10,
    },
    // When window width is >= 480px
    480: {
      slidesPerView: 3,
      spaceBetween: 15,
    },
    // When window width is >= 768px
    768: {
      slidesPerView: 4,
      spaceBetween: 20,
    },
    // When window width is >= 1024px
    1024: {
      slidesPerView: 5,
      spaceBetween: 25,
    },
    // When window width is >= 1200px
    1200: {
      slidesPerView: 6,
      spaceBetween: 30,
    },
  },
}
export const initBrandSwiper = () => {
  const swiperElement = document.querySelector('.swiper-brands')
  if (!swiperElement) {
    console.warn('Brand swiper element not found')
    return null
  }

  const swiper = new Swiper('.swiper-brands', brandSwiperConfig)
  console.log('Brand Swiper initialized:', swiper)
  return swiper
}

document.addEventListener('DOMContentLoaded', () => {
  initHeroSwiper()
  initProductSwiper()
  initBrandSwiper()
})
