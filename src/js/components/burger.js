import { disableScroll } from '../functions/disable-scroll.js'
import { enableScroll } from '../functions/enable-scroll.js'
;(function () {
  const burger = document.querySelector('.burger-menu-btn')
  const offcanvas = document.querySelector('#offcanvasExample')

  if (!burger || !offcanvas) return

  // Handle Bootstrap offcanvas events
  offcanvas.addEventListener('show.bs.offcanvas', () => {
    burger.classList.add('active')
    burger.setAttribute('aria-expanded', 'true')
    burger.setAttribute('aria-label', 'Close menu')
    disableScroll()
  })

  offcanvas.addEventListener('hide.bs.offcanvas', () => {
    burger.classList.remove('active')
    burger.setAttribute('aria-expanded', 'false')
    burger.setAttribute('aria-label', 'Open menu')
    enableScroll()
  })

  // Set initial ARIA attributes
  burger.setAttribute('aria-expanded', 'false')
  burger.setAttribute('aria-label', 'Open menu')

  // Handle mobile menu dropdowns
  const initMobileMenuDropdowns = () => {
    const menuItemsWithChildren = document.querySelectorAll(
      '.mobile-menu .menu-item-has-children > a',
    )

    menuItemsWithChildren.forEach((item) => {
      item.addEventListener('click', (e) => {
        e.preventDefault()
        const parent = item.parentElement
        const submenu = parent.querySelector('ul')

        if (submenu) {
          parent.classList.toggle('active')
          submenu.style.display =
            submenu.style.display === 'block' ? 'none' : 'block'
        }
      })
    })
  }

  // Initialize dropdowns when offcanvas is shown
  offcanvas.addEventListener('shown.bs.offcanvas', initMobileMenuDropdowns)
})()
