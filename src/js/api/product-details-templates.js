// Product Details Page Templates
// Templates for dynamic rendering of Single Product Details Page

const BASE_IMAGE_URL = 'https://websphere.miy.link/admin/storage/uploads'

// Main product gallery template
export const createProductGallery = (product) => {
  const images = product.images || product.gallery || []
  const mainImage = images[0] ||
    product.img || { path: '/img/default/single-product-item.jpg' }

  // If no images available, create a default gallery with the default image
  if (images.length === 0) {
    return {
      mainImage: '/img/default/single-product-item.jpg',
      gallery: [
        {
          src: '/img/default/single-product-item.jpg',
          alt: `${product.model || product.name || 'Product'} - Default Image`,
          title: `${product.model || product.name || 'Product'} - Default View`,
          description: `Default product image for ${product.model || product.name || 'Product'}`,
        },
      ],
    }
  }

  return {
    mainImage: mainImage.path
      ? `${BASE_IMAGE_URL}${mainImage.path}`
      : mainImage,
    gallery: images.map((img, index) => ({
      src: img.path ? `${BASE_IMAGE_URL}${img.path}` : img,
      alt: img.alt || `${product.model || product.name} - Image ${index + 1}`,
      title:
        img.title || `${product.model || product.name} - View ${index + 1}`,
      description:
        img.description ||
        `High quality view of ${product.model || product.name}`,
    })),
  }
}

// Product main images swiper template
export const createMainImagesSwiper = (product) => {
  const gallery = createProductGallery(product)

  return `
    <div class="swiper product-main-swiper" id="product_page_slider">
      <div class="swiper-wrapper">
        ${gallery.gallery
          .map(
            (image, index) => `
          <div class="swiper-slide">
            <div class="pro-large-img img-zoom">
              <img
                src="${image.src}"
                alt="${image.alt}"
                id="main-product-image" />
              <a
                href="${image.src}"
                class="glightbox zoom-icon"
                data-gallery="product-gallery"
                data-glightbox="title: ${image.title}; description: ${image.description}">
                <i class="fa fa-search"></i>
              </a>
            </div>
          </div>
        `,
          )
          .join('')}
      </div>
    </div>
  `
}

// Product thumbnail navigation swiper template
export const createThumbnailSwiper = (product) => {
  const gallery = createProductGallery(product)

  return `
    <div class="swiper product-thumbs-swiper">
      <div class="swiper-wrapper">
        ${gallery.gallery
          .map(
            (image, index) => `
          <div class="swiper-slide">
            <div class="pro-nav-thumb">
              <img
                src="${image.src}"
                alt="${image.alt}" />
              <a
                href="${image.src}"
                class="glightbox hidden-gallery-item"
                data-gallery="product-gallery"
                data-glightbox="title: ${image.title}; description: ${image.description}"></a>
            </div>
          </div>
        `,
          )
          .join('')}
      </div>
    </div>
  `
}

// Product information section template
export const createProductInfo = (product) => {
  const rating = product.rating || product.stars || 5
  const reviewsCount = product.reviewsCount || product.reviewCount || 1

  return `
    <div class="product-info">
      <h3>${product.model || product.name || product.title || 'Product Name'}</h3>
      <div class="product-rating d-flex">
        <ul class="d-flex">
          ${[...Array(5)]
            .map(
              (_, i) => `
            <li>
              <a href="#"><i class="icon-star"></i></a>
            </li>
          `,
            )
            .join('')}
        </ul>
        <a href="#reviews">
          (
          <span class="count">${reviewsCount}</span>
          отзыв покупателя)
        </a>
      </div>
      <div class="price-box">
        <span class="new-price">${formatPrice(product.price || product.currentPrice)}</span>
        ${
          product.oldPrice || product.originalPrice
            ? `<span class="old-price">${formatPrice(product.oldPrice || product.originalPrice)}</span>`
            : ''
        }
      </div>
      <p>
        ${product.description || product.shortDescription || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam fringilla augue nec est tristique auctor. Donec non est at libero vulputate rutrum. Morbi ornare lectus quis justo gravida semper. Nulla tellus mi, vulputate adipiscing cursus eu, suscipit id nulla.'}
      </p>

      <div class="single-add-to-cart">
        <form action="#" class="cart-quantity d-flex">
          <div class="quantity">
            <div class="cart-plus-minus">
              <input
                type="number"
                class="input-text"
                name="quantity"
                value="1"
                title="Qty" />
            </div>
          </div>
          <button class="add-to-cart" type="submit">
            Добавить в корзину
          </button>
        </form>
      </div>
      <ul class="single-add-actions">
        <li class="add-to-wishlist">
          <a href="wishlist.html" class="add_to_wishlist" data-product-id="${product.id || product._id}">
            <i class="icon-heart"></i>
            Добавить в избранное
          </a>
        </li>
        <li class="add-to-compare">
          <div class="compare-button">
            <a href="compare.html" data-product-id="${product.id || product._id}">
              <i class="icon-refresh"></i>
              Сравнить
            </a>
          </div>
        </li>
      </ul>
      <ul class="stock-cont">
        <li class="product-sku">
          Артикул:
          <span>${product.sku || product.article || 'P006'}</span>
        </li>
        <li class="product-stock-status">
          Категории:
          <a href="#">${product.category || 'Часы мужские'},</a>
          <a href="#">${product.subcategory || 'Премиум'}</a>
        </li>
        <li class="product-stock-status">
          Тег:
          <a href="#">${product.tag || 'Мужские'}</a>
        </li>
      </ul>
      <div class="share-product-socail-area">
        <p>Поделиться товаром</p>
        <ul class="single-product-share">
          <li>
            <a href="#"><i class="fa fa-facebook"></i></a>
          </li>
          <li>
            <a href="#"><i class="fa fa-twitter"></i></a>
          </li>
          <li>
            <a href="#"><i class="fa fa-pinterest"></i></a>
          </li>
        </ul>
      </div>
    </div>
  `
}

