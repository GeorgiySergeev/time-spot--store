/**
 * Time Sphere - Vanilla JavaScript ES6 Implementation
 *
 * This file has been converted from jQuery to vanilla JavaScript ES6.
 *
 * Key Features Converted:
 * ✅ Menu sticky functionality
 * ✅ Off-canvas menu
 * ✅ Category menu and submenu toggles
 * ✅ Responsive mobile menu
 * ✅ Product color selection
 * ✅ Checkout form toggles
 * ✅ Scroll up button
 *
 * Placeholders for External Libraries:
 * ⚠️  Sliders (requires Swiper.js or similar)
 * ⚠️  Countdown timers (requires custom implementation)
 * ⚠️  Price range slider (requires noUiSlider or similar)
 * ⚠️  Image zoom, lightbox, select styling (require vanilla alternatives)
 *
 * Usage:
 * - All functionality auto-initializes on DOM ready
 * - Access functions via window.utils object
 * - Individual functions can be called separately if needed
 */

// ES6 Vanilla JavaScript Implementation
'use strict'

/**
 * DOM Utilities
 */
const $ = (selector) => document.querySelector(selector)
const $$ = (selector) => document.querySelectorAll(selector)

/**
 * DOM Ready Function
 */
const ready = (fn) => {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fn)
  } else {
    fn()
  }
}

/**
 * Menu Sticky Functionality
 */
const initMenuSticky = () => {
  const sticky = $('.header-sticky')
  if (!sticky) return

  const handleScroll = () => {
    const scroll = window.pageYOffset || document.documentElement.scrollTop
    if (scroll < 300) {
      sticky.classList.remove('is-sticky')
    } else {
      sticky.classList.add('is-sticky')
    }
  }

  window.addEventListener('scroll', handleScroll)
}

/**
 * Off Canvas Menu Functionality
 */
const initOffCanvas = () => {
  const offCanvasBtn = $('.off-canvas-btn')
  const offCanvasWrapper = $('.off-canvas-wrapper')
  const body = document.body
  const closeElements = $$('.btn-close-off-canvas, .off-canvas-overlay')

  if (offCanvasBtn) {
    offCanvasBtn.addEventListener('click', () => {
      body.classList.add('fix')
      offCanvasWrapper?.classList.add('open')
    })
  }

  closeElements.forEach((element) => {
    element.addEventListener('click', () => {
      body.classList.remove('fix')
      offCanvasWrapper?.classList.remove('open')
    })
  })
}

/**
 * Countdown Timer Implementation
 * Custom vanilla JavaScript countdown timer
 */
const initCountdown = () => {
  const countdownElements = $$('[data-countdown]')

  countdownElements.forEach((element) => {
    const targetDate = element.getAttribute('data-countdown')
    if (!targetDate) return

    // Parse target date
    const target = new Date(targetDate).getTime()

    // Create countdown display structure
    element.innerHTML = `
      <div class="countdown-timer">
        <div class="countdown-item">
          <span class="countdown-number" data-days>00</span>
          <span class="countdown-label">Days</span>
        </div>
        <div class="countdown-item">
          <span class="countdown-number" data-hours>00</span>
          <span class="countdown-label">Hours</span>
        </div>
        <div class="countdown-item">
          <span class="countdown-number" data-minutes>00</span>
          <span class="countdown-label">Minutes</span>
        </div>
        <div class="countdown-item">
          <span class="countdown-number" data-seconds>00</span>
          <span class="countdown-label">Seconds</span>
        </div>
      </div>
    `

    // Update countdown every second
    const updateCountdown = () => {
      const now = new Date().getTime()
      const distance = target - now

      if (distance < 0) {
        // Countdown finished
        element.innerHTML =
          '<div class="countdown-finished">Offer Expired</div>'
        return
      }

      // Calculate time units
      const days = Math.floor(distance / (1000 * 60 * 60 * 24))
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      )
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((distance % (1000 * 60)) / 1000)

      // Update display
      const daysEl = element.querySelector('[data-days]')
      const hoursEl = element.querySelector('[data-hours]')
      const minutesEl = element.querySelector('[data-minutes]')
      const secondsEl = element.querySelector('[data-seconds]')

      if (daysEl) daysEl.textContent = days.toString().padStart(2, '0')
      if (hoursEl) hoursEl.textContent = hours.toString().padStart(2, '0')
      if (minutesEl) minutesEl.textContent = minutes.toString().padStart(2, '0')
      if (secondsEl) secondsEl.textContent = seconds.toString().padStart(2, '0')
    }

    // Initial update
    updateCountdown()

    // Update every second
    const countdownInterval = setInterval(updateCountdown, 1000)

    // Store interval ID for potential cleanup
    element.dataset.intervalId = countdownInterval
  })
}

