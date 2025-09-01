// API Error UI Component for displaying user-friendly error messages

export class ApiErrorUI {
  constructor() {
    this.errorContainer = null
    this.init()
  }

  init() {
    // Create error container if it doesn't exist
    if (!this.errorContainer) {
      this.errorContainer = document.createElement('div')
      this.errorContainer.id = 'api-error-container'
      this.errorContainer.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        max-width: 400px;
        background: #fee;
        border: 1px solid #fcc;
        border-radius: 8px;
        padding: 16px;
        margin: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        display: none;
      `

      document.body.appendChild(this.errorContainer)
    }
  }

  showError(message, type = 'error', duration = 5000) {
    this.init()

    // Set content and styling based on type
    this.errorContainer.innerHTML = `
      <div style="display: flex; align-items: flex-start; gap: 12px;">
        <div style="
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: ${type === 'error' ? '#dc3545' : '#ffc107'};
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 12px;
          font-weight: bold;
        ">${type === 'error' ? '!' : 'i'}</div>
        <div style="flex: 1;">
          <div style="
            font-weight: 600;
            margin-bottom: 4px;
            color: ${type === 'error' ? '#721c24' : '#856404'};
          ">${type === 'error' ? 'Error' : 'Warning'}</div>
          <div style="
            color: ${type === 'error' ? '#721c24' : '#856404'};
            font-size: 14px;
            line-height: 1.4;
          ">${message}</div>
        </div>
        <button onclick="this.parentElement.parentElement.style.display='none'" style="
          background: none;
          border: none;
          color: #999;
          cursor: pointer;
          font-size: 18px;
          padding: 0;
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
        ">&times;</button>
      </div>
    `

    // Show the error
    this.errorContainer.style.display = 'block'

    // Auto-hide after duration
    if (duration > 0) {
      setTimeout(() => {
        this.hideError()
      }, duration)
    }
  }

  hideError() {
    if (this.errorContainer) {
      this.errorContainer.style.display = 'none'
    }
  }

  showApiError(errorInfo) {
    let message = errorInfo.userMessage

    // Add specific guidance for common errors
    if (errorInfo.status === 412) {
      message += ' Please check your connection and try again.'
    } else if (errorInfo.status === 401) {
      message += ' Please check your authentication credentials.'
    } else if (errorInfo.status === 429) {
      message += ' Please wait a moment before trying again.'
    }

    this.showError(message, 'error', 8000)
  }
}

// Create a global instance
export const apiErrorUI = new ApiErrorUI()
