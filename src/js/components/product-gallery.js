/**
 * Product Gallery Component
 * Handles product image gallery functionality with GLightbox
 * Features: thumbnail navigation, main image switching, and lightbox gallery
 */

class ProductGallery {
  constructor() {
    this.container = document.querySelector('.product-details-inner')
    this.mainImage = document.getElementById('main-product-image')
    this.mainImageContainer = document.querySelector('.pro-large-img')
    this.zoomLink = document.querySelector('.zoom-icon')
    this.thumbnails = document.querySelectorAll('.pro-nav-thumb')
    this.lightbox = null

    // Gallery images data
    this.images = [
      {
        src: './img/products/1-450x450.jpg',
        title: 'Product Image 1',
        description: 'High quality product view',
      },
      {
        src: './img/products/2-450x450.jpg',
        title: 'Product Image 2',
        description: 'Another view of the product',
      },
      {
        src: './img/products/3-450x450.jpg',
        title: 'Product Image 3',
        description: 'Detailed product view',
      },
      {
        src: './img/products/4-450x450.jpg',
        title: 'Product Image 4',
        description: 'Close-up product view',
      },
      {
        src: './img/products/5-450x450.jpg',
        title: 'Product Image 5',
        description: 'Final product view',
      },
    ]

    this.currentIndex = 0

    if (this.container) {
      this.init()
    }
  }

  init() {
    this.initLightbox()
    this.bindEvents()
    console.log('Product Gallery initialized')
  }

  initLightbox() {
    // Wait for GLightbox to be available
    if (typeof GLightbox !== 'undefined') {
      this.lightbox = GLightbox({
        selector: '.glightbox',
        touchNavigation: true,
        loop: true,
        autoplayVideos: false,
        zoomable: true,
        draggable: true,
        openEffect: 'zoom',
        closeEffect: 'fade',
        slideEffect: 'slide',
        moreText: 'See more',
        moreLength: 60,
        cssEfects: {
          fade: { in: 'fadeIn', out: 'fadeOut' },
          zoom: { in: 'zoomIn', out: 'zoomOut' },
        },
      })

      // Listen to lightbox events
      this.lightbox.on('slide_changed', (data) => {
        this.syncMainImageWithLightbox(data.current.slideIndex)
      })
    } else {
      // Retry initialization after a short delay
      setTimeout(() => this.initLightbox(), 100)
    }
  }

  bindEvents() {
    // Thumbnail click events
    this.thumbnails.forEach((thumb, index) => {
      thumb.addEventListener('click', (e) => {
        e.preventDefault()
        this.switchToImage(index)
      })
    })

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (this.container && this.isInViewport(this.container)) {
        switch (e.key) {
          case 'ArrowLeft':
            e.preventDefault()
            this.previousImage()
            break
          case 'ArrowRight':
            e.preventDefault()
            this.nextImage()
            break
        }
      }
    })
  }

  switchToImage(index) {
    if (index < 0 || index >= this.images.length) return

    const imageData = this.images[index]

    // Update main image
    if (this.mainImage) {
      this.mainImage.src = imageData.src
      this.mainImage.alt = imageData.title
    }

    // Update zoom link
    if (this.zoomLink) {
      this.zoomLink.href = imageData.src
      this.zoomLink.setAttribute(
        'data-glightbox',
        `title: ${imageData.title}; description: ${imageData.description}`,
      )
    }

    // Update active states
    this.updateActiveStates(index)

    // Update current index
    this.currentIndex = index

    // Add fade effect to main image
    this.addImageTransition()
  }

  updateActiveStates(activeIndex) {
    // Update thumbnails
    this.thumbnails.forEach((thumb, index) => {
      thumb.classList.toggle('active', index === activeIndex)
    })

    // Update main image container
    if (this.mainImageContainer) {
      this.mainImageContainer.setAttribute('data-index', activeIndex)
    }
  }

  addImageTransition() {
    if (this.mainImage) {
      this.mainImage.style.opacity = '0'

      setTimeout(() => {
        this.mainImage.style.transition = 'opacity 0.3s ease-in-out'
        this.mainImage.style.opacity = '1'
      }, 50)

      // Remove transition after animation
      setTimeout(() => {
        this.mainImage.style.transition = ''
      }, 350)
    }
  }

  nextImage() {
    const nextIndex = (this.currentIndex + 1) % this.images.length
    this.switchToImage(nextIndex)
  }

  previousImage() {
    const prevIndex =
      (this.currentIndex - 1 + this.images.length) % this.images.length
    this.switchToImage(prevIndex)
  }

  syncMainImageWithLightbox(lightboxIndex) {
    // Update main image to match lightbox current slide
    if (lightboxIndex !== this.currentIndex) {
      this.switchToImage(lightboxIndex)
    }
  }

  isInViewport(element) {
    const rect = element.getBoundingClientRect()
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <=
        (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    )
  }

  // Public API methods
  goToSlide(index) {
    this.switchToImage(index)
  }

  openLightbox(index = this.currentIndex) {
    if (this.lightbox) {
      this.lightbox.openAt(index)
    }
  }

  destroy() {
    if (this.lightbox) {
      this.lightbox.destroy()
    }
    // Remove event listeners if needed
  }
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.productGallery = new ProductGallery()
})

// Also initialize if script loads after DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    if (!window.productGallery) {
      window.productGallery = new ProductGallery()
    }
  })
} else {
  if (!window.productGallery) {
    window.productGallery = new ProductGallery()
  }
}

export default ProductGallery