/**
 * Category Menu Active Functionality
 */
const initCategoryMenu = () => {
  const categoryTitle = $('.categories_title')
  const categoryToggle = $('.categories_menu_toggle')
  const moreToggle = $('.categories-more-less')
  const hideChild = $('.hide-child')

  if (categoryTitle && categoryToggle) {
    categoryTitle.addEventListener('click', () => {
      categoryTitle.classList.toggle('active')

      // Vanilla JS slideToggle equivalent
      if (
        categoryToggle.style.display === 'none' ||
        !categoryToggle.style.display
      ) {
        categoryToggle.style.display = 'block'
      } else {
        categoryToggle.style.display = 'none'
      }
    })
  }

  if (moreToggle && hideChild) {
    moreToggle.addEventListener('click', () => {
      // Vanilla JS slideToggle equivalent
      if (hideChild.style.display === 'none' || !hideChild.style.display) {
        hideChild.style.display = 'block'
      } else {
        hideChild.style.display = 'none'
      }
      moreToggle.classList.toggle('rx-change')
    })
  }
}

/**
 * Category Sub Menu Toggle Functionality
 */
const initCategorySubMenuToggle = () => {
  const menuItems = $$('.categories_menu_toggle li.menu_item_children > a')

  menuItems.forEach((link) => {
    // Add expand span to each menu item
    if (!link.querySelector('.expand')) {
      const expandSpan = document.createElement('span')
      expandSpan.className = 'expand'
      link.appendChild(expandSpan)
    }

    link.addEventListener('click', (e) => {
      if (window.innerWidth < 991) {
        e.preventDefault()
        link.removeAttribute('href')

        const parentLi = link.parentElement
        const isOpen = parentLi.classList.contains('open')

        if (isOpen) {
          // Close current menu
          parentLi.classList.remove('open')
          parentLi
            .querySelectorAll('li')
            .forEach((li) => li.classList.remove('open'))
          parentLi
            .querySelectorAll('ul')
            .forEach((ul) => (ul.style.display = 'none'))
        } else {
          // Close all sibling menus
          const siblings = [...parentLi.parentElement.children].filter(
            (li) => li !== parentLi,
          )
          siblings.forEach((sibling) => {
            sibling.classList.remove('open')
            sibling
              .querySelectorAll('li')
              .forEach((li) => li.classList.remove('open'))
            sibling
              .querySelectorAll('ul')
              .forEach((ul) => (ul.style.display = 'none'))
          })

          // Open current menu
          parentLi.classList.add('open')
          const childUl = parentLi.querySelector('ul')
          if (childUl) {
            childUl.style.display = 'block'
          }
        }
      }
    })
  })
}

/**
 * Responsive Mobile Menu Functionality
 */
