/**
 * Timer Component - Countdown functionality for deals and offers
 * Handles countdown display and updates for promotional timers
 */

class Timer {
  constructor() {
    this.timers = []
    this.init()
  }

  init() {
    this.findTimers()
    this.startCountdowns()
  }

  findTimers() {
    const timerElements = document.querySelectorAll('.countdown-deals')

    timerElements.forEach((element) => {
      const countdownDate = element.getAttribute('data-countdown')
      if (countdownDate) {
        this.timers.push({
          element: element,
          targetDate: new Date(countdownDate).getTime(),
        })
      }
    })
  }

  startCountdowns() {
    if (this.timers.length === 0) return

    // Update immediately
    this.updateAllTimers()

    // Update every second
    setInterval(() => {
      this.updateAllTimers()
    }, 1000)
  }

  updateAllTimers() {
    this.timers.forEach((timer) => {
      this.updateTimer(timer)
    })
  }

  updateTimer(timer) {
    const now = new Date().getTime()
    const distance = timer.targetDate - now

    if (distance < 0) {
      timer.element.innerHTML = '<span class="expired">Offer Expired</span>'
      return
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24))
    const hours = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
    )
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((distance % (1000 * 60)) / 1000)

    timer.element.innerHTML = `
      <div class="countdown-timer">
        <div class="time-unit">
          <span class="time-value">${this.padZero(days)}</span>
          <span class="time-label">D</span>
        </div>
        <div class="time-separator">:</div>
        <div class="time-unit">
          <span class="time-value">${this.padZero(hours)}</span>
          <span class="time-label">H</span>
        </div>
        <div class="time-separator">:</div>
        <div class="time-unit">
          <span class="time-value">${this.padZero(minutes)}</span>
          <span class="time-label">M</span>
        </div>
        <div class="time-separator">:</div>
        <div class="time-unit">
          <span class="time-value">${this.padZero(seconds)}</span>
          <span class="time-label">S</span>
        </div>
      </div>
    `
  }

  padZero(num) {
    return num.toString().padStart(2, '0')
  }
}

// Initialize timer when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new Timer()
})

// Export for potential external use
export default Timer