// Product description tabs template
export const createProductDescriptionTabs = (product) => {
  return `
    <div class="product-description-area section-pt">
      <div class="row">
        <div class="col-lg-12">
          <div class="product-details-tab">
            <ul role="tablist" class="nav">
              <li class="active" role="presentation">
                <a
                  data-bs-toggle="tab"
                  role="tab"
                  href="#description"
                  class="active">
                  Описание
                </a>
              </li>
              <li role="presentation">
                <a data-bs-toggle="tab" role="tab" href="#reviews">
                  Характеристики
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div class="col-lg-12">
          <div class="product_details_tab_content tab-content">
            <!-- Start Single Content -->
            <div
              class="product_tab_content tab-pane active"
              id="description"
              role="tabpanel">
              <div class="product_description_wrap mt-30">
                <div class="product_desc mb-30">
                  <p>
                    ${product.description || product.fullDescription || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam fringilla augue nec est tristique auctor. Donec non est at libero vulputate rutrum. Morbi ornare lectus quis justo gravida semper. Nulla tellus mi, vulputate adipiscing cursus eu, suscipit id nulla.'}
                  </p>

                  <p>
                    ${product.additionalDescription || 'Pellentesque aliquet, sem eget laoreet ultrices, ipsum metus feugiat sem, quis fermentum turpis eros eget velit. Donec ac tempus ante. Fusce ultricies massa massa. Fusce aliquam, purus eget sagittis vulputate, sapien libero hendrerit est, sed commodo augue nisi non neque. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed tempor, lorem et placerat vestibulum, metus nisi posuere nisl, in accumsan elit odio quis mi. Cras neque metus, consequat et blandit et, luctus a nunc. Etiam gravida vehicula tellus, in imperdiet ligula euismod eget.'}
                  </p>
                </div>
              </div>
            </div>
            <!-- End Single Content -->
          </div>
        </div>
      </div>
    </div>
  `
}

// Breadcrumb template
export const createBreadcrumb = (product) => {
  return `
    <div class="breadcrumb-area">
      <div class="container-xl">
        <div class="row">
          <div class="col-12">
            <!-- breadcrumb-list start -->
            <ul class="breadcrumb-list">
              <li class="breadcrumb-item">
                <a href="index.html">Главная</a>
              </li>
              <li class="breadcrumb-item">
                <a href="watch.html">Каталог</a>
              </li>
              <li class="breadcrumb-item active">${product.model || product.name || 'Product Details'}</li>
            </ul>
            <!-- breadcrumb-list end -->
          </div>
        </div>
      </div>
    </div>
  `
}

// Loading state template
export const createProductLoadingState = () => {
  return `
    <div class="product-loading" style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.8); display: flex; align-items: center; justify-content: center; z-index: 1000;">
      <div class="text-center" style="color: white;">
        <div style="font-size: 2rem; margin-bottom: 1rem;">
          <i class="fa fa-spinner fa-spin"></i>
        </div>
        <div style="font-size: 1.2rem;">
          Загрузка товара...
        </div>
      </div>
    </div>
  `
}

// Error state template
export const createProductErrorState = (errorMessage) => {
  return `
    <div class="col-12 text-center" style="padding: 3rem;">
      <div style="color: #ff6b6b; font-size: 1.4rem; margin-bottom: 1rem;">
        <i class="fa fa-exclamation-triangle"></i> Ошибка загрузки товара
      </div>
      <div style="color: #666; font-size: 1.1rem; margin-bottom: 2rem;">
        ${errorMessage}
      </div>
      <button onclick="window.location.reload()"
              style="background: #007bff; color: white; border: none; padding: 1rem 2rem; border-radius: 4px; cursor: pointer;">
        <i class="fa fa-refresh"></i> Попробовать снова
      </button>
    </div>
  `
}

// Fallback notice template
export const createFallbackNotice = () => {
  return `
    <div class="alert alert-info" style="margin-bottom: 2rem;">
      <i class="fa fa-info-circle"></i>
      <strong>Внимание:</strong> Товар временно недоступен через API. Показываются образцы данных.
    </div>
  `
}

// Utility function to format price
const formatPrice = (price) => {
  if (typeof price === 'number') {
    return `$${price.toFixed(2)}`
  }
  if (typeof price === 'string') {
    const numPrice = parseFloat(price)
    if (!isNaN(numPrice)) {
      return `$${numPrice.toFixed(2)}`
    }
    return price
  }
  return '$0.00'
}

// Create fallback product data
export const createFallbackProduct = (productId) => ({
  id: productId,
  brand: 'Time Sphere',
  model: 'Classic Watch',
  name: 'Time Sphere Classic Watch',
  price: 299,
  oldPrice: 350,
  description:
    'Этот товар временно недоступен через API. Показываются образцы данных.',
  fullDescription:
    'Классические наручные часы Time Sphere с премиальным дизайном и надежным механизмом. Идеально подходят для деловых встреч и повседневного ношения.',
  img: { path: '/img/products/2-450x450.jpg' },
  images: [
    { path: '/img/products/2-450x450.jpg', alt: 'Classic Watch Front' },
    { path: '/img/products/2-2-450x450.jpg', alt: 'Classic Watch Side' },
    { path: '/img/products/3-3-450x450.jpg', alt: 'Classic Watch Back' },
  ],
  category: 'watch',
  subcategory: 'premium',
  tag: 'мужские',
  sku: 'TS-CLASSIC-001',
  rating: 5,
  reviewsCount: 12,
  inStock: true,
})