const initResponsiveMobileMenu = () => {
  const offCanvasNav = $('.mobile-menu')
  if (!offCanvasNav) return

  const offCanvasNavSubMenus = offCanvasNav.querySelectorAll('.dropdown')

  // Add toggle button to each submenu parent
  offCanvasNavSubMenus.forEach((submenu) => {
    const parent = submenu.parentElement
    if (!parent.querySelector('.menu-expand')) {
      const toggleButton = document.createElement('span')
      toggleButton.className = 'menu-expand'
      toggleButton.innerHTML = '<i></i>'
      parent.prepend(toggleButton)
    }
  })

  // Initially hide all submenus
  offCanvasNavSubMenus.forEach((submenu) => {
    submenu.style.display = 'none'
  })

  // Handle menu toggle clicks
  offCanvasNav.addEventListener('click', (e) => {
    const target = e.target
    const isLink = target.tagName === 'A'
    const isExpander = target.closest('.menu-expand')

    if (isLink || isExpander) {
      const clickedElement = isExpander ? isExpander : target
      const parentLi = clickedElement.closest('li')
      const parentClasses = parentLi.className

      // Check if this is a menu item with children
      const hasChildren =
        /\b(menu-item-has-children|has-children|has-sub-menu)\b/.test(
          parentClasses,
        )
      const isHashLink = isLink && target.getAttribute('href') === '#'

      if (hasChildren && (isHashLink || isExpander)) {
        e.preventDefault()

        const siblingUl = parentLi.querySelector('ul')
        const isVisible = siblingUl && siblingUl.style.display !== 'none'

        if (isVisible) {
          // Close current submenu
          parentLi.classList.remove('active')
          if (siblingUl) {
            siblingUl.style.display = 'none'
          }
        } else {
          // Close all sibling submenus
          const siblings = [...parentLi.parentElement.children].filter(
            (li) => li !== parentLi,
          )
          siblings.forEach((sibling) => {
            sibling.classList.remove('active')
            sibling
              .querySelectorAll('li')
              .forEach((li) => li.classList.remove('active'))
            sibling
              .querySelectorAll('ul')
              .forEach((ul) => (ul.style.display = 'none'))
          })

          // Open current submenu
          parentLi.classList.add('active')
          if (siblingUl) {
            siblingUl.style.display = 'block'
          }
        }
      }
    }
  })
}

/**
 * Hero Slider Functionality (Requires Slick replacement)
 * TODO: Replace with vanilla JS slider library like Swiper.js or Glide.js
 */
const initHeroSlider = () => {
  const heroSlider = $('.hero-slider-one')
  if (!heroSlider) return

  console.warn('Hero slider requires external library (e.g., Swiper.js)')
  // Placeholder for slider initialization
}

/**
 * Product Slider Functionality (Requires Slick replacement)
 * TODO: Replace with vanilla JS slider library
 */
const initProductSlider = () => {
  const productSlider = $('.product-active-lg-4')
  if (!productSlider) return

  console.warn('Product slider requires external library')
  // Placeholder for slider initialization
}
/**
 * Product Row Slider Functionality (Requires Slick replacement)
 * TODO: Replace with vanilla JS slider library
 */
const initProductRowSlider = () => {
  const productRowSlider = $('.product-active-row-4')
  if (!productRowSlider) return

  console.warn('Product row slider requires external library')
  // Placeholder for slider initialization
}

/**
 * Brand Slider Functionality (Requires Slick replacement)
 * TODO: Replace with vanilla JS slider library
 */
const initBrandSlider = () => {
  const brandSlider = $('.our-brand-active')
  if (!brandSlider) return

  console.warn('Brand slider requires external library')
  // Placeholder for slider initialization
}
/**
 * Testimonial Slider Functionality (Requires Slick replacement)
 * TODO: Replace with vanilla JS slider library
 */
const initTestimonialSlider = () => {
  const testimonialSlider = $('.testimonial-two')
  if (!testimonialSlider) return

  console.warn('Testimonial slider requires external library')
  // Placeholder for slider initialization
}

/**
 * Product Details Color Selection
 */
const initProductColorSelection = () => {
  const colorOptions = $$('.watch-color li')

  colorOptions.forEach((option) => {
    option.addEventListener('click', () => {
      // Remove checked class from all siblings
      colorOptions.forEach((sibling) => sibling.classList.remove('checked'))
      // Add checked class to clicked element
      option.classList.add('checked')
    })
  })
}

/**
 * Alternative Countdown Timer Implementation
 * TODO: Replace with vanilla JS countdown library or custom implementation
 */
const initAlternativeCountdown = () => {
  const countdownElements = $$('[data-countdown]')

  countdownElements.forEach((element) => {
    console.warn('Alternative countdown functionality requires implementation')
    // Placeholder for countdown implementation
  })
}

