// /**
//  * Share Modal Functionality
//  * Provides safe initialization and error handling for share buttons
//  */

// /**
//  * Safe share button initialization with null checks
//  */
// const initShareButtons = () => {
//   try {
//     // Find all share buttons safely
//     const shareButtons = document.querySelectorAll(
//       '.single-product-share a, .share-product-socail-area a',
//     )

//     if (shareButtons.length === 0) {
//       console.log('ℹ️ No share buttons found on this page')
//       return
//     }

//     shareButtons.forEach((button) => {
//       // Only add event listener if element exists and has required attributes
//       if (button && typeof button.addEventListener === 'function') {
//         button.addEventListener('click', handleShareClick)
//         console.log('✅ Share button initialized:', button.className)
//       }
//     })

//     console.log(`🔗 Initialized ${shareButtons.length} share buttons`)
//   } catch (error) {
//     console.warn('⚠️ Error initializing share buttons:', error.message)
//   }
// }

// /**
//  * Handle share button clicks
//  */
// const handleShareClick = (event) => {
//   event.preventDefault()

//   const button = event.currentTarget
//   const icon = button.querySelector('i')

//   if (!icon) {
//     console.warn('Share button has no icon element')
//     return
//   }

//   // Determine share platform based on icon class
//   const platform = getSharePlatform(icon.className)
//   const shareData = getShareData()

//   if (platform && shareData) {
//     openShareWindow(platform, shareData)
//   }
// }

// /**
//  * Get share platform from icon class
//  */
// const getSharePlatform = (iconClass) => {
//   if (iconClass.includes('fa-facebook')) return 'facebook'
//   if (iconClass.includes('fa-twitter')) return 'twitter'
//   if (iconClass.includes('fa-pinterest')) return 'pinterest'
//   if (iconClass.includes('fa-linkedin')) return 'linkedin'
//   return null
// }

// /**
//  * Get current page share data
//  */
// const getShareData = () => {
//   const url = encodeURIComponent(window.location.href)
//   const title = encodeURIComponent(document.title || 'Time Sphere Watches')
//   const description = encodeURIComponent(
//     document.querySelector('meta[name="description"]')?.content ||
//       'Discover luxury watches at Time Sphere',
//   )

//   return { url, title, description }
// }

// /**
//  * Open share window for specific platform
//  */
// const openShareWindow = (platform, { url, title, description }) => {
//   const shareUrls = {
//     facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
//     twitter: `https://twitter.com/intent/tweet?url=${url}&text=${title}`,
//     pinterest: `https://pinterest.com/pin/create/button/?url=${url}&description=${title}`,
//     linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
//   }

//   const shareUrl = shareUrls[platform]
//   if (shareUrl) {
//     const popup = window.open(
//       shareUrl,
//       'shareWindow',
//       'width=600,height=400,scrollbars=yes,resizable=yes',
//     )

//     if (popup) {
//       popup.focus()
//       console.log(`📤 Opened ${platform} share window`)
//     } else {
//       console.warn('Popup blocked, falling back to direct navigation')
//       window.open(shareUrl, '_blank')
//     }
//   }
// }

// /**
//  * Initialize share modal functionality with retry mechanism
//  */
// const initShareModal = () => {
//   // Wait for DOM to be fully loaded
//   if (document.readyState === 'loading') {
//     document.addEventListener('DOMContentLoaded', () => {
//       setTimeout(initShareButtons, 100) // Small delay to ensure all elements are rendered
//     })
//   } else {
//     // DOM is already loaded, initialize immediately
//     setTimeout(initShareButtons, 100)
//   }
// }

// /**
//  * Retry initialization if elements are not found initially
//  */
// const retryInitialization = () => {
//   let retryCount = 0
//   const maxRetries = 5
//   const retryInterval = 500

//   const retry = () => {
//     const shareButtons = document.querySelectorAll(
//       '.single-product-share a, .share-product-socail-area a',
//     )

//     if (shareButtons.length > 0 || retryCount >= maxRetries) {
//       if (shareButtons.length > 0) {
//         initShareButtons()
//       }
//       return
//     }

//     retryCount++
//     setTimeout(retry, retryInterval)
//   }

//   retry()
// }

// // Auto-initialize
// initShareModal()

// // Also try with retry mechanism for dynamically loaded content
// setTimeout(retryInitialization, 1000)

// // Export for manual initialization if needed
// export { initShareButtons, initShareModal }
