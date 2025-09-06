/**
 * Fact Counter Animation
 * Animates counters when the fact area comes into view
 */

export function initFactCounter() {
  const factArea = document.getElementById('fact-area')
  if (!factArea) return

  const counters = factArea.querySelectorAll('.counter')
  if (counters.length === 0) return

  let hasAnimated = false

  // Intersection Observer to trigger animation when section is visible
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !hasAnimated) {
          hasAnimated = true
          animateCounters()
        }
      })
    },
    {
      threshold: 0.3, // Trigger when 30% of the section is visible
      rootMargin: '0px 0px -50px 0px', // Start animation slightly before fully visible
    },
  )

  observer.observe(factArea)

  function animateCounters() {
    counters.forEach((counter) => {
      const target = parseInt(counter.getAttribute('data-count'))
      const duration = 2000 // Animation duration in milliseconds
      const increment = target / (duration / 16) // 60fps
      let current = 0

      const timer = setInterval(() => {
        current += increment
        if (current >= target) {
          current = target
          clearInterval(timer)
        }
        counter.textContent = Math.floor(current).toLocaleString()
      }, 16) // ~60fps
    })
  }
}

// Auto-initialize if DOM is already loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initFactCounter)
} else {
  initFactCounter()
}