/**
 * Price Range Slider (Requires jQuery UI replacement)
 * TODO: Replace with vanilla JS range slider library like noUiSlider
 */
const initPriceSlider = () => {
  const priceSlider = $('#price-slider')
  const minPrice = $('#min-price')
  const maxPrice = $('#max-price')

  if (!priceSlider) return

  console.warn('Price slider requires external library (e.g., noUiSlider)')
  // Placeholder for price slider initialization

  // Set default values
  if (minPrice) minPrice.value = '$20'
  if (maxPrice) maxPrice.value = '$115'
}

/**
 * Category Sub Menu Activation
 */
const initCategorySubMenu = () => {
  const subMenuLinks = $$('.category-sub-menu li.has-sub > a')

  subMenuLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault()
      link.removeAttribute('href')

      const parentLi = link.parentElement
      const isOpen = parentLi.classList.contains('open')

      if (isOpen) {
        // Close current menu
        parentLi.classList.remove('open')
        parentLi
          .querySelectorAll('li')
          .forEach((li) => li.classList.remove('open'))
        parentLi
          .querySelectorAll('ul')
          .forEach((ul) => (ul.style.display = 'none'))
      } else {
        // Close all sibling menus
        const siblings = [...parentLi.parentElement.children].filter(
          (li) => li !== parentLi,
        )
        siblings.forEach((sibling) => {
          sibling.classList.remove('open')
          sibling
            .querySelectorAll('li')
            .forEach((li) => li.classList.remove('open'))
          sibling
            .querySelectorAll('ul')
            .forEach((ul) => (ul.style.display = 'none'))
        })

        // Open current menu
        parentLi.classList.add('open')
        const childUl = parentLi.querySelector('ul')
        if (childUl) {
          childUl.style.display = 'block'
        }
      }
    })
  })
}

/**
 * Product Details Slider (Requires Slick replacement)
 * TODO: Replace with vanilla JS slider library for product gallery
 */
const initProductDetailsSlider = () => {
  const productLargeSlider = $('.product-large-slider')
  const productNav = $('.product-nav')

  if (!productLargeSlider || !productNav) return

  console.warn('Product details slider requires external library')
  // Placeholder for product slider initialization
}

/**
 * Checkout Form Toggle Functions
 */
const initCheckoutForms = () => {
  // Show login toggle
  const showLoginBtn = $('#showlogin')
  const checkoutLogin = $('#checkout-login')

  if (showLoginBtn && checkoutLogin) {
    showLoginBtn.addEventListener('click', () => {
      // Vanilla JS slideToggle equivalent
      if (
        checkoutLogin.style.display === 'none' ||
        !checkoutLogin.style.display
      ) {
        checkoutLogin.style.display = 'block'
      } else {
        checkoutLogin.style.display = 'none'
      }
    })
  }

  // Show coupon toggle
  const showCouponBtn = $('#showcoupon')
  const checkoutCoupon = $('#checkout-coupon')

  if (showCouponBtn && checkoutCoupon) {
    showCouponBtn.addEventListener('click', () => {
      // Vanilla JS slideToggle equivalent
      if (
        checkoutCoupon.style.display === 'none' ||
        !checkoutCoupon.style.display
      ) {
        checkoutCoupon.style.display = 'block'
      } else {
        checkoutCoupon.style.display = 'none'
      }
    })
  }

  // Checkout box 1 toggle
  const checkoutBox = $('#chekout-box')
  const accountCreate = $('.account-create')

  if (checkoutBox && accountCreate) {
    checkoutBox.addEventListener('change', () => {
      if (
        accountCreate.style.display === 'none' ||
        !accountCreate.style.display
      ) {
        accountCreate.style.display = 'block'
      } else {
        accountCreate.style.display = 'none'
      }
    })
  }

  // Checkout box 2 toggle
  const checkoutBox2 = $('#chekout-box-2')
  const shipBoxInfo = $('.ship-box-info')

  if (checkoutBox2 && shipBoxInfo) {
    checkoutBox2.addEventListener('change', () => {
      if (shipBoxInfo.style.display === 'none' || !shipBoxInfo.style.display) {
        shipBoxInfo.style.display = 'block'
      } else {
        shipBoxInfo.style.display = 'none'
      }
    })
  }
}

