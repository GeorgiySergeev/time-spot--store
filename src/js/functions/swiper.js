// Swiper
import Swiper from 'swiper'
import {
  Autoplay,
  Thumbs,
  Pagination,
  Navigation,
  Keyboard,
} from 'swiper/modules'

// Configure Swiper to use modules
Swiper.use([Autoplay, Thumbs, Pagination, Navigation, Keyboard])

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
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
  loop: true,
  slidesPerView: 4,
  spaceBetween: 20,
  breakpoints: {
    // Mobile devices (up to 767px)
    320: {
      slidesPerView: 1,
      spaceBetween: 10,
    },
    // Small mobile (480px and up)
    480: {
      slidesPerView: 2,
      spaceBetween: 15,
    },
    // Large mobile (768px and up)
    768: {
      slidesPerView: 3,
      spaceBetween: 15,
    },
    // Tablet (992px and up)
    992: {
      slidesPerView: 4,
      spaceBetween: 20,
    },
  },
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

// Make initProductSwiper available globally for dynamic rendering
window.initProductSwiper = initProductSwiper

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

// Product Page Thumbs Configuration
const productPageThumbsConfig = {
  direction: 'horizontal',
  slidesPerView: 'auto',
  spaceBetween: 10,
  freeMode: false,
  watchSlidesProgress: true,
  slideToClickedSlide: true,
  centerInsufficientSlides: true,
  allowTouchMove: true, // Enable touch for clicking
  simulateTouch: true, // Enable touch simulation for clicks
  preventClicks: false,
  preventClicksPropagation: false,
  breakpoints: {
    320: {
      slidesPerView: 'auto',
      spaceBetween: 8,
    },
    480: {
      slidesPerView: 'auto',
      spaceBetween: 10,
    },
    768: {
      slidesPerView: 'auto',
      spaceBetween: 12,
    },
  },
}

const productPageMainConfig = {
  direction: 'horizontal',
  loop: false,
  spaceBetween: 10,
  grabCursor: true,
}

export const productPageSlider = () => {
  const thumbsElement = document.querySelector('.product-thumbs-swiper')
  const mainElement = document.querySelector('.product-main-swiper')

  if (!thumbsElement || !mainElement) {
    console.warn('Product page swiper elements not found:', {
      thumbsElement: !!thumbsElement,
      mainElement: !!mainElement,
    })
    return null
  }

  console.log('Initializing product page swipers...')

  // Initialize thumbs swiper first
  const thumbsSwiper = new Swiper(
    '.product-thumbs-swiper',
    productPageThumbsConfig,
  )
  console.log('Product Thumbs Swiper initialized:', thumbsSwiper)
  console.log('Thumbs slides count:', thumbsSwiper.slides.length)

  // Initialize main swiper with thumbs
  const mainSwiper = new Swiper('.product-main-swiper', {
    ...productPageMainConfig,
    thumbs: {
      swiper: thumbsSwiper,
    },
  })
  console.log('Product Main Swiper initialized:', mainSwiper)
  console.log('Main slides count:', mainSwiper.slides.length)

  // Add explicit click event handlers for thumbnails
  const thumbnailSlides = thumbsElement.querySelectorAll('.swiper-slide')
  thumbnailSlides.forEach((slide, index) => {
    slide.addEventListener('click', (e) => {
      e.preventDefault()
      e.stopPropagation()
      console.log(`Thumbnail ${index} clicked`)
      mainSwiper.slideTo(index)

      // Update active state manually
      thumbnailSlides.forEach((s) =>
        s.classList.remove('swiper-slide-thumb-active'),
      )
      slide.classList.add('swiper-slide-thumb-active')
    })
  })

  return { mainSwiper, thumbsSwiper }
}

// Testimonials Swiper Configuration
const testimonialsSwiperConfig = {
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
  grabCursor: true,
  keyboard: {
    enabled: true,
  },
}

export const initTestimonialsSwiper = () => {
  const swiperElement = document.querySelector('.swiper-3')
  if (!swiperElement) {
    console.warn('Testimonials swiper element not found')
    return null
  }
  const swiper = new Swiper('.swiper-3', testimonialsSwiperConfig)
  console.log('Testimonials Swiper initialized:', swiper)
  return swiper
}

document.addEventListener('DOMContentLoaded', () => {
  initHeroSwiper()
  initProductSwiper()
  initBrandSwiper()
  initTestimonialsSwiper()
  // Add a small delay for product page swiper to ensure DOM is ready
  setTimeout(() => {
    productPageSlider()
  }, 100)
})
