/**
 * Telegram Subscription Tracking
 * Handles analytics and user experience for Telegram channel subscription
 * Auto-opens modal after 30 seconds of page load
 */

// Auto-open modal configuration
let autoModalShown = false
const AUTO_MODAL_DELAY = 30000 // 30 seconds

// Track Telegram subscription click
window.trackTelegramSubscription = function () {
  // Analytics tracking (replace with your analytics service)
  if (typeof gtag !== 'undefined') {
    gtag('event', 'telegram_subscribe_click', {
      event_category: 'engagement',
      event_label: 'telegram_channel',
    })
  }

  // You can also track with other analytics services
  if (typeof fbq !== 'undefined') {
    fbq('track', 'Lead', {
      content_name: 'Telegram Subscription',
    })
  }

  // Console log for debugging
  console.log('Telegram subscription clicked')

  // Close modal after a short delay to allow the link to open
  setTimeout(() => {
    const modal = bootstrap.Modal.getInstance(
      document.getElementById('telegramSubscribeModal'),
    )
    if (modal) {
      modal.hide()
    }
  }, 500)
}

// Function to show telegram modal
function showTelegramModal() {
  const telegramModal = document.getElementById('telegramSubscribeModal')
  if (telegramModal && !autoModalShown) {
    const modal = new bootstrap.Modal(telegramModal, {
      backdrop: true,
      keyboard: true,
    })
    modal.show()
    autoModalShown = true

    // Track auto-modal open
    if (typeof gtag !== 'undefined') {
      gtag('event', 'telegram_modal_auto_open', {
        event_category: 'engagement',
        event_label: 'auto_popup_30s',
      })
    }

    console.log('Telegram modal auto-opened after 30 seconds')
  }
}

// Check if user has already seen the modal (localStorage)
function hasSeenTelegramModal() {
  return localStorage.getItem('telegram_modal_shown') === 'true'
}

// Mark modal as seen
function markTelegramModalAsSeen() {
  localStorage.setItem('telegram_modal_shown', 'true')
  // Expire after 24 hours
  localStorage.setItem(
    'telegram_modal_expiry',
    Date.now() + 24 * 60 * 60 * 1000,
  )
}

// Check if modal display period has expired
function isModalDisplayExpired() {
  const expiry = localStorage.getItem('telegram_modal_expiry')
  return expiry && Date.now() > parseInt(expiry)
}

// Initialize Telegram subscription modal functionality
document.addEventListener('DOMContentLoaded', function () {
  const telegramModal = document.getElementById('telegramSubscribeModal')

  if (telegramModal) {
    // Add event listener for modal shown event
    telegramModal.addEventListener('shown.bs.modal', function () {
      // Track modal open
      if (typeof gtag !== 'undefined') {
        gtag('event', 'telegram_modal_open', {
          event_category: 'engagement',
          event_label: 'telegram_modal',
        })
      }

      // Mark as seen when manually opened or auto-opened
      markTelegramModalAsSeen()
    })

    // Add keyboard navigation
    telegramModal.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && e.target.closest('.modal-content')) {
        const subscribeBtn = telegramModal.querySelector('.btn-telegram')
        if (subscribeBtn) {
          subscribeBtn.click()
        }
      }
    })

    // Auto-open modal after 30 seconds if not seen recently
    if (isModalDisplayExpired() || !hasSeenTelegramModal()) {
      setTimeout(showTelegramModal, AUTO_MODAL_DELAY)
      console.log('Telegram modal will auto-open in 30 seconds')
    } else {
      console.log('Telegram modal auto-open skipped - already shown recently')
    }
  }
})
