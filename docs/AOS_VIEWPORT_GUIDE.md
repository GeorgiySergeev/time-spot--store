# AOS Viewport Configuration Guide

## Overview

This guide explains how AOS (Animate On Scroll) is configured to trigger animations when elements enter the viewport in the Time-Sphere project.

## Current Configuration

### Global Settings

The AOS library is configured in `src/js/functions/aos.js` with the following viewport-optimized settings:

```javascript
AOS.init({
  duration: 1000, // Animation duration
  easing: 'ease-in-out', // Smooth easing
  once: true, // Animate only once
  mirror: false, // No reverse animation
  anchorPlacement: 'top-bottom', // Trigger when top of element hits bottom of viewport
  offset: 50, // 50px offset from trigger point (reduced from 120px)
  delay: 0, // No delay
  disable: false, // Always enabled
})
```

### Responsive Settings

The project uses `initAOSResponsive()` which provides different settings for mobile and desktop:

- **Mobile (≤768px)**: 30px offset, 800ms duration
- **Desktop (>768px)**: 50px offset, 1000ms duration

## How Viewport Detection Works

1. **Trigger Point**: Elements animate when their top edge reaches 50px (desktop) or 30px (mobile) from the bottom of the viewport
2. **Animation Direction**: Elements start hidden and animate to visible state
3. **One-time Animation**: Each element animates only once when first entering viewport

## Usage in HTML

### Basic Usage

```html
<div data-aos="fade-up">This element will fade up when entering viewport</div>
```

### Available Animations

```html
<!-- Fade animations -->
<div data-aos="fade-up">Fade Up</div>
<div data-aos="fade-down">Fade Down</div>
<div data-aos="fade-left">Fade Left</div>
<div data-aos="fade-right">Fade Right</div>

<!-- Zoom animations -->
<div data-aos="zoom-in">Zoom In</div>
<div data-aos="zoom-out">Zoom Out</div>

<!-- Slide animations -->
<div data-aos="slide-up">Slide Up</div>
<div data-aos="slide-down">Slide Down</div>
```

### Custom Settings per Element

```html
<!-- Custom offset and duration -->
<div data-aos="fade-up" data-aos-offset="100" data-aos-duration="1500">
  Custom settings
</div>

<!-- Custom delay -->
<div data-aos="fade-up" data-aos-delay="200">Delayed animation</div>
```

## Project-Specific Configuration

### Banner Elements

Banner elements (`.single-banner`) are configured with:

- **Offset**: 30px (earlier trigger)
- **Duration**: 800ms

### Section Elements

Section elements (`.section-pt`) are configured with:

- **Offset**: 40px
- **Duration**: 1000ms

## CSS Enhancements

Custom CSS in `src/styles/vendor.scss` ensures proper initial states:

```scss
[data-aos] {
  opacity: 0;
  transition-property: opacity, transform;
}

[data-aos].aos-animate {
  opacity: 1;
}
```

## Troubleshooting

### Elements Not Animating

1. **Check data-aos attribute**: Ensure elements have `data-aos="animation-type"`
2. **Verify AOS initialization**: Check browser console for AOS initialization message
3. **Check viewport position**: Elements must be within the trigger offset distance
4. **Refresh AOS**: Call `AOS.refresh()` after dynamic content changes

### Animation Too Early/Late

1. **Adjust global offset**: Modify `offset` value in `initAOSResponsive()`
2. **Per-element offset**: Use `data-aos-offset="value"` on specific elements
3. **Custom configuration**: Use `configureAOSForElements()` for specific selectors

### Performance Issues

1. **Reduce animation duration**: Lower `duration` values
2. **Disable on mobile**: Add `disable: 'mobile'` to AOS.init()
3. **Throttle settings**: Adjust `throttleDelay` for scroll performance

## API Reference

### Functions Available

```javascript
import {
  initAOS,
  initAOSResponsive,
  configureAOSForElements,
  refreshAOS,
} from './functions/aos.js'

// Initialize with responsive settings
initAOSResponsive()

// Configure specific elements
configureAOSForElements('.my-elements', {
  offset: 100,
  duration: 1200,
})

// Refresh after dynamic content changes
refreshAOS()
```

### Animation Constants

```javascript
import { AOSAnimations } from './functions/aos.js'

// Use predefined animation types
element.setAttribute('data-aos', AOSAnimations.FADE_UP)
```

## Best Practices

1. **Use appropriate animations**: Choose animations that match your content
2. **Test on mobile**: Ensure animations work well on smaller screens
3. **Performance**: Avoid too many simultaneous animations
4. **Accessibility**: Consider users who prefer reduced motion
5. **Content loading**: Refresh AOS after loading dynamic content

## Example Implementation

```html
<!-- Banner with custom settings -->
<div class="single-banner" data-aos="fade-up" data-aos-offset="30">
  <img src="banner.jpg" alt="Banner" />
</div>

<!-- Section with default settings -->
<section class="section-pt" data-aos="fade-up">
  <h2>Section Title</h2>
  <p>Section content...</p>
</section>
```

This configuration ensures smooth, responsive animations that trigger reliably when elements enter the viewport.