/**
 * Scroll Up Functionality (Vanilla JS implementation)
 */
const initScrollUp = () => {
  // Create scroll up button
  const scrollUpBtn = document.createElement('button')
  scrollUpBtn.innerHTML = '<i class="fa fa-angle-up"></i>'
  scrollUpBtn.className = 'scroll-up-btn'
  scrollUpBtn.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 9999;
    background: #333;
    color: white;
    border: none;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    cursor: pointer;
    display: none;
    transition: opacity 0.3s ease;
  `

  document.body.appendChild(scrollUpBtn)

  // Show/hide button based on scroll position
  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
      scrollUpBtn.style.display = 'block'
    } else {
      scrollUpBtn.style.display = 'none'
    }
  })

  // Scroll to top when clicked
  scrollUpBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  })
}

/**
 * Global link handler to prevent scroll-to-top behavior
 */
const initGlobalLinkHandler = () => {
  // Prevent all links with href="#" from scrolling to top
  document.addEventListener(
    'click',
    (e) => {
      const link = e.target.closest('a[href="#"]')
      if (link && !link.classList.contains('quick-view')) {
        // Only prevent default for non-quick-view links with href="#"
        e.preventDefault()
        console.log('Prevented scroll-to-top for link:', link)
      }
    },
    { capture: true },
  )

  console.log('Global link handler initialized')
}

/**
 * Check Dependencies
 * Logs the status of all external dependencies
 */
const checkDependencies = () => {
  const dependencies = {
    Bootstrap: typeof bootstrap !== 'undefined',
    GLightbox: typeof GLightbox !== 'undefined',
  }

  console.log('📋 Dependency Status:')
  Object.entries(dependencies).forEach(([name, loaded]) => {
    console.log(
      `${loaded ? '✅' : '❌'} ${name}: ${loaded ? 'Loaded' : 'Not loaded'}`,
    )
  })

  return dependencies
}

/**
 * Main Initialization Function
 *
 */
const initializeApp = () => {
  // Check and log dependency status
  const deps = checkDependencies()

  // Initialize global handlers first
  initGlobalLinkHandler()

  // Initialize all converted functionality
  initMenuSticky()
  initOffCanvas()
  initCountdown()
  initCategoryMenu()
  initCategorySubMenuToggle()
  initResponsiveMobileMenu()
  initProductColorSelection()
  initCheckoutForms()
  initCategorySubMenu()
  initScrollUp()

  // Placeholder functions for external library dependencies
  initHeroSlider()
  initProductSlider()
  initProductRowSlider()
  initBrandSlider()
  initTestimonialSlider()
  initProductDetailsSlider()
  initAlternativeCountdown()
  initPriceSlider()

  // Initialize lightbox with delay to ensure GLightbox is loaded
  // Note: initLightbox is imported and called directly, not from window
  setTimeout(() => {
    // This will be handled by the imported function
    console.log('Lightbox initialization scheduled')
  }, 200)

  console.log('🚀 Time Sphere - Vanilla JS initialized')

  // Show warning if critical dependencies are missing
  if (!deps.Bootstrap) {
    console.warn('⚠️  Bootstrap not loaded - modals may not work properly')
  }
}

// Initialize when DOM is ready
ready(initializeApp)

// Export functions for potential external use
window.utils = {
  // Core functionality
  initMenuSticky,
  initOffCanvas,
  initCountdown,
  initCategoryMenu,
  initCategorySubMenuToggle,
  initResponsiveMobileMenu,
  initProductColorSelection,
  initCheckoutForms,
  initCategorySubMenu,
  initScrollUp,

  // Placeholder functions for external libraries
  initHeroSlider,
  initProductSlider,
  initProductRowSlider,
  initBrandSlider,
  initTestimonialSlider,
  initProductDetailsSlider,
  initAlternativeCountdown,
  initPriceSlider,
  initGlobalLinkHandler,
  checkDependencies,

  // Main initialization
  initialize: initializeApp,

  // Utility functions
  $: $,
  $$: $$,
  ready: ready,
}
