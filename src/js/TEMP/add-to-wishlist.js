// Lightweight wishlist management with delegated events
// Persists a list of product ids in localStorage under key 'wishlist'

const WISHLIST_KEY = 'wishlist'

const readWishlist = () => {
  try {
    const raw = localStorage.getItem(WISHLIST_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed.map(String) : []
  } catch (_) {
    return []
  }
}

const writeWishlist = (ids) => {
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(ids))
}

const isInWishlist = (id) => {
  const list = readWishlist()
  return list.includes(String(id))
}

const addToWishlist = (id) => {
  const list = readWishlist()
  const sid = String(id)
  if (!list.includes(sid)) {
    list.push(sid)
    writeWishlist(list)
  }
}

const removeFromWishlist = (id) => {
  const list = readWishlist()
  const sid = String(id)
  const next = list.filter((x) => x !== sid)
  writeWishlist(next)
}

const setWishlistActiveState = (el, active) => {
  if (!el) return
  if (active) {
    el.classList.add('active')
    el.classList.remove('not-active')
    el.setAttribute('aria-pressed', 'true')
    el.title = 'В избранном'
  } else {
    el.classList.remove('active')
    el.classList.add('not-active')
    el.setAttribute('aria-pressed', 'false')
    el.title = 'Добавить в избранное'
  }
}

const initWishlistButtonsState = (root = document) => {
  const buttons = root.querySelectorAll('.wishlist-btn, .add_to_wishlist')
  buttons.forEach((btn) => {
    const id = btn.getAttribute('data-product-id')
    if (!id) return
    setWishlistActiveState(btn, isInWishlist(id))
  })
}

// Delegated click handling for dynamically rendered buttons
document.addEventListener('click', (event) => {
  const target = event.target
  if (!target) return
  const btn =
    target.closest && target.closest('.wishlist-btn, .add_to_wishlist')
  if (!btn) return

  const productId = btn.getAttribute('data-product-id')
  if (!productId) return

  // Prevent navigation to wishlist page on add/remove action
  event.preventDefault()

  if (isInWishlist(productId)) {
    removeFromWishlist(productId)
    setWishlistActiveState(btn, false)
  } else {
    addToWishlist(productId)
    setWishlistActiveState(btn, true)
  }
})

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  initWishlistButtonsState(document)

  // Observe async product rendering and update button states
  const productsContainer = document.getElementById('products')
  if (productsContainer && typeof MutationObserver !== 'undefined') {
    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.addedNodes && m.addedNodes.length > 0) {
          m.addedNodes.forEach((node) => {
            if (node.nodeType === 1) {
              initWishlistButtonsState(node)
            }
          })
        }
      }
    })
    observer.observe(productsContainer, { childList: true, subtree: true })
  }
})

// Optional: expose helpers for debugging
if (typeof window !== 'undefined') {
  window.wishlistStore = {
    read: readWishlist,
    write: writeWishlist,
    add: addToWishlist,
    remove: removeFromWishlist,
    has: isInWishlist,
  }
}
